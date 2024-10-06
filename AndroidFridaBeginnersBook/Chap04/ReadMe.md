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

    ```
    netstat -tulp | grep frida
    ```

    After seeing it, use Objection command.

    ```
    objection -N -h xxx.xxx.xxx.xxx -p 8888 -g com.example.packagename explore
    
    -N : Network Listen Model
    ```
2. Traverse services

