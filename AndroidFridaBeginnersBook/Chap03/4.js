function CallSecretFunc(){
    Java.perform(function(){

        // 动态函数主动调用
        Java.choose('com.example.demo.MainActivity',{
            onMatch: function(instance){
               
                instance.secret("Ricardo P")
                
                
            },
            onComplete: function(){
            }
        })
    })
}
function getTotalValue(){
    Java.perform(function(){
       // console.log("Inside java perform function")
        var MainAcitivity = Java.use('com.example.demo.MainActivity')
    
        // 动态函数主动调用
        Java.choose('com.example.demo.MainActivity',{
            onMatch: function(instance){
              //  console.log('instance found',instance)
               // instance.secret()
                console.log('total value = ',instance.total.value)
               // console.log('secret func exec success')
            },
            onComplete: function(){
                console.log('search Complete')
            }
        })
    })
}

rpc.exports = {
    callsecretfunc : CallSecretFunc,
    gettotalvalue : getTotalValue
}

setImmediate(getTotalValue)

