# Frida 逆向入门之 Java 层 Hook

Frida 是一个动态插桩工具，可以插入一些代码到原生 App 的内存空间去动态监视和修改其行为。

```
getprop ro.product.cpu.abi : 查看系统的架构
```

1.  Java.perform() Hook 普通及重载函数

    MainAcitivity.fun.implementation 和 MainAcitivity.fun.implementation.overload('int','int')

2.  Java 层主动调用

    类中方法分为静态方法和实例方法。

    静态方法用 static 关键词修饰，只要类函数被 public 修饰，外部可以直接通过类去调用。

    实例方法需要通过创建类的实例再通过这个实例去调用。

    ```
    // 静态方法调用
    var MainAcitivity = Java.use('com.roysue.demo02.MainActivity')
    MainAcitivity.staticSecret();

    // 实例方法调用
    Java.choose('com.roysue.demo02.MainActivity',{
            onMatch: function(instance){
                console.log('instance found',instance)
                instance.secret()
            },
            onComplete: function(){
                console.log('search Complete')
            }
        })
    ```

3.  RPC（Remote Procedure Call，远程过程调用）及其自动化

    ```
    rpc.exports = {
        callsecretfunc : CallSecretFunc,
        gettotalvalue : getTotalValue
    }
    用来导出函数，导出名不可以有大写字母或者下划线。
    ```

    ```python
    import frida  # 导入 Frida 模块，用于动态分析和 Hook Android 应用

    # 定义消息处理函数，用于接收 Frida 脚本中的消息
    def on_message(message, data):
        if message['type'] == 'send':  # 如果消息类型是 'send'，表示脚本主动发送的数据
            print("[*] {0}".format(message['payload']))  # 打印消息的 payload 内容
        else:
            print(message)  # 处理其他类型的消息（如错误信息）

    # 获取连接的 USB 设备（即正在调试的 Android 设备）
    device = frida.get_usb_device()

    # 附加到目标应用（包名为 'com.roysue.demo02'），以便注入 Frida 脚本
    process = device.attach('com.roysue.demo02')

    # 读取 JavaScript 注入脚本
    with open('4.js') as f:
        jscode = f.read()

    # 创建 Frida 脚本对象
    script = process.create_script(jscode)

    # 监听 Frida 脚本发送的消息，并调用 `on_message` 进行处理
    script.on('messsage', on_message)

    # 加载 Frida 脚本，使其开始运行
    script.load()

    # 循环等待用户输入命令
    command = ""
    while True:
        command = input("\nEnter command:\n1:Exit\n2:Call secret function\n3:Get Total Value\nchoice:")  # 提示用户输入命令
        if command == "1":  # 如果输入 "1"，则退出循环
            break
        elif command == "2":  # 如果输入 "2"，则调用 Frida 脚本中的 `callsecretfunc` 方法
            script.exports.callsecretfunc()
        elif command == "3":  # 如果输入 "3"，则调用 Frida 脚本中的 `gettotalvalue` 方法
            script.exports.gettotalvalue()
    ```

    如果编写一个循环自动调用这两个函数呢？如果导出的是关键的算法函数呢？这就是自动化了。

    由于我懒惰的原因，我没有亲身实践demo2的远程过程调用及其自动化，在此谢不敏。


