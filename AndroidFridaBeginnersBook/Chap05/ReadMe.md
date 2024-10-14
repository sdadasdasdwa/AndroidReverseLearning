# App security offence and defense process

This section introduces the upgrade pop-up prompt of an unprotected app.

## Practical analysis and cracking of an unprotected app

In Android, there are three main comman ways to implement pop-ups:

1. android.App.Dialog
2. android.App.AlertDialog
3. android.widget.PopupWindow

To find the upgrade dialog, decompile source code and search for relevent characters, like this:

![test picture](../Sceenshots/image1.png)

use frida to inject:

```frida
android heap searrch instances android.App.AlertDialog
android heap searrch instances android.App.Dialog
android heap searrch instances android.wdiget.PopupWindow
```

Recommand an Objection plugin - Wallbreaker, which enhances Objection's 
memory search functionality  with practical examples.

```frida
objection -g com.hd.zhibo explore -P /plugins/

plugin wallbreaker objectionsearch android.app.AlertDialog
# print: [0x2582] xxx

plugin wallbreaker objectdump 0x2582
# The text content displayed in the upgrade prompt pop-up.
```

But sorry, the com.hd.zhibo App has already outdate and is no longer maintained.So I can't screencap any picture.

Since the Hook has no effect if triggered after the function call, and the sample app's 
upgrade prompt pops up as soon as the app enters the main page, it's necessary to ensure
that the sample is hooked as soon as the startup function is invoked，so

```frida
objection -g com.hd.zhibo explore -s "android hooking watch class android.App.AlertDialog"
```

Then you will find that some functions is invoked, like

```frida
[xxx] Called android.App.AlertDialog.resolveDialogTheme
[xxx] Called android.App.AlertDialog.resolveDialogTheme
[xxx] Called android.App.AlertDialog.onCreate
```

After testing, choose onCreate function to hook and print stack trace.

```frida
android hooking watch class_method adnroid.App.AlertDialog.onCreate --dump-args --dump-backtrace --dump-return
```

That you can find update_show function:

![test picture](../Sceenshots/image2.png)

## decompile

1. use apktool to decompile the app

After decompiling, Locate the Smali file corresponding to the 'channel_main' class:

![image3.png](../Sceenshots/image3.png)

2. modify the Smali code

Based on the logic, we choose to modify 'if-eqz, :cond_0' by changing 'if-eqz' to 'if-nez'

Then use the following command to repackage the app.

```shell
apktool b zhibo
```

3. Sign the App

We need to use 'jarsigner' or other Android-approved signing tools to re-sign the App.

```shell
keytool -genkeypair -alias abc -keyalg RSA -keystore E:\Project\ASCD\AndroidFridaBeginnersBook\Chap05\zhibo\dist\abc.keystore
```

![image4.png](../Sceenshots/image4.png)



```shell
jarsigner -verbose -keystore E:\Project\ASCD\AndroidFridaBeginnersBook\Chap05\zhibo\dist\abc.keystore -signedjar zhibo_patch.apk zhibo.apk abc
```

![image5.png](../Sceenshots/image5.png)


4. Finally reinstall the app








