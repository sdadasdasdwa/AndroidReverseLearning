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

4. 在manifest.xml中配置网络权限，运行后拿到谷歌的页面数据。

### HttpURLConnection自吐脚本开发

从上述使用HttpURLConnection的步骤中，我们可以看到：

+ URL类的构造函数
+ setRequestMethod和setRequestProperty设置请求头和请求参数等信息
+ getInputStream函数获取response

1. 先Hook整个URL类，然后使用watch class_method来Hook URL的构造方法。
```Frida
android hooking watch class java.net.URL
android hooking watch class_method java.net.URL.$init --dump-args --dump-backtrace --dump-return
```

根据打印的堆栈来看，就选取调用栈最浅的java.net.ULR.$init(java.lang.String)函数完成自吐脚本。

```javascript
function main(){
    java.perform(function(){
        var URL = Java.use('java.net.URL')
        URL.$init.overload('java.lang.String').implemention = function(urlstr){
            console.log('url => ' + urlstr)
            var result = this.$init(urlstr)
            return result
        }
    })
}
setImmediate(main)
```

2. 根据上一步整理的关键收发包函数会发现剩下的都是HttpURLConnection类中的函数，于是对其整个类和构造函数进行Hook
```Frida
android hooking watch class java.net.HttpURLConnection
android hooking watch class_method java.net.HttpURLConnection.$init --dump-args --dump-backtrace --dump-return
```
结果发现只有构造函数和一个java.net.HttpURLConnection.getFollowRedirects()函数被调用了

使用以下objection命令获取HTTPURLConnection的实例时，发现不存在任何实例：
```Frida
android heap search instances java.net.HttpURLConnection

<!-- 使用wallbreaker插件搜索实例 -->
plugin wallbreaker objectionsearch java.net.HttpURLConnection
```

有两种方法获取：
- 纯逆向方法。通过Frida Hook打印出openConnection函数的返回值的类名result.$className
  或者用Objection Hook openConnection函数只不过发现类名的后面出现本次连接的网址字符串。

- 通过AS中debug功能在底部看到connect的类名。

3. 根据上一步确认的HttpConnectionImp具体实现类后进行watch class
```Frida
android Hooking watch class com.android.okhttp.internal.hue.HttpURLConnectionImpl
```
最终发现Demo使用额每个函数都被调用到了。

最终获取请求参数的自吐脚本：
```javascript
function main(){
    Java.perform(function(){
        var HttpURLConnectionImpl = Java.use('com.android.okhttp.internal.huc.HttpURLConnectionImpl')
        HttpURLConnectionImpl.setRequestProperty.implementation = function(key, value){
            console.log('setRequestProperty key: => ',key,',value:', value)
        }
    })
}
```

到这里HttpURLConnection的自吐脚本暂时开发完毕了，读者可以进一步开发，从而构成一个完整的网络通讯库自吐脚本。

   
