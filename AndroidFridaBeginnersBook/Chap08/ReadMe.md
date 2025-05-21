# Hook 抓包实战

    上一章虽然展示如何使用Hook方式进行模拟抓包并且提供了一个通用的Hook方法来快速确定收发函数。

## 常见的网络通信框架

HTTP(S): 原生Android网络HTTP通信库主要使用HttpURLConnectoin和HttpClient两个类完成数据的发送和接收。
但是在Android6.0就取消使用HttpClient类，同时由于网络通信操作涉及异步、多线程和效率等问题，HTTPURLConnection
没有对此作封装，所以更多使用第三方网络通信框架。

WebSocket:实时通信，如在线聊天、游戏、股价更新。借鉴Socket全双工端对端通信的思想，全双工通信方式，长连接连接方式、
任意传输格式，建立前依赖HTTP握手，建立连接后客户端和服务端可互相主动发送消息。

XMPP(Extensible Messageing and presence Protocol, 可扩展与消息存在协议)：基于XML的通信协议，最初设计用于
及时通信。本质上也是长连接、双向通信，支持身份认证、状态显示、群聊、离线消息等功能。可通过XEP扩展功能，如文件传输、加密。


## 系统自带HTTP网络通信库HttpURLConnection

HTTPURLConnection的基本使用方式：

1. 新建URL对象，然后通过openCOnnection()函数获取HttpURLConnection实例。
```Java
URL url = new URL("http://www.google.com")
HttpURLConnection connection = (HttpURLConnection)url.openConnection()
```

2. 按照HTTP建立连接流程设置HTTP请求头和参数消息
```Java
connection.setRequestMethod("GET")
connection.setRequestProperty("token","55")
connection.setConnectionTimeout(5000)
connection.setReadTimeout(5000)
```

3. 调用getInputStream函数与服务器连接并获取返回的输入流，最后及时关闭
```Java
InputStream in = connection.getInputStream()

int bufferSize = 1024
byte[] buffer = new byte[bufferSize]
StringBuffer sb = new StringBuffer()
while(in.read(buffer)!= -1){
    sb.append(new String(buffer))
}

connection.disconnect()
```
