function main() {
    Java.perform(function () {
        var URL = Java.use('java.net.URL')
        URL.$init.overload('java.lang.String').implementation = function (urlstr) {
            console.log('url => ' + urlstr)
            var result = this.$init(urlstr)
            return result
        }
    })
}
setImmediate(main)