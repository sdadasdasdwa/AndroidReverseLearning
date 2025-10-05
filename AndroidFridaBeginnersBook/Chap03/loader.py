# RPC and its automation
import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)

device = frida.get_usb_device();
process = device.attach('com.example.webdemo')

with open('4.js') as f:
    jscode = f.read()
script = process.create_script(jscode)

script.on('messsage',on_message)
script.load()

command = ""
while 1==1:
    command = input("\nEnter command:\n:Exit\n2:Call secret function\n3:Get Total Value\nchoice:")
    if command=="1":
        break
    elif command == "2":
        script.exports.callsecretfunc()
    elif command == "3":
        script.exports.gettotalvalue()

