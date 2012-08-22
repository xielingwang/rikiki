Function.prototype.alloc = function(args) {
    var str_args = [];
    for(var i in args) {
        str_args.push("args[:i]".replace(":i", i));
    }
    return eval("new this(:str_args)".replace(":str_args", str_args.join()));
}
Function.prototype.run = function(args) {
    var str_args = [];
    for(var i in args) {
        str_args.push("args[:i]".replace(":i", i));
    }
    return eval("this(:str_args)".replace(":str_args", str_args.join()));
}
function Base(){}
Base.extend = function(members, statics, parent_args, constructor) {
    var parent = this;

    function child(){}
    if (typeof(constructor) === 'function')
        child = constructor;
    child.prototype = parent.alloc(parent_args);

    // members
    members = members || {};
    for(var k in members) 
         child.prototype[k] = members[k];

    // static functions
    for (var k in parent) 
         child[k] = parent[k];
    statics = statics || {};
    for(var k in statics) {
         child[k] = statics[k];
    }

    // for parent function
    child.$ = function(key, args, obj) {
        var fun = function(){};
        if (typeof(obj) !== 'undefined') {
            var obj = parent.alloc(parent_args);
            if (typeof(obj[key]) != 'undefined')
                fun = obj[key];
            return fun.call(obj, args);
        }
        else {
            if (typeof(parent[key]) !== 'undefined')
                fun = parent[key];
            return fun.call(args);
        }
    }
    return child;
}
Function.prototype.comment = function() {  
    var lines = new String(this);  
    lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));  
    return lines;  
}

function Base(){}
Base.extend = function(members, statics, parent_args, constructor) {
    var parent = this;

    function child(){}
    if (typeof(constructor) === 'function')
        child = constructor;
    child.prototype = parent.alloc(parent_args);

    // members
    members = members || {};
    for(var k in members) 
         child.prototype[k] = members[k];

    // static functions
    for (var k in parent) 
         child[k] = parent[k];
    statics = statics || {};
    for(var k in statics) {
         child[k] = statics[k];
    }

    // for parent function
    child.$ = function(key, args, obj) {
        var fun = function(){};
        if (typeof(obj) !== 'undefined') {
            var obj = parent.alloc(parent_args);
            if (typeof(obj[key]) != 'undefined')
                fun = obj[key];
            return fun.call(obj, args);
        }
        else {
            if (typeof(parent[key]) !== 'undefined')
                fun = parent[key];
            return fun.call(args);
        }
    }
    return child;
}

var Annimal = Base.extend(
{fuck:function() {
    console.log('fuck 1');
    Annimal.$("fuck", arguments, this);
    }}
, {fuck:function(){
        console.log('Annimal Static fuck');
        }}
, ["good day", "good morning","fdf"]
);
var a = Annimal.alloc();
a.fuck();
Annimal.fuck();

console.log("");
var Cat = Annimal.extend({fuck:function(){
                    Cat.$("fuck", arguments, this);
                    console.log('fuck 2');
                    }});
var b = Cat.alloc();
b.fuck();
Cat.fuck();

console.log("");
var HuaCat = Cat.extend({fuck:function(){
    HuaCat.$("fuck", arguments, this);
    console.log("fuck hua 3");
    }}
, {
    bt:function(){
        console.log("static fuck hua3");
        HuaCat.$("fuck", arguments);
    }
});
var c = HuaCat.alloc();
c.fuck();
HuaCat.bt();
