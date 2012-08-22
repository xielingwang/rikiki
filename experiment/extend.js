function defineClass(classname, props, superClass) {
    eval("function "+classname+"(){\n}");
    eval("var classprototype = "+classname+".prototype;");

    function __classname__(classOrObject) {
        if (typeof(classOrObj) == "object" && classOrObject.constructor)
            var fun = classOrObject.constructor;
        else
            var fun = classOrObject;
        if (typeof(fun) == "function"){
            var str = fun.toString();
            var re = /^\s*function\s+(\w+)\s*\(.*/g;
            str = str.replace("\n", "")
                .replace("\r", "");
            if (re.test(str)) 
                return str.replace(re, "$1");
        }
    }
    __classname__(superClass);

    classprototype.super = {};
    if (typeof(superClass) == 'function') {
        var superObj = new superClass();
        for(var name in superObj)
            classprototype[name] = superObj[name];
    }
    for(var name in props) {
        if (typeof(classprototype[name]) && typeof(props[name] == 'function')) {
            classprototype.super[name] = classprototype[name];
        } 
        classprototype[name] = props[name];
    }
    return eval(classname);
}

var Annimal = defineClass("Annimal", {fuck:function(){console.log("annimal fuck")}});
var Cat = defineClass("Cat", {
    fuck:function(){
             console.log("cat fuck");
             // this.super.fuck.apply(this, arguments);
         }
}, Annimal);
var LongCat = defineClass("LongCat", {
    fuck:function(){
             console.log("long cat fuck");
             this.super.fuck.apply(this, arguments);
         }
}, Cat);
var cat = new LongCat();
cat.fuck();

// it must output 
// cat fuck
// annimal fuck

/*
function __typeof__(objClass) {
    if ( objClass && objClass.constructor )
    {
        var strFun = objClass.constructor.toString();
        var className = strFun.substr(0, strFun.indexOf('('));
        className = className.replace('function', '');
        return className.replace(/(^s*)|(s*$)/ig, '');　
    }
    return typeof(objClass);
}

alert(__typeof__(cat));
*/
