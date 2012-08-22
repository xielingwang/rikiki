function defineClass(props, superClass) {
    function _class(){
        var _self = this;
        for(var name in props)
            _self[name] = props[name];
        _self._obj = null;
        if (typeof(superClass) == 'function') {
            _self._obj = new superClass();
            for(var name in _self._obj) {
                if (_self[name] == undefined)
                    _self[name] = _self._obj[name];
            }
        }
        _self.super = function(method) {
            console.log(_self);
            console.log(this);
            if (_self._obj && typeof(_self._obj[method]) == "function")
                return _self._obj[method];
            else
                throw "super class have no such method: " + method;
        }
    };
    return _class;
}

var Person = defineClass({
    name:"Mimi",
    fuck:function(who){
             console.log("fuck " + who);
         }
});
var p = new Person();
p.fuck("you");

var Girl = defineClass({
    fuck:function(who){
             console.log(this.name + " girl fuck " + who);
             this.super("fuck").call(this, who);
         }
}, Person);
var g = new Girl();
g.fuck("John"); 

var Women = defineClass({
    fuck:function(age, who) {
             console.log(this.name + " women and " + who + " are fucking"); 
             this.super("fuck").call(this, who);
         }
}, Person);
var w = new Women();
console.log(w);
w.fuck(35, "Tsai");
