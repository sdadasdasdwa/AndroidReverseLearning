function hook_okhttp3(){
    Java.perform(function(){
        //加载目标dex
        Java.openClassFile("/data/local/tmp/okhttp3logging.dex").load()

        var MyInterceptor = Java.use("com.hook.okhttp.frida.LoggingInterceptor")
        var MyInterceptorObj = MyInterceptor.$new()

        var Builder = Java.use("okhttp3.OkHttpClient$Builder")
        console.log(Builder)

        Builder.build.implementation = function(){
            this.networkInterceptors().add(MyInterceptorObj)
            return this.build
        }
        console.log("hook_okhttp3...")
    })
}

function main(){
    hook_okhttp3()
}

setImmediate(main)