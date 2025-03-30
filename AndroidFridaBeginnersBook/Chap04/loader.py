# scaled RPC called
import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)


# device = frida.get_usb_device()
device = frida.get_device_manager().add_remote_device('127.0.0.1:27042') 
# device = frida.get_device_manager().add_remote_device('192.168.95.184:27042') #经尝试还是无法做到，只能使用USB连接模式

process = device.attach('com.example.junior')

with open('call.js',encoding='utf-8') as f:
    jscode = f.read()
script = process.create_script(jscode)

script.on('message', on_message)
script.load()

for i in range(20,30):
  for j in range(0,10):
    script.exports.sub(str(i),str(j))

