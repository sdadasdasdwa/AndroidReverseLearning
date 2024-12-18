# Network Capture

    I haven't write documents like this for a long time because I was busy on doing my job. 

    And now I have leisure so I plan to record the feelings when I read Chapter 8 about network capture.

## Introduce 

    There are mainly two ways to caputre network capture. One is Hooking, the other is Man-in-the-Middle(MITM) packet capturing.

1. Hooking

    It will be introduced later.

2. MITM

   This is a common way of capturing packet. And it also can be divided into two scenaries in 7-layer OSI network model.

   +  application layer : HTTP/HTTPs
   +  Session layer : Socket packet

## MIMT

    Then it introduce how to use Charels and Burp suite to execute MIMT packet capturing. I was used to choose Fiddle-Everywhere tools.

    But the way of using BS to capture sock5 packet which I really want to have a try.