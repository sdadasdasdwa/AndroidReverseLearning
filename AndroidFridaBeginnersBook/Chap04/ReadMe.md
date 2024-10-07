# Objection real combat

There is a malware when start it will make huge noises and disconnect adb.

## Decompliation tools

List some static code decompilation tools that you maybe use.

+ Jadx
+ Jeb
+ GDA

## Operation Begining

1. Cannot connect USB?
    Termux. A software which can perform terminal on Android device.

    To solve how to start frida-server without adb on PC device.

    Otherwise, Objection support to use Network Connection, it can listen to Android port.

    You can use 'netstat' command to view the port which frida-server use.

    ```shell
    netstat -tulp | grep frida
    ```

    After seeing it, use Objection command.

    ```frida
    objection -N -h xxx.xxx.xxx.xxx -p 8888 -g com.example.packagename explore
    
    -N : Network Listen Model
    ```

2. Traverse services

    ```frida
    android hooking list services
    ```

    The above code will iterate over services.

    But we cannot see which function cause the phenomena. So we should hook the whole service class.
3. Hook MyServiceOne Class

    ```frida
    android hooking watch class com.example.MyServiceOne
    ```

    Then you can find that MyServiceOne.access$L1000018 Method is called.

    Use Jeb to find the corresponding function.

    ```java
    public void run(){
        ...
        Object v1 = MyServiceOne.this.getSystemService("audio");
        // set the max volume
        v1.setStreamVolume(3,v1,getStreamMaxVolunme(3),4);
        v1.getStreamMaxVolume(0);
        v1.getStreamMaxVolume(0);
        MyServiceOne.this.getApplication()
                    .getSystemService("vibrator")
                    .vibrate(new long[]{((long)100),((long)1500),((long)100),((long)1500),-1})
        ...
    }
    ```

    Then you know what make the voice noise. And then we touch the unlock logic.

4. UnLock Button？

    when you click unlock button, you will find some functions are called.
    Following the principle that the function printed first is called first, we will hook a method instead of the whole class methods.

    ```frida
    android hooking watch class_method com.example.MyServiceOne.xxxmethod --dump-args --dump-backtrace --dump-return
    dump-args : print arguments
    dump-backtrace : print heap trace
    dump-return : print function return value
    ```

    TIPS: the backtrace content perform that functions printed first is called last.

    Finally, we can summarized that use Objection can help us localize the important code.

## frida development philosophy

1. Objection Assisted localization

    ```frida
    // list activities
    android hooking list activities

    // install and traverse all activity later start corresponding activity
    android intent launch activity com.example.CaculatorActivity

    // verify if the function exists
    android hooking list class_methods com.example.CalculatorActivity

    // hook the method
    android hooking watch class method com.example.CalculatorActivity.caculate --dump-args --dump-backtrace --dump-return
    ```

    We can see the origin code and find that the calculate function use the sub function of Arith class.

    To verify whether the sub function is called, we try to test.

    First, iterate the class.

    ```frida
    android hooking list classes
    ```

    Tips: Before running the objection to inject App, checkout to `~/.objection` directory

    clear the old `objection.log`. After that, re-inject App and run the traverse code.

    Finally you will find Arith Class in the memory.

    Second, hook the sub function.

    ```frida
    android hooking watch class_method com.example.xxx.sub --dump-args --dump-backtrace --dump--return
    ```

    you will find the sub function overloads.

    Third, use firda scripts to modify parameters and actively invoke.

    ```frida
    function main(){
        Java.perform(function(){
            var Arith = Java.use("com.example.xxx.Arith)
            Arith.sub.overload('java.lang.String','java.lang.String').implementation = function(str,str2){
                var result = this.sub(str,str2)
                console.log('result=>',result)
                console.log(Java.use("android.util.log")
                            .getStackTraceString(Java.use("java.lang.Trowable))
                            .$new()))
                return result
            }
        })
    }
    ```
