# scaled RPC called
import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)


device = frida.get_usb_device()

process = device.attach('com.example.junior')

with open('call.js') as f:
    jscode = f.read()
script = process.create_script(jscode)

script.on('message', on_message)
script.load()

for i in range(20,30):
  for j in range(0,10):
    script.exports.sub(str(i),str(j))

# device = frida.get_device_manager().add_remote_device('192.168.27.184:27043')
