# Chapter02
This Chapter introduce the necessary basic of Android Reverse.

I simply introduce some android command I learned.

+ 1. adb shell dumpsys activity top
    - View the Activity that is currently in the foreground
+ 2. adb shell dumpsys package <package-name>
    - View the package information include four Component and MIME-related information.
+ 3. adb shell dbinfo <package-name>
    - View information about the databases used by the App
+ 4. adb shell screencap -p <path>
    - Used to perform a screenshot operation and save it to the <path> directory
+ 5. adb shell pm
    - pm which means PackageManager, used to manage packages.
+ 6. adb shell am
    - am means ActivityManager
