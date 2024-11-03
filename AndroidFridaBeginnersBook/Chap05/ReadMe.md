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

```shell
android heap search instances android.App.AlertDialog
android heap search instances android.App.Dialog
android heap search instances android.wdiget.PopupWindow
```

Recommand an Objection plugin - Wallbreaker, which enhances Objection's
memory search functionality  with practical examples.

```shell
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

```shell
objection -g com.hd.zhibo explore -s "android hooking watch class android.App.AlertDialog"
```

Then you will find that some functions is invoked, like

```shell
[xxx] Called android.App.AlertDialog.resolveDialogTheme
[xxx] Called android.App.AlertDialog.resolveDialogTheme
[xxx] Called android.App.AlertDialog.onCreate
```

After testing, choose onCreate function to hook and print stack trace.

```shell
android hooking watch class_method adnroid.App.AlertDialog.onCreate --dump-args --dump-backtrace --dump-return
```

That you can find update_show function:

![test picture](../Sceenshots/image2.png)

## practical cracking of unprotected app

1. use apktool to decompile the app

After decompiling, Locate the Smali file corresponding to the 'channel_main' class:

![image3.png](../Sceenshots/image3.png)

2. modify the Smali code

Based on the logic, we choose to modify 'if-eqz p1, :cond_0' by changing 'if-eqz' to 'if-nez'

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

## Practical analysis and cracking of an protected app

'app' : com.hello.qqc.apk

In this instance app, you find that you can't dismiss the popup by clicking outside the window.

### Search Related Class

Firstly, search for instances of relevant classes.

```shell
plugin wallbreaker objectsearch android.app.AlertDialog
plugin wallbreaker objectsearch android.app.Dialog
plugin wallbreaker objectsearch android.widget.PopupWindow
```

![image1.png](./image1.png)

### Hook

To identify the class responsible for implementing a popup by hooking each suspected popup class,
you could follow these steps:

1. Use 'watch class' way to hook related class before enter the HomePage.

```shell
android hooking watch class android.App.AlertDialog
```

![image2.png](./image2.png)

The above code is not userful, no any function is invoked during the process.

```shell
android hooking watch class android.App.Dialog
```

![image3.png](./image3.png)

Then, you will find many functions are called, such as 'setCancelable(boolean)' function.

2. Hook setCalcelable function

```shell
android hooking watch class_method android.app.Dialog.setCancelable --dump-args --dump-backtrace --dump-return
```

![image4.png](./image4.png)

You can see what call the andoird.App.Dialog is 'cn.net.tokyo.ccg.ui.fragment.dialog.UpdateDIalogFragment.onCreateDialog()' function.

3. Unpack the app

Something was different with the unprotected app.

If you use Jadx to uncompile the protected app, only some class information from the external shell is visible.

The only option is to unpack it, 'Dexdump' is another masterpiece by the author of Wallbreaker.

The basic principle of its unpacking is to perform a brute-force search for data in memory that match the 
DEX format to complete the dumping process.


```shell
git clone https://github.com/hluwa/FRIDA-DEXDump
```

we do not load plugin by adding the -P parameters and plugin path during injection,
instead we load plugin by using plugin command in Objection REPL interface after the Objection injection.

```shell
plugin load /plugins/dexdump
plugin dexdump dump
```

I tried using the plugin command in windows, but it doesn't work. So I only use it in python command.

```shell
pip3 install frida-dexdump
```

CLI arguments base on 'frida-tools', you can quickly dump the foreground application like this:

```shell
frida-dexdump -FU
```

Or specify and spawn app like this:

```shell
frida-dexdump -U -f com.app.pkgname
```

Additionally, you can see in -h that the new options provided by frida-dexdump are:

```shell
-o OUTPUT, --output OUTPUT  Output folder path, default is './<appname>/'.
-d, --deep-search           Enable deep search mode.
--sleep SLEEP               Waiting times for start, spawn mode default is 5s.
```

When using, I suggest using the -d, --deep-search option, which may take more time, but the results will be more complete.

![image5](./image5.png)


All the unpacked files were saved in the specified SavePath.

Use grep command to identity the dex file that stored the key class UpdateDialogFragment of the app.

```shell
grep -ril "UpdateDialogFragment" ./*.dex
-r : recursice
-i : ignore the case sensitivity.
-l : list only the names of files that contain matches for the specified pattern, rather than 
     displaying the matching lines themselves.
```

After determine the specific dex file, use Jadx open it and find 'UpdateDialogFragment' method.

That method extends the DialogFragment, codes about upgrade were not performed in UpdateDialogFragment class.

![image6](./image6.png)

To further confirm which external function is calling the class.

```shell
android hooking watch class cn.net.tokyo.ccg.ui.fragment.dialog.UpdateDialogFragment
```

![image7](./image7.png)

It's the cn.net.tokyo.ccg.ui.fragment.dialog.UpdateDialogFragment.b() that is calling that method.

![image8](./image8.png)

Use Jadx to locale the function.

> [!Note]
> I can't find UpdateDialogFragment in class.dex files which were dump by frida-dexdump in pyhon3.

[Jadx locale a() Picture]

When I see how MainActivity.a() function is calling the UpdateDialogFragment.b(). The version variable 
determines whether the pop-up window appears, so modify the condition in this if statement.

### re-pack 

Since the app is protected, there are additional details to pay attention to during the repackaging process.

1. When repackaging, the dex of original app after unpacking should be used to replace the original shell dex.

    So when using apktool to decompile the APK, choose not to decompile the dex files and delete the shell dex.

    ```shell
    apktool d com.hello.qqc.apk -s
    ```

    -s parameter in apktool provides the function to avoid decompiling dex files in the APKs.

    Delete the original classes.dex file after decompiling, then rename the dex files by file sizes in sequence as 
    classes.dex, classes2.dex, classes3.dex, classes4.dex and so on, and store them in the directory where the shell
    dex is located. After copying all unpacked dex files, the decompiling directory and files should appear as 
    shown in the image.

2. modify App's entry class

    In Jadx file, search 'extends Application' code, locate 'cn.net.tokyo.ccg.base.App' class.

    [Jadx picture]

    After modifying, use apktool to recompile app.

    ```shell
    apktool b com.hello.qqc
    ```

Then resign, reinstall and execute, you will get the same app without any difference.






