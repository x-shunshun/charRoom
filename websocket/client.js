    var oUl=document.getElementById('content');
    var oConnect=document.getElementById('connect');
    var oSend=document.getElementById('send');
    var oInput=document.getElementById('message');
    var ws=null;
    oConnect.onclick=function(){
        ws=new WebSocket('ws://localhost:5000');
        //创建WebSocket对象

         ws.onopen=function(){
             oUl.innerHTML+="<li>客户端已连接</li>";
         }
         //当与服务器简历连接的时候打印

        ws.onmessage=function(evt){
            oUl.innerHTML+="<li>"+evt.data+"</li>";
        }
        //当接收到服务器端发送的数据时显示

        ws.onclose=function(){
            oUl.innerHTML+="<li>客户端已断开连接</li>";
        };
        //当关闭连接时打印

        ws.onerror=function(evt){
            oUl.innerHTML+="<li>"+evt.data+"</li>";
        };
    };

    //向服务端发送数据
    oSend.onclick=function(){
        if(ws){
            ws.send(oInput.value);
        }
    }