/**
 * date : 2025-03-29
 * author : Ricardo Pan
 */

function main() {
    Java.perform(function () {
        var Arith = Java.use("com.example.junior.util.Arith");
        Arith.sub.overload('java.lang.String', 'java.lang.String').implementation = function (a, b) {
            var result = this.sub(a, Java.use('java.lang.String').$new('124'))
            console.log('str1,str2,result =>: ', a, b, result)
            // 通过java中获取堆栈的方式进行打印
            console.log(Java.use('android.util.Log').getStackTraceString(Java.use('java.lang.Throwable').$new()))
            return result
        }
    })
}
setImmediate(main())