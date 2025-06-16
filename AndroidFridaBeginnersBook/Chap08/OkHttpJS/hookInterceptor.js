function hook_okhttp3() {
    Java.perform(function () {
        //加载目标dex
        Java.openClassFile("/data/local/tmp/okhttplogging.dex").load()

        var MyInterceptor = Java.use("com.r0ysue.learnokhttp.LoggingInterceptor")
        var MyInterceptorObj = MyInterceptor.$new()

        var Builder;
        try {
            Builder = Java.use("okhttp3.OkHttpClient$Builder");
            console.log("Builder loaded");
        } catch (e) {
            console.log("Builder not found: " + e);
            return;
        }
        // var Builder = Java.use("okhttp3.OkHttpClient$Builder")
        // console.log(Builder)

        Builder.build.implementation = function () {
            console.log("Builder.build.implementation...")
            this.networkInterceptors().add(MyInterceptorObj)
            return this.build()
        }
        console.log("hook_okhttp3...")
    })
}

function main() {
    hook_okhttp3()
}

setImmediate(main)