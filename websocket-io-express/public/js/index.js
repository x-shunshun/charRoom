/*
 聊天室的主要功能
 *
 *1.连接socketio服务*/
 
var socket = io("http://localhost:8080")

//2.登录功能
$(".img_ul li").on("click",function(){
    $(this).children("img").addClass("active").parent("li").siblings("li").children("img").removeClass("active");
});

//设置用户
var user = "";


//3点击登录按钮进行登录
$("#login_btn").on("click",function(){
    //获取用户名
    var username = $("#username").val().trim();

    if(!username)
    {
        alert("请输入用户名");
        return
    }
    
    if(username.length>12)
    {
    	alert("请输入小于12位数的用户名");
        return
    }

    //获取选中的头像
    var avatar = $(".img_ul .img_lis img.active").attr("src");


    //需要告诉socketio服务，登录(传输数据到服务器端)
    socket.emit("login",{
        username:username,
        avatar:avatar
    })
});

//监听输入框是否有内容，若有，则让按钮可点击。否则不可点击
$("#textarea").keyup(function(){
	if($(this).val().length > 0)
	{
		$("#send_btn").addClass("active");
	}else{
		$("#send_btn").removeClass("active");
	}
})



//监听登录关了失败的请求
socket.on("loginError",data=>{
    alert("用户名已经存在")
});

//监听登录成功的请求
socket.on("loginSuccess",data=>{
    //需要隐藏登录框，显示聊天窗口。
    $(".login_box").fadeOut();
    $(".liaotian_box").fadeIn();
	
	//获取当前用户信息并存储
	user = data;
	
    //设置个人信息
    $("#user_msg .user_img").attr("src",data.avatar);
    $("#user_msg .user_name").text(data.username);
});

//监听添加用户的消息
socket.on("addUser",data=>{
    $("#liaotian_right_content").append(`
    <div class="liaotian_lis"> 
        <div class="liaotian_content_user liaotian_content_toop">
            “${data.username}”加入了群聊
        </div>
    </div>`)
    //当前元素的底部滚动到可视区
    scrollIntoView()
})

//监听用户离开的消息
socket.on("delUser",data=>{
    $("#liaotian_right_content").append(`
    <div class="liaotian_lis"> 
        <div class="liaotian_content_user liaotian_content_toop">
            “${data.username}”离开了群聊
        </div>
    </div>`)
    //当前元素的底部滚动到可视区
    scrollIntoView()
})

//监听添加用户的信息,添加成群成员
socket.on("allUser",data=>{
    var add_qun_user = ""
    for(var i=0;i<data.length;i++)
    {
        add_qun_user += ''
    }
    $(".now_user_num").text(data.length)
    $("#liaotian_user_ul").html("");
    data.forEach(item => {
        $("#liaotian_user_ul").append(`
	        <li class="user_lis">
	            <img class="user_img" src="${item.avatar}" />
	            <div class="user_name row_one_overHide_nowrap color_fff">
	               ${item.username}
	            </div>
	        </li>
        `)
    });
})

//点击发送按钮发送消息到服务器
$("#send_btn").on("click",function(){
    if(!$(this).hasClass("active"))
    {   
        alert("请输入内容");
        return false;
    }
	var msg = $("#textarea").val().trim();
    $("#textarea").val("")
    if(!msg)
    {
        alert("请输入内容");
        return
    }
	//需要告诉socketio服务，发送消息(传输数据到服务器端)
    socket.emit("sendMsg",{
        username:user.username,
        avatar:user.avatar,
        msg:msg
        // time:new Date()
    })
})


//监听聊天的消息
socket.on("recieveMsg",data=>{
    //把接收到的消息显示到聊天窗口中
    if(data.username === user.username)
    {
        //自己的消息
        $("#liaotian_right_content").append(`
            <div class="liaotian_lis">
                <div class="liaotian_content_user liaotian_content_me">
                    <div class="liaotian_user_left">
                        <img class="liaotian_user_touxiang" src="${data.avatar}" />
                    </div>
                    <div class="liaotian_user_right magn_right_10">
                        <div class="liaotian_user_msg">${data.msg}</div>
                    </div>
                </div>
            </div>
        `)
    }else{
        //别人的消息
        $("#liaotian_right_content").append(`
            <div class="liaotian_lis">
                <div class="liaotian_content_user liaotian_content_bieren">
                    <div class="liaotian_user_left">
                        <img class="liaotian_user_touxiang" src="${data.avatar}" />
                    </div>
                    <div class="liaotian_user_right magn_left_10">
                        <div class="liaotian_user_name">${data.username}</div>
                        <div class="liaotian_user_msg">${data.msg}</div>
                    </div>
                </div>
            </div>
        `)
    }
    //当前元素的底部滚动到可视区
    scrollIntoView()
})


function scrollIntoView(){
    //当前元素的底部滚动到可视区
    $("#liaotian_right_content").children(":last").get(0).scrollIntoView(false)
}