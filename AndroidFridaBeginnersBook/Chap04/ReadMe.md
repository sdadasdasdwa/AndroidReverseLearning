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

    Finally, you can find the OnClick function operation make the REPL effect.

## frida development philosophy

1. Objection Assisted localization

    ```frida
    // install and traverse all activity later start corresponding activity
    android intent launch activity com.example.CaculatorActivity

    // verify if the function exists
    android hooking list class_methods com.example.CalculatorActivity

    // hook the method
    android hooking watch class method com.example.CalculatorActivity.caculate --dump-args --dump-backtrace --dump-return
    ```
