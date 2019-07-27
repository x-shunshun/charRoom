//使用express框架
var app = require('express')();
var server = require('http').Server(app);

//引入socket.io
var io = require('socket.io')(server);

//记录所有已经登录过的用户
const users = []



//启动了服务器，监听8080端口
server.listen(8080,()=>{
	console.log("服务器启动成功")
});




//express处理静态资源
//把public目录设置为静态资源目录
app.use(require("express").static("public"))


app.get('/', function (req, res) {
	//res.sendFile(__dirname + '/index.html');
	//重定向到public目录下的index.html
  	res.redirect("/index.html")
});

//各种事件
io.on('connection', function (socket) {
	socket.on("login",data=>{
		//判断如果data在users中存在，说明该用户已经登录了，不允许登录。否则允许
		let user = users.find(item => item.username === data.username);
		if(user)
		{
			//表示用户存在，登录失败。服务器需要给当前用户响应，告诉登录失败
			socket.emit("loginError",{msg:"登录失败"});
			console.log("登录失败")
		}else{
			//表示用户不存在，登录成功
			//将当前用户信息储存到users里面
			users.push(data)
			console.log(users)
			//告诉用户登录成功
			socket.emit("loginSuccess",data)
			// console.log("登录成功")
			
			//socket.emit:告诉当前用户
			//io.emit:广播事件

			//告诉所有的用户，有用户加入了聊天室，广播消息
			io.emit("addUser",data)

			//将所有的用户到分发到浏览器中，这就是群成员
			io.emit("allUser",users)
			// console.log(users)

			//把登录成功的用户名和头像存储起来
			socket.username = data.username;
			socket.avatar = data.avatar;
		}
	});

	


	//用户断开连接的功能
	//监听用户断开连接
	socket.on("disconnect",()=>{
		//把当前用户的信息users中删掉
		let idx = users.findIndex(item => item.username === socket.username);
		//删除掉断开连接的这个人
		users.splice(idx,1)
		//1、告诉所有人，有人离开了聊天室
		io.emit("delUser",{
			username:socket.username,
			avatar:socket.avatar
		})
		//2、告诉所有人，allUser发生更新
		io.emit("allUser",users)
	})

	//监听聊天的消息
	socket.on("sendMsg",data=>{
		//广播给所有用户
		io.emit("recieveMsg",data)
	})
});