function hook_okhttp3() {
    Java.perform(function () {
        //加载目标dex
        Java.openClassFile("/data/local/tmp/okhttplogging.dex").load()

        var MyInterceptor = Java.use("com.r0ysue.learnokhttp.LoggingInterceptor")
        var MyInterceptorObj = MyInterceptor.$new()

        var Builder;
        try {
            Builder = Java.use("okhttp3.OkHttpClient$Builder");
            console.log("Builder loaded : ", Builder);
        } catch (e) {
            console.log("Builder not found: " + e);
            return;
        }

        Builder.build.implementation = function () {
            console.log("Builder.build.implementation...")
            this.networkInterceptors().add(MyInterceptorObj)
            return this.build()
        }

        // Builder.$init.overloads.forEach(function (overload) {
        //     overload.implementation = function () {
        //         console.log("Builder Constructor Called");
        //         return overload.apply(this, arguments);
        //     };
        // });

        // Builder.build.overloads.forEach(function (overload) {
        //     overload.implementation = function () {
        //         console.log("Builder.build() hooked!");
        //         var Throwable = Java.use("java.lang.Throwable");
        //         var t = Throwable.$new();
        //         console.log(t.getStackTrace().toString());
        //         return overload.call(this);
        //     };
        // });

        console.log("hook_okhttp3...")
    })
}

function main() {
    hook_okhttp3()
}

setImmediate(main)