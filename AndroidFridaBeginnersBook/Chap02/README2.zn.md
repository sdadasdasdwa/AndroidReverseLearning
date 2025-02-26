# Chapter02
安卓逆向必备基础


+ 1. adb shell dumpsys activity top
    - 查看当前处于前台的 Activity
+ 2. adb shell dumpsys package <package-name>
    - 查看包含四大组件及 MIME 相关信息的包信息.
+ 3. adb shell dbinfo <package-name>
    - 查看应用App使用的数据库信息。
+ 4. adb shell screencap -p <path>
    - 用于执行截图操作并将其保存到 <path> 目录.
+ 5. adb shell pm list packages
    - 用于列出包名，末尾加-3是列出所有三方包名
+ 6. adb shell am
    - 用于启用或停止服务，发送广播、启动Activity等.
    - adb shell am start-activity -D -N <包名>/<类名> ： 逆向过程中以Debug模式启动App时使用该命令。
+ 7. netstat
    - 输出App连接的IP、端口、协议等网络相关信息，通常使用参数组合为-alpe.
    - netstat -alpe | grep xxx 用于查看所有sockets连接的IP和端口以及相应的进程名和pid.
    - netstat -alpe | grep org.asdasf 当前进程org.asdasf 正在进行https连接，对应pid为20023
+ 8. lsof 
    - 查看对应进程打开的文件.
    - lsof -p 21312 -l | grep db ：进程id为21312，所打开的数据库文件为cache_vedio.db及其对应的路径.
+ 9. adb shell input text <text>
    - 用于在屏幕选中的输入框内输入文字，不能输入中文
