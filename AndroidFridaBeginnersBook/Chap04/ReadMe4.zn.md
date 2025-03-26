# Objection快速逆向入门

Objection支持Android和IOS，是一款Hook框架Frida。

frida-ps -U | grep settings 通过frida-ps找到对应的App及包名

objection -g com.android.settings explore 注入

![com.android.setting hook](./picture/image1.png)

1. help xx : 出现当前命令的解释信息
    + help env 

2. jobs : 查看和管理当前Hook执行的内容
3. frida : 查看Frida相关信息

    ![frida command in objection](./picture/image2.png)

4. 内存漫游指令。

    + android hooking list classes : 列出内存中的所有类，内存中已加载的类会非常多，不筛选的话完全看不了。
  
    ![list classes](./picture/image3.png)
    
    + android hooking search classes <classname> : 搜索包含特定关键词的类。
    
    ![search classes](./picture/image4.png)

    + android hooking search methods <key> : 搜索包含关键词key的方法。内存中已加载的方法是已加载的类的数倍，搜索会非常耗时间。
  
    ![search methods](./picture/image5.png)

    + android hooking list class_methods <classname> : 在搜索到我们感兴趣的类后，用该命令查看该类中的所有方法。
  
    ![list class_methods](./picture/image6.png)

    + android hooking list activities/services : 列出进程所有的活动/服务。

    ![list activities/services](./picture/image7.png) 

    + android hooking watch class_method <methodname> : 对指定方法进行Hook
    
        ``` frida
        eg. android hooking watch class_method java.io.File.$init --dump-args --dump-backtrace --dump-return
        ```

        ![watch class_method](./picture/image8.png) 

    + android hooking watch class <classname> : 对指定类名中的所有函数的Hook
       
        ``` frida
        eg. android hooking watch class java.io.File
        ```

        ![watch class](./picture/image9.png) 


    + android heap : 主动调用在Objection中的使用

        1. 基于最简单的Java.choose的实现（搜索实例）

            对实例的搜索在Objection是使用以下命令实现的 : android heap search instances <classname>.
            以java.io.File类为例，搜索到很多File实例，并且打印出对应的Handle和toString的结果。

            ``` frida
            eg. android heap search instances java.io.File
            ```

            ![android heap search instances](./picture/image10.png) 


        2. 调用实例方法有两种。

            第一种使用以下命令调用实例方法 ： android heap execute <Handler> <methodname> , 这里的实例方法指的是没有参数的实例方法。
        
            ```frida
            eg. android heap execute 0x3606 getPath
            ```

            ![android heap execute](./picture/image11.png) 


            使用execute执行带参函数会报错，如果要执行带参函数，则需要先执行以下命令：

            ```frida
            android heap evaluate <Handle>
            ```

            ![android heap evaluate](./picture/image12.png) 

            heap evaluate 既可以执行有参函数，也可以执行无参函数。


## 反编译工具

介绍一下你可能会用到的工具。

+ Jadx
+ Jeb
+ GDA

## Objection结合Jeb分析

1. 使用GenyMotion模拟器配置Android环境

2. 恶意App打开后，adb连接自动断开，且无法通过USB连接上

    使用Jadx查看发现有一个USBLock相关类。类中执行setprop persist.sys.usb.config none的命令。

    使用Termux软件在手机上模拟Linux环境，提供命令行界面让用户与系统进行互动。frida-server --help发现可以被网络监听

    ```
    objection -N(Network) -h(host) 192.xxx.xxx.xxx -p 8888 -g com.xxxx.xxxxx explore
    ```

    android hooking list services遍历服务初步确定是MyServiceOne.

    ```
    // 由于不确定是该类中哪一个函数，所以使用命令hook整个类
    android hooking watch class com.xxx.xxx.MyServiceOne
    ```

    打印发现MyServiceOne.access$L 1000018函数一直被调用，通过Jeb查看其中并没有内容，于是寻找哪个位置调用该方法。

    跟踪过去发现这个函数就是导致音量一直调到最大的原因。

    ```java
    public void run(){
        MyserviceOne.this.hand2.postDelayed(this, (long)1800);
        Objection v1 = MyServiceOne.this.getSystemService("audio");
        v1.setStreamVolume(3, v1.getStreamMaxVolume(3), 4);
        v1.getStreamMaxVolume(0);
        v1.getStreamVolume(0);
        MyServiceOne.this.getApplication().getSystemService("vibrate").vibrate(new long[]{100,1500,100,1500}, -1);
    }
    ```

3. 当单击“解除锁定”按钮后，发现又有几个函数被打印。

    按照“先打印出来的函数先调用”的原则，我们发现最上层的方法是MyServiceOne.xxx(java.lang.String).

    ```
    // 对具体的方法进行Hook
    android hooking watch class_method com.xxx.xxx.MyServiceOne.xxx --dump-args --dump-backtrace --dump-return
    ```
    
    调用栈的打印顺序与watch class命令的打印结果不同，这里调用栈下方的函数是先调用的。在这里最先调用的是MyServiceOne$10002.onClick()函数.

    这对定位关键函数的帮助是巨大的。

## frida开发思想

1. Objection辅助定位

    ```
    // 列出活动
    android hooking list activities

    // 选择分析的目标activity为计算器的相关活动com.example.junior.CaluculatorActivity,尝试启动该活动类
    android intent launch activity com.example.CaculatorActivity

    // 列出类中的方法，验证函数是否存在
    android hooking list class_methods com.example.CalculatorActivity

    // hook方法
    android hooking watch class_method com.example.CalculatorActivity.caculate --dump-args --dump-backtrace --dump-return
    ```

    在这个函数源码中，对减法的处理是通过Arith.sub()函数来实现的，为了验证Arith类在函数中是否存在，遍历所有类.

    ```
    android hooking list classes
    ```

    Tips: 这行命令列出的很多类，甚至可能超过整个Terminal缓存空间, 检查 `~/.objection` 目录并清空objection.log文件后重新注入。

    ```
    android hooking watch class_method com.example.xxx.sub --dump-args --dump-backtrace --dump--return
    ```

    ```shell
    // 查看内存中是否存在目标类Arith
    cat objection.log | grep com.example.junior.util.Arith
    ```

    ```
    // 列出Arith类中的方法
    android hooking list class_methods com.example.junior.util.Arith 
    ```

    在内存中确定Arith类存在后，使用如下命令对这个函数进行Hook：

    ```
    android hooking watch class_method com.example.junior.util.Arith.sub --dump-args --dump-backtrace --dump-return
    ```

    最终确认该简单计算器是通过sub(java.lang.String, java.lang.String)实现的。

    利用Frida脚本修改参数，主动调用

    ```frida
    function main(){
        Java.perform(function(){
            var Arith = Java.use("com.example.xxx.Arith)
            Arith.sub.overload('java.lang.String','java.lang.String').implementation = function(str,str2){
                var result = this.sub(str,str2)
                console.log('result=>',result)
                // 打印函数调用堆栈
                console.log(Java.use("android.util.log")
                            .getStackTraceString(Java.use("java.lang.Trowable))
                            .$new()))
                return result
            }
        })
    }
    ```

    在使用Frida注入app前需要取消objection的Hook.

    注入示例代码如下：

    ```frida
    function main(){
        Java.perform(function(){
            var Arith = Java.use("com.example.xxx.Arith)
            Arith.sub.overload('java.lang.String','java.lang.String').implementation = function(str,str2){
                var result = this.sub(str,"123")
                console.log('result=>',result)
                // 打印函数调用堆栈
                console.log(Java.use("android.util.log")
                            .getStackTraceString(Java.use("java.lang.Trowable))
                            .$new()))
                return result
            }
        })
    }
    ```

    直接传参实际上不对，应该如下：

    ```
    var JavaString = Java.use('java.lang.String');
    var result = this.sub(str,JavaString.$new('123))
    ```

    



