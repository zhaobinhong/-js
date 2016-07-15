/**
 * Created by bankeys-01 on 2016/7/15.
 */
function runOnce(fn, context) {
    //控制让函数只执行一次
    return function () {
        try {
            fn.apply(context || this, arguments);
        } catch (e) {
            console.error(e);
        } finally {
            fn = null;
        }
    }
}

var a = 0;
var canOnlyFireOnce = runOnce(function () {
    a++;
    console.log(a);
});

canOnlyFireOnce(); //1
canOnlyFireOnce(); // nothing