# Chapter7 抓包详解

    介绍http/https搭配抓包工具使用。

    应用层：http(s)抓包协议

    会话层：Socket通信抓包

## Http抓包配置

ifconfig指令查看设备ip,例如192.168.165.184：

![ifconfig cmd](./picture/image1.png)

ipconfig查看设备ip，例如192.168.165.10：

![ipconfig cmd](./picture/image2.png)

通过ping测试连通性：

![ping cmd](./picture/image3.png)

给设备端设置手动代理，配置主机号和端口号：

![手动代理](./picture/image4.png)

注意，这种方式很容易被App代码检测或绕过，比如：

```java
System.getProperty("http.proxyHost");
System.getProperty("http.proxyPort");
```

相对于直接从应用层设置WLAN代理的方式，VPN代理则通过虚拟出一个新的网卡，从网络层加上该层代理，比较容易绕过。

这里用postern软件作为示例。

代理配置：

![postern代理配置](./picture/image5.png)

规则配置：

![postern规则配置](./picture/image6.png)

Burp Suite那边配置好监听端口后开启拦截：

![burp拦截成功](./picture/image7.png)





