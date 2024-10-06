// JAVA layer active
function main(){
    console.log("Script loaded successfully ")
    Java.perform(function(){
        console.log("Inside java perform function")
        var MainAcitivity = Java.use('com.roysue.demo02.MainActivity')
    
        // static function active
        MainAcitivity.staticSecret();

        // Error: secret: cannot call instance method without an instance
        MainAcitivity.secret();


        // dynamic function active
        Java.choose('com.roysue.demo02.MainActivity',{
            onMatch: function(instance){
                console.log('instance found',instance)
                instance.secret()
            },
            onComplete: function(){
                console.log('search Complete')
            }
        })
    })
}
setImmediate(main)