    function model_array(){
    }
    model_array.prototype = {_datas : [],
        add:function(obj) {
            obj[this._primary_key] = this._datas.length + 1;
            this._datas.push(obj);
        },
        update:function(obj) {
            var id = obj[this._primary_key];
            var index = -1;
            for(var i in this._datas) {
                if (this._datas[i][this._primary_key] == id)
                    index = i;
            }
            if (index === -1)
                return false;
            this._datas[index] = obj;
            return true;
        },
        get:function(id){
            var index = -1;
            for(var i in this._datas) {
                if (this._datas[i][this._primary_key] == id) {
                    index = i;
                    break;
                }
            }
            if (index === -1)
                return false;
            return this._datas[index];
        },
        delete:function(id){
            var id = obj[this._primary_key];
            var index = -1;
            for(var i in this._datas) {
                if (this._datas[i][this._primary_key] == id)
                    index = i;
            }
            if (index === -1)
                return false;

            delete this._datas[index];
            return true;
        },
        list:function() {
            return this._datas;
        }
    }

    function model(type){
        return eval("new model_"+type+"()");
    }
    model.instance = function(type) {
        return this.instance   = this.instance || (new this(type));
    }
    
    $.extend(model, {
        extend:function() {
            if (arguments.length === 1)
                $.extend(this.prototype, arguments[1]);
            this.prototype[arguments[1]] = arguments[2];
            return this;
        }
    });

    function Contact(){}
    Contact.prototype = new model("array");
    Contact.instance = function() {
        return this._isntance   = this._isntance || (new Contact());
    }

    $.extend(Contact.prototype, {
        _primary_key : 'id'
    });
    
    var test_datas = [
        {name:"Alice Smith",phone:"1325901650",email:"Alice@gmail.com"},
        {name:"Jack Dausen",phone:"1826544835",email:"Jack@gmail.com"},
        {name:"Peter Green",phone:"1335465456",email:"Peter@gmail.com"},
        {name:"Amin By",phone:"15965554602",email:"Amin@gmail.com"},
        {name:"Lionel Philip",phone:"15069872364",email:"Lionel@gmail.com"},
        {name:"Kimura Teng",phone:"13895178526",email:"Kimura@gmail.com"},
        {name:"Alice Hop",phone:"13895178526",email:"Kimura@gmail.com"},
        {name:"Philip Jason",phone:"13895178526",email:"Kimura@gmail.com"},
        {name:"jim Chan",phone:"13895178526",email:"Kimura@gmail.com"},
        {name:"Lucy Meter",phone:"13895178526",email:"Kimura@gmail.com"},
        {name:"Kuckoo Lin",phone:"13895178526",email:"Kimura@gmail.com"},
        {name:"Baron Dong",phone:"13895178526",email:"Kimura@gmail.com"}
    ];
    for(var k in test_datas) {
        Contact.instance().add(test_datas[k]);
    }
