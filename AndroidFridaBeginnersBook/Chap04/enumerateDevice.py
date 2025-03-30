# data :　２０２５－０３－３０
# author : Ricardo Pan
# 作者在尝试RPC远程调用时发现运行报错无法连接远程frida-server，在python代码中测试是否正常识别

import frida

# 获取设备管理器并打印所有连接的设备
device_manager = frida.get_device_manager()
devices = device_manager.enumerate_devices()

for device in devices:
    print(f"Device: {device.name}, Type: {device.type}")

# 选择 USB 设备并连接
device = frida.get_usb_device()
print(f"Connected to USB device: {device.name}")
