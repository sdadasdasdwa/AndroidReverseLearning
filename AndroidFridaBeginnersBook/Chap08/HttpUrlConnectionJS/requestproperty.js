function main(){
    Java.perform(function(){
        var HttpURLConnectionImpl = Java.use('com.android.okhttp.internal.huc.HttpURLConnectionImpl')
        HttpURLConnectionImpl.setRequestProperty.implementation = function(key, value){
            var result = this.setRequestProperty(key,value)
            console.log('setRequestProperty key: => ',key,',value:', value)
            return result
        }
    })
}
setImmediate(main)