# App security offence and defense process

This section introduces the upgrade pop-up prompt of an unprotected app.

## Practical analysis and cracking of an unprotected app

In Android, there are three main comman ways to implement pop-ups:

1. android.App.Dialog
2. android.App.AlertDialog
3. android.widget.PopupWindow

To find the upgrade dialog, decompile source code and search for relevent characters, like this:

![test picture](../Sceenshots/image.png)