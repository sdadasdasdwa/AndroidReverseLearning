function main(){
    Java.perform(function () {
        var gClass = Java.use('J1.g'); // 替换为实际的包名和类名
    
        gClass.onClick.implementation = function (view) {
            console.log('Button clicked!');
    
            return

            // 调用原始方法
            this.onClick(view);
    
            // 你可以在这里添加自定义逻辑
            // 例如，打印 f1466a 的值
            console.log('f1466a value: ' + this.f1466a);
        };
    });
    
}

setImmediate(main);