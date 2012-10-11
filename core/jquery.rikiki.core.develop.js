/*!
 * @Project: Redbud (The Swift Js MVC Framework with jQuery)
 * @Description: A javascript MVC-framework using jQuery, for making a easy way to create a web application(online/offline)
 * @Author: Aminby
 * @Url: http://aminby.net
 * @StartDate: 2012-1-25
 * @changelog:
 * 2012-1-25 get location hash use window.location.hash
 * 2012-1-26 create a timer(setInterval) to monitor hash, if location.hash changed then release a event
 *             imply Route management, can set/get/match a Route and get controller and action
 * 2012-1-27 imply Class controller and Class request, we can new request(uri) then execute the specified action
 * 2012-1-28 imply View module, and write a example to control _views' states(hide/show) and datas in a controller. 
 We can control three data types of view(string, object, Array[object/string])
 * 2012-2-3 Refactoring
 * 2012-2-23 to 2-27 Research template.js from project named trimpath jsct (http://code.google.com/p/jsct/), So I rewrite the codes of view module
 Use JSMinned template.js code instead of template.js file
 Log usage of template.js in this file
 * 2012-3-1 to 4-8 desparate code to core and project
 bugfix and write a demo
 rewrite controller to be a chain-calling
 *
 */

/*! Todos:
 * function: transition for change view
 * function: let hash support post put get delete
 * function: imply controller for restful
 * function: imply controller for template [2012-2-27 finished throught introduce template.js file]
 * bug: Router can't support uri without controller(I should have a default controller)
 */

(function($, undefined){
    /**
     * javascript extend
     */
    /**
     * Function extend
     */ 
    Function.prototype.alloc = Function.prototype.alloc || function(args) {
        if (typeof(args) !== 'object' && typeof(args) !== 'array')
            args = [args];
        var str_args = [];
        if (typeof(args) === 'array') {
            for(var i=0; i < args.length;i++) {
                str_args.push("args[:i]".replace(":i", i));
            }
        }
        else {
            // console.log(args);
            for(var i in args) {
                str_args.push("args[:i]".replace(":i", i));
            }
        }
        // console.log("new this(:str_args)".replace(":str_args", str_args.join()));
        return eval("new this(:str_args)".replace(":str_args", str_args.join()));
    }
    /**
     * String extend
     */
    String.prototype.super_trim = String.prototype.super_trim
        || function(chr /*default:\s*/) {
            var text = '' + this;
            if ($.isArray(chr))
                chr = chr.join("");
            if (chr == undefined)
                chr = '\\s';
            chr = chr.replace("/","\\/");
            leftTrim = "^["+chr+"]+";
            rightTrim = "["+chr+"]+$";
            return text.replace(new RegExp(leftTrim, "g"), "").replace(new RegExp(rightTrim,"g"), "");
        }
    // strtr("afdfs:typeferer", {":type":"777"})=>afds777ferer
    String.prototype.strtr = String.prototype.strtr
        || function(from, to){
            var str = ''+this;
            if (typeof(str) != 'string')
                return str;
            if ($.isPlainObject(from)) {
                var obj = from;
                for(var key in obj) {
                    var val = obj[key];
                    str = str.replace(key, val);
                }
                return str;
            }
            return str.replace(from, to);
        }
    /* 
     * examples: 
     * uses '<controller>/<action>'.preg_group({controller:'\\w+',action:'\\w+'}, 'abc/def'); 
     * or   '<controller>/<action>'.preg_group({controller:/\w+/,action:/\w+/}, 'abc/def'); 
     */ 
    String.prototype.preg_group = String.prototype.preg_group ||
        function(groups, s){
            var names = [], result = {}, cursor = 0;
            var re = ''+this;
            re = re.replace(/<(\w+)>/g, function(m, gname) {
                names.push(gname);
                if (groups[gname] == undefined)
                    return '(.+)';
                else {
                    var greg = groups[gname].toString().replace(/^\//, '').replace(/\/$/, '');
                    return '(:regex)'.strtr({':regex' : greg});
                }
            });
            
            re = new RegExp(re);
            if (!re.test(s))
                return false;

            var tmp = re.exec(s);
            if (tmp) {
                for(var i in tmp)
                    if (tmp[i] != undefined && names[i-1])
                        result[names[i-1]] = tmp[i];
            }
            return result;
        }
    
    $.extend({
        hash:function(hash) {
            if (typeof(hash) == 'undefined') {
                var hash = (!window.location.hash) ? '': window.location.hash.replace(Rikiki.Config('locationHashPrefix'), "").replace(/^#/g, '');
                return hash;
            }
            else {
                hash = '/' + hash.super_trim(["/","\\s"]).replace(/^#/g, '');
                window.location.hash = Rikiki.Config('locationHashPrefix') + hash;
                return hash;
            }
        },
        pageTitle : function (title) {
            if (Rikiki.Config('sitename'))
                title = title + ' - ' + Rikiki.Config('sitename');
            document.title = title;
        }
    });
    
    /*!
     * extend for jquery
     *
     */

    $.fn.extend({
        // jquery element 对象是否在dom树中
        in_dom:function(){
            var ret = false;
            if (this.parents("html").length > 0
                || $(this).children("html").length > 0)
                ret = true;
            return ret;
        },
        
        // for form
        serializeObject : function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }
    });

    /*!
     * Core
     *
     */
    // for boostrap
    RikikiData = {
        routes:{},
        classes:{},
        classes_cached:{},
        views:{},
        events:{},
        runtime_data:{},
        effects:{},
        config:{},
        bootstraps:[]
    };
    RikikiCore = {};
    Rikiki = {};

    /*
     * preset config
     * the system will have faulty wihtout this configures
     */
    RikikiData.config = {
        // for system
        locationHashPrefix : "#!",
        locationHashTrackInterval : 500,

        // debug
        debug : true,

        // for model
        model : {
            base_url : 'http://localhost/mt/demo/simple_demo/',
            process_style : 'http-status', // http-status(xhq.status, xhq.response) data-status(response.status, response.data)
            process_status_key : 'error',
            process_data_key : 'data',
            ajax_dataType : 'json',

            // post type (http-method, query-action)
            // http-method - get/query, put/update, post/create, delete/delete 
            // query-action - when update delete set query key action = update/ delete
            post_type:'http-method', 
            post_key:'action'
        }
    };

    /*
     * ready funtion
     * likes jQuery.ready(), it will run as soon as system.start()
     *
     */
    Rikiki.ready = RikikiCore.ready = function(fun){
        RikikiData.bootstraps = RikikiData.bootstraps || [];
        if ($.isFunction(fun)) {
            RikikiData.bootstraps.push(fun);
        }
        if ( fun == undefined ) {
            for(var i in RikikiData.bootstraps) {
                RikikiData.bootstraps[i]();
            }
            RikikiData.bootstraps = [];
        }
    }

    RikikiCore.start = function(){
        Rikiki.ready();
        Rikiki.Runtime("hashTimerId", setInterval('Rikiki.Event_run("locationHashTrackTimer")', Rikiki.Config('locationHashTrackInterval')));
    }

    RikikiCore.stop = function(){
        clearInterval(Rikiki.Runtime("hashTimerId"));
    }

    // about route
    // <controller>/<action>, 
    RikikiCore.route = function (uri, regex){
        // prototype
        this.defaults = function (defaults) {
            this._vars.defaults = $.extend({}, this._vars.defaults, defaults);
            return this;
        }
        this.matches = function (_uri) {
            _uri = _uri.super_trim("/");
            var ret = this._vars.uri_regex.preg_group(this._vars.regex_map, _uri);
            if (ret === false)
                return false;

            ret = $.extend({}, this._vars.defaults, ret);
            return ret;
        }

        // init
        regex = regex || {id:/\d+/, controller:/\w+/,action:/\w+/};
        this._vars = {
            defaults:{controller:'welcome', action : 'index'},
            uri_regex:'',
            regex_map:regex
        };
        
        uri = uri.super_trim("/");
        
        this._vars.uri_regex = (function(uri){
            return "^" + uri.replace(/\(/g, '(?:').replace(/\)/g, ')?') + "$";
        })(uri);
        
        return this;
    }

    RikikiCore.route_set = function(name, uri, regex){
        return RikikiData.routes[name] = new Rikiki.Route(uri, regex);
    }
    RikikiCore.route_all = function(){
        return RikikiData.routes;
    }
    RikikiCore.route_get = function(name){
        return RikikiData.routes[name];
    }


    /*
     * Class
     */
    RikikiCore.Class = function(classname, members, statics){
        // AddClass
        function addClass(classname, members, statics){
            // if class existed
            if (RikikiData.classes[classname] != undefined)
                console.error("Class :class existed".replace(":class", classname));
            
            // initial class members
            var Class = {
                init:function(){
                    console.log("you can overwrite function init to constructor");
                    return this;
                },
                name:classname
            };
            
            // static function
            statics = statics || {};
            statics.member = function(name, object){
                if (typeof(name) !== 'string')
                    return;
                
                if (typeof(object) !== 'undefined')
                    this.prototype[name] = object;
                
                // retore cached
                RikikiCore.Class_instance(classname, true);
                
                return this[name];
            };
            
            function Base() {}
            Base.extend = function(classname, parent_args, members, statics) {
                var parent = this;
                function child(){
                    if (typeof(this.init) == 'function') {
                        return this.init.call(this, arguments);
                    }
                }
                
                var classname = 'child';
                // 改掉原来使用注释来解决多行字符串的方式，原因是使用minifier的时候，注释都会被过滤了
                var code = "function :child(){};\
    :child.prototype = parent.alloc(parent_args);\
    /* members*/\
    members = members || {};\
    for(var k in members) \
        :child.prototype[k] = members[k];\
    /* static functions*/\
    for (var k in parent) \
        :child[k] = parent[k];\
    statics = statics || {};\
    for(var k in statics) {\
        :child[k] = statics[k];\
    }\
    /* for parent function*/\n\
    :child.$ = function(key, args, obj) {\
    var fun = function(){};\
    if (typeof(obj) !== 'undefined') {\
        var obj = parent.alloc(parent_args);\
        if (typeof(obj[key]) != 'undefined')\
            fun = obj[key];\
        return fun.call(obj, args);\
    }\
    else {\
       if (typeof(parent[key]) !== 'undefined')\
            fun = parent[key];\
       return fun.call(args);\
    }\
};".replace(/:child/g, classname);
                eval(code);
                return eval(classname);;
            }
            
            // resultant class members
            members = $.extend({}, Class, members);
            RikikiData.classes[classname] = Base.extend(classname, undefined, members, statics);
            return RikikiData.classes[classname];
        }
        
        // get class
        function getClass(classname){
            // class not existed
            if (RikikiData.classes[classname] == undefined) {
                var msg = "Class :Class not existed".replace(":Class", classname);
                throw new Rikiki.Exception_Reflection(msg);
            }
            
            // return 
            return RikikiData.classes[classname];
        }
        
        // folking execute
        if (members != undefined)
            return addClass(classname, members, statics);
        else
            return getClass(classname);
    }

    RikikiCore.Class_instance = function(classname, clearCached){
        // class not existed
        if (RikikiData.classes[classname] == undefined) {
            var msg = "Class :Class not existed".replace(":Class", classname);
            throw new Rikiki.Exception_Reflection(msg);
        }
        
        // cache
        clearCached = clearCached || false;
        if (clearCached) {
            RikikiData.classes_cached[classname] = undefined;
            return;
        }
        
        if (typeof(RikikiData.classes_cached[classname]) === 'undefined') {
            RikikiData.classes_cached[classname] = new RikikiData.classes[classname]();
        }
        
        // return 
        return RikikiData.classes_cached[classname];
    }
    /* 
     * controller base Class
     * 处理调用函数
     *
     */
    RikikiCore.controller = function(ctrlName, members){
        if (typeof(ctrlName) === 'undefined') 
            console.error("controller name can not be null!");
        
        if (typeof(members) !== 'undefined') {
            var members = $.extend({}, {
                _views:[],
                conflictControllers:[],
                before:function(){
                    console.log('base before');
                    return this;
                },
                after:function(){
                    Rikiki.Request_method('GET');
                    Rikiki.Request_post(null);
                    console.log('base after');
                    return this;
                },
                showViews:function(viewsToShow, newDatas, opts){
                    viewsToShow = viewsToShow || [];
                    opts = opts || {};
                    opts.setOthersHidden = opts.setOthersHidden === false ? false : true;
                    opts.isGlobalData = opts.isGlobalData === true ? true : false;
                    if (typeof(viewsToShow) === 'string')
                        viewsToShow = [viewsToShow];
                    
                    if (opts.setOthersHidden) {
                        // hide self other _views
                        for(var idx in this._views) {
                            if ($.inArray(this._views[idx], viewsToShow) < 0) {
                                Rikiki.View(this._views[idx]).hide();
                            }
                        }
                        
                        // hide conflict controllers' _views 
                        for(var i in this.conflictControllers) {
                            var v = this.controller(this.conflictControllers[i]);
                            
                            for(var idx in v._views) {
                                if ($.inArray(v._viewsToShow[idx], viewsToShow) < 0) {
                                    Rikiki.View(v._views[idx]).hide();
                                }
                            }
                        }
                    }

                    for (var i in viewsToShow) {
                        var view = Rikiki.View(viewsToShow[i]);
                        if (newDatas) {
                            if (opts.isGlobalData)
                                view.global_data(newDatas);
                            else 
                                view.data(newDatas);
                        }
                        view.show();
                    }
                    
                    return this;
                },
                action:function(name, argus){
                    if (typeof(this["action_" + name]) !== 'function') {
                        throw new Rikiki.Exception(this.name, "have no action " + name);
                    }
                    return this["action_" + name].call(this, argus);
                },
                view:function(name) {
                    if ($.inArray(name, this._views) < 0)
                        throw "Controller :controller have no View named :view"
                        .replace(/:controller/g, ctrlName)
                        .replace(/:view/g, name);

                    this.hideViews(name);

                    return Rikiki.View(name);
                },
                controller:function(name) {
                    if ($.inArray(name, this.conflictControllers) < 0)
                        throw "Controller :controller have no View named :view"
                        .replace(/:controller/g, ctrlName)
                        .replace(/:view/g, name);

                    return Rikiki.Controller_instance(name);
                }
            }, members);
            var statics = {
                ctrlName:ctrlName,
                action:function(name, fun) {
                    if (typeof(name) !== 'string' || typeof(fun) != 'function')
                        return false;
                    this.member("action_" + name, fun);
                    
                    Rikiki.Controller_instance(this.ctrlName, true);
                    
                    return this;
                },
                view:function(view) {
                    if (typeof(view.name) === 'function'){
                        view = view.name();
                    }
                    
                    if (!$.isArray(view) && typeof(view) !== 'string') {
                        return;
                    }
                    
                    if (typeof(view) === 'string') {
                        view = [view];
                    }
                    
                    for(var i in view) {
                        this.prototype._views.push(view[i]);
                    }
                    Rikiki.Controller_instance(this.ctrlName, true);
                    return this;
                },
                conflictController:function(controller) {
                    if (typeof(controller.name) === 'function'){
                        view = controller.name();
                    }
                    
                    if (!$.isArray(controller) && typeof(controller) !== 'string') {
                        return;
                    }
                    
                    if (typeof(controller) === 'string') {
                        controller = [controller];
                    }
                    
                    for(var i in controller) {
                        this.prototype.conflictControllers.push(controller[i]);
                    }
                    Rikiki.Controller_instance(this.ctrlName, true);
                    return this;
                },
                
                before:function(fun) {
                    var prefun = this.prototype.before;
                    if (typeof(fun) === 'function')
                        this.member("before", function() {
                            prefun.call(this, arguments);
                            fun.call(this, arguments);
                        });
                    Rikiki.Controller_instance(this.ctrlName, true);
                    return this;
                },
                after:function(fun) {
                    var prefun = this.prototype.after;
                    if (typeof(fun) === 'function')
                        this.member("after", function(){
                            prefun.call(this, arguments);
                            fun.call(this, arguments);
                        });
                    Rikiki.Controller_instance(this.ctrlName, true);
                    return this;
                }
            };
            return Rikiki.Class("controller_"+ctrlName, members, statics);
        }
        return Rikiki.Class("controller_"+ctrlName);
    }

    RikikiCore.controller_instance = function(name, clearCached) {
        return Rikiki.Class_instance("controller_"+name, clearCached);
    }


    /*
     * _views
     *
     */

    // View Class
    function View(name, content, parent) {
        self = this;

        if (!content)
            console.error("View content can't be null");

        // specify a parent for view, then it
        // choose specified parent preferentially
        // then if content is a dom element, use its parent
        // otherwise use $(document)
        if  (content.tmpl) {
            content.template(name);
        }
        else if (typeof(content) == 'string'){
            $.template(name, content)
        }
        
        this._name = name;
        this._parent  = (function(_content, _parent) {
            if (_parent)
                return _parent;
            
            if (_content.tmpl)
                return _content.parent();
            
            return 'body';
        })(content, parent);
        this._subviews_before = [];
        this._subviews_after = [];

        this._reload_data  = true;
        this._reload_event = true;
    }

    View.prototype = {
        // the jquery element node that  the view redering
        _renderingNode : undefined,
        
        // name
        name:function() {
            return this._name;
        },
        
        // add sub view
        addSubviewBefore : function(name, content, parent) {
            return this.addSubview(name, content, parent, 'before');
        },
        addSubviewAfter : function(name, content, parent) {
            return this.addSubview(name, content, parent, 'after');
        },
        addSubview : function(name, content, parent, position) {
            var subview_name = this.name() + "-" + name;
            Rikiki.View(subview_name, content, parent);

            position = position || 'before';
            if (position == 'before')
                this._subviews_before.push(subview_name);
            else
                this._subviews_after.push(subview_name);

            return this;
        },
        getSubview : function(name) {
            var subview_name = this.name() + "-" + name;
            if ($.inArray(subview_name, this._subviews_before) >= 0 || $.inArray(subview_name, this._subviews_after) >= 0)
                return Rikiki.View(subview_name);
            return null;
        },
        
        // set data
        data : function(nameOrObject, data) {
            console.log(this.name(), 'data');
            if (this.name() == 'contact-index-search') throw "f";
            this._data = this._data || {};
            if (typeof(nameOrObject) == 'string') { 
                var name = nameOrObject;
                if (!data)
                    return this._data[name];

                this._data[name] = data;
            }
            else if (typeof(nameOrObject) == 'array') {
                var ret = {};
                for(var i in nameOrObject) {
                    ret[i] = nameOrObject[i];
                }
            }
            else if ($.isPlainObject(nameOrObject)){
                this._data = nameOrObject; //$.extend(true, this._data, nameOrObject);
            }
            this._reload_data = true;

            console.log(this._data);
            
            // when set data, update the view
            this.update();
            
            return this;
        },
        
        // set global data
        global_data : function(nameOrObject, data) {
            this.data(nameOrObject, data);
            $.each(this._subviews_before, function(k,v) {
                Rikiki.View(v).global_data(nameOrObject, data);
            });
            $.each(this._subviews_after, function(k,v) {
                Rikiki.View(v).global_data(nameOrObject, data);
            });
            return this;
        },
        
        // update 
        update : function() {
            var is_visible = this.is_visible();
            if (this.node()) 
                this.render();
            if (is_visible)
                this.show(false);
        },
        
        // node
        node : function(node) {
            if (node) {
                var oldNode = this._renderingNode;
                this._renderingNode = $("<div />").append(node).attr({rel:"ui-view-" + this._name});
                this._renderingNode.hide();
                if (oldNode) {
                    this._renderingNode.insertAfter(oldNode);
                    oldNode.remove();
                }
                if (this.node() && !this.node().in_dom()) {
                    this._renderingNode
                        .appendTo(this._parent)
                }
            }
            else
                return this._renderingNode;
        },

        // hide
        hide : function(annimate) {
            annimate = annimate === false ? false : true;
            if (this.node()) {
                if (!annimate)
                    this.node().hide();
                else {
                    var effect = Rikiki.Effect_Hide();
                    if (typeof(effect) == 'function') {
                        effect.apply(this.node());
                        console.log("use effect custom function");
                    }
                    else {
                        var jq = $();
                        jq[effect.fx].apply(this.node(), [effect.speed]);
                    }
                }
                $.each(this._subviews_before, function(k,v) {
                    Rikiki.View(v).hide(annimate);
                });
                $.each(this._subviews_after, function(k,v) {
                    Rikiki.View(v).hide(annimate);
                });
            }
            return this;
        },
        
        // toggle
        toggle : function(annimate) {
            if (this.is_visible()) 
                this.hide(annimate);
            else
                this.show(annimate);
        },
        
        // is_visible, is_hidden
        is_visible : function() {
            return this.node() && this.node().in_dom() && this.node().is(":visible");
        },
        is_hidden : function() {
            return !this.is_visible();
        },
        
        // show -- render and show
        show : function(annimate) {
            annimate = annimate === false ? false : true;

            // subview before
            $.each(this._subviews_before, function(k,v) {
                Rikiki.View(v).show(annimate);
            });

            // main view
            if (this.render().node()) {
                if (!annimate) {
                    this.node().show();
                }
                else {
                    var effect = Rikiki.Effect_Show();
                    if (typeof(effect) == 'function') {
                        effect.apply(this.node());
                        console.log("use effect custom function");
                    }
                    else {
                        var jq = $();
                        jq[effect.fx].apply(this.node(), [effect.speed]);
                    }
                }
            }

            // subview after
            $.each(this._subviews_after, function(k,v) {
                Rikiki.View(v).show(annimate);
            });
            return this;
        },
        
        // render -- load and tmpl data (if data changed reload it)
        render : function() {
            if (!(this._reload_data || this._reload_event)) // 01 10 11 / 00
                return this;
        
            // load data, using trimPath
            if (this._reload_data) {
                this.node($.tmpl(this._name, this._data));
            }
            
            // bind event
            if (this.node() && (this._reload_data || this._reload_event)) {
                for(var i in this._event) {
                    var struct = this._event[i];
                    console.log(struct);
                    this.node().find(struct.selector).bind(struct.event, struct.callback);
                }
            }
            
            // clear reload_data and reload_event flag
            this._reload_data = false;
            this._reload_event = false;
            
            // append to parent
            /*
            if (this.node() && !this.node().in_dom()) {
                this.node()
                    .prependTo(this._parent)
                    .hide();
            }*/
            
            return this;
        },
        
        // bind - selector event function
        bind : function(selector, event,  callback) {
            this._event = this._event || [];
            if (typeof(selector) === 'string' && typeof(event) === 'string' && typeof(callback) === 'function') {
                this._event.push({
                    selector:selector,
                    event:event,
                    callback:callback
                });
                this._reload_event = true;
            }
            return this;
        }
    }

    // add View
    function addView(name, content, parent) {
        if (typeof(RikikiData.views[name]) != 'undefined') {
            console.error('view named "' + name + '" has been defined before!');
        }
        RikikiData.views[name] = new View(name, content, parent);
        
        // previous binding
        RikikiData.views[name].bind("form[type=rikiki-form]", "submit", function(){
            try {
                Rikiki.Request_form(this);
                console.log('serializeObject', $(this).serializeObject());
                Rikiki.Request_redirect($(this).attr("action"), $(this).serializeObject());
            }
            catch(e) {
                console.log(e);
                return false;
            }
            return false;
        });
        
        return RikikiData.views[name];
    }

    // get view
    function getView(name) {
        if (typeof(RikikiData.views[name]) == 'undefined') {
            console.error('view named "' + name + '" has never been defined before use!');
            return null;
        }
        return RikikiData.views[name];
    }

    // forking execute
    // @eg. Rikiki.View(name, content, parent)
    // @eg. Rikiki.View({name:xx,content:xx,parent:xx)
    RikikiCore.view = function(nameOrObject, content, parent) {
        // to add view
        if ($.isPlainObject(nameOrObject) || content) {
            var params = typeof(content) !== 'undefined'
                ? {
                    name:nameOrObject,
                    content:content,
                    parent:parent
                }
            : nameOrObject;
            return addView(params.name, params.content, params.parent);
        }
        // to get View
        else if (typeof(nameOrObject) === 'string')
            return getView(nameOrObject);
    }


    /*
     * Events
     */

    // Event binding: name - function
    RikikiCore.event = function(name, fun) {
        if ($.inArray(typeof(name), ["string","number"]) < 0)
            return;
        
        if (!fun) 
            return RikikiData.events[name];
            
        if (fun && $.isFunction(fun)) {
            RikikiData.events[name] = fun;
        }
    };

    // Event callback
    RikikiCore.event_run = function(name, params) {
        if (typeof(RikikiData.events[name]) == 'function')
            RikikiData.events[name](params);
    }

    // three initial event

    Rikiki.ready(function(){
        // 1.location hast track - for check weather hash changed, if changed if view run a locationHashChanged
        Rikiki.Event("locationHashTrackTimer", function (){
            var currentUri = $.hash();
            var referrer = Rikiki.Runtime('referrer');
            var reflesh = Rikiki.Runtime('reflesh', false);
            if (referrer != currentUri || reflesh) {
                Rikiki.Event_run("locationHashChanged", currentUri);
                Rikiki.Runtime("referrer", currentUri);
            }
        })
        // 2.request Exception occurence
        Rikiki.Event("requestException", function(req) {
            console.log(req);
            try {
                Rikiki.Request_factory("error/" + req.status).execute();
            }
            catch(e) {
                console.error('you may have to handle the request for error code ' + req.status);
            }
        });
        // 3.locationHashChanged
        Rikiki.Event("locationHashChanged", function(uri) {
            if (! Rikiki.Config("debug")) {
                var request;
                try {
                    request = Rikiki.Request_factory(uri);
                    request.execute();
                }
                catch(e) {
                    // Rikiki.Exception_Network Rikiki.Exception_Request Rikiki.Exception_Reflection Rikiki.Exception_InternalError
                    if (e instanceof Rikiki.Exception_Reflection || e instanceof Rikiki.Exception_InternalError || e instanceof Rikiki.Exception_Request)
                        Rikiki.Event_run("requestException", request);
                    else
                        console.error('unexpected error', e);
                }
            }
            else {
                Rikiki.Request_factory(uri).execute();
            }
        });
        // 4.Stop System
        Rikiki.Event("stopApplication", function() {
            Rikiki.stop();
        });
    });

    // about hash
    // require request

    // Environmment Variable
    Rikiki.Runtime = function(name, val){
        if (typeof(name) === 'undefined')
            return;
        
        var ret = RikikiData.runtime_data[name];
        if (typeof(val) !== 'undefined')
            RikikiData.runtime_data[name] = val;
        return ret;
    };
    Rikiki.Runtime_delete = function(name) {
        if (!name)
            return;
        
        if (typeof(RikikiData.runtime_data[name]) != 'undefined')
            delete RikikiData.runtime_data[name];
    }

    // Exception
    RikikiCore.Exception = function(type, message, context){
        this.message = message;
        this.type = type;
        this.context = context;
        this.toString = function(){
            return "Error :type: :message".replace(/:type/g, this.type).replace(/:message/g, this.message);
        }
        return this;
    }

    // .Config
    RikikiCore.config = function(nameOrObject, val) {
        if ($.isPlainObject(nameOrObject)) {
            var obj = nameOrObject;
            RikikiData.config = $.extend({}, RikikiData.config, obj);
            return RikikiData.config;
        }

        var name = nameOrObject;

        if (typeof(name) == 'undefined')
            return RikikiData.config;

        var nls = name.split(".");
        if (nls.length <= 1) {
            if (typeof(val) == 'undefined') 
                return RikikiData.config[name];

            return RikikiData.config[nameOrObject] = val;
        }
        else {
            // get
            if (typeof(val) == 'undefined') {
                var iterator = RikikiData.config;
                for(var k = 0; k < nls.length; k++) {
                    var v = nls[k];
                    if (typeof(iterator[v]) == 'undefined')
                        return;
                    else {
                        if (k + 1 == nls.length)
                            return iterator[v];
                        iterator = iterator[v];
                    }
                }
            }
            // set
            else {
                var iterator = RikikiData.config;
                for(var k = 0; k < nls.length; k++) {
                    var v = nls[k];
                    if (k + 1 < nls.length) {
                        typeof(iterator[v]) == 'undefined' ? iterator[v] = {} : null;
                        iterator = iterator[v];
                    }
                    else {
                        return iterator[v] = val;
                    }
                }
            }
        }
    };

    // about request
    // 处理uri 动态调用controller的相应处理
    // 若处理不存在，导向404
    RikikiCore.request = function (uri){
        /*
          var _messages = {
          200 : 'OK',
          404 : 'Not Found',
          500 : 'Bad request'
          };
        */
        var _self = this;
        function inner_execute(){
            var _controller = Rikiki.Controller_instance(_self.controller);
            if (typeof(_controller["action_"+_self.action]) !== 'function') {
                _self.status = 404;
                throw new Rikiki.Exception_Reflection(_self.controller + " have no method action_" + _self.action);
            }

            // environment
            _controller.request = _self;
            
            // execute
            if (Rikiki.Config('debug')) {
                _controller.before();
                _controller["action_"+_self.action].apply(_controller, _self.args);
                _controller.after();
            }
            else {
                try {
                    _controller.before();
                    _controller["action_"+_self.action].apply(_controller, _self.args);
                    _controller.after();
                }
                catch(e) {
                    _self.status = 500;
                    console.error(e);
                    throw new Rikiki.Exception_Reflection(_self.controller + ".action_" + _self.action + " happenned error when executing!", e);
                }
            }
            
            Rikiki.UI_Current(uri);
        }
        this.execute = function(){
            if (Rikiki.Request_method() !== 'POST')
                Rikiki.Request_method('GET');
            
            inner_execute();
            return this;
        }
        
        function init(){
            this.status = 200;
            var routes = Rikiki.Route_all();
            var params = false;
            for(var i in routes) {
                if ((params = routes[i].matches(uri)) === false)
                    continue;
                
                this.controller = params.controller;
                this.action = params.action;
                delete params.controller;
                delete params.action;
                
                var args = [];
                $.each(params, function(k,v) {
                    args.push(v);
                });
                this.args = args;
                break;
            }
            if (!params) {
                this.status = 404;
                var msg = 'Unable to find a route to match the URI: :uri'.replace(":uri", uri);
                throw new Rikiki.Exception_Request(msg);
            }
            return this;
        }
        return init.call(this);
    }

    RikikiCore.request_factory = function(uri){
        if (uri != undefined)
            return new Rikiki.Request(uri);
        return null;
    }

    RikikiCore.request_redirect = function(uri, post) {
        Rikiki.Runtime("reflesh", true);
        uri = uri.replace(Rikiki.Config('locationHashPrefix'), '');
        if (typeof(post) !== 'undefined') {
            Rikiki.Request_method('POST');
            Rikiki.Request_post(post);
        }
        $.hash(uri);
    }

    RikikiCore.Effect = function(name, params) {
        var defs = {fx:name, speed:'normal'};
        if (typeof(params) !== 'undefined') {
            if ($.isPlainObject(params)) {
                params = $.extend({}, params, defs);
                if (typeof($().fx) === 'undefined')
                    params.fx = defs.fx;
            }
            else if (typeof(params) != 'function') {
                params = defs;
            }
            Rikiki.Config('effect_'+name, params);
        }
        else {
            var ret = Rikiki.Config('effect_'+name);
            if (!ret)
                ret = defs;
            return ret;
        }
    }
    // ui nav item for current uri
    // todo: fix
    RikikiCore.UI_Current = function(uri) {
        $(".ui-nav-item-current").removeClass("ui-nav-item-current");
        $('.ui-nav-item').filter(function(){
            return $("a", this).attr('href') === Rikiki.Config('locationHashPrefix') + uri;
        }).addClass("ui-nav-item-current");
    }

    // model
    RikikiCore.httprequest = function(options, response_processors) {
        /*
         * accepts async beforeSend(XMLHttpRequest) cache complete(XMLHttpRequest, textStatus) contents 
         * contentType[urlencoded] context converters crossDomain[false,true] data dataFilter(data, type)
         * dataType[xml,html,script,json,jsonp,text] error(XMLHttpRequest, textStatus, errorThrown)
         * global[true,false] headers[key/value] ifModified isLocal jsonp jsonCallback mimeType password
         * processData scriptCharset statusCode[{}] success(data, textStatus, XMLHttpRequest) timeout 
         * traditional type url username xhr xhrFields
         */
        
        // url
        options.url = (Rikiki.Config('model.base_url') + options.url).replace(/\/\//g, '/').replace(':/', '://');
        var lioqm = options.url.lastIndexOf('?');
        var lioa = options.url.lastIndexOf("&");
        var maxIndex = options.url.length - 1;
        if (options.query_data) {
            var urlparam = $.param(options.query_data);
            if (urlparam) {
                options.url += ((lioqm < 0) 
                                ? "?" 
                                : (lioqm < maxIndex && lioa < maxIndex) ? "&" : "") + urlparam;
            }
        }

        // data Type
        options.dataType = Rikiki.Config('model.ajax_dataType');
        if ($.isPlainObject(options.data)) {
            if ($.inArray(options.type, ['post','put']) >= 0 && options.dataType == 'json') {
                options.data = JSON.stringify(options.data);
            }
        }

        // return json processor
        var return_json_processor = function(status, data, type) {
            if (status && typeof(response_processors[status]) === 'function') {
                response_processors[status](data, type);
            }
            else {
                console.warn('undefined processor for status ' + status);
            }
        }

        // process style: uses http status code or data status
        switch (Rikiki.Config('model.process_style')) {
            case 'http-status':
            options.complete = function(xhq, message) {
                switch (this.dataType) {
                case 'json':
                    return_json_processor(xhq.status, $.parseJSON(xhq.responseText)); // parseXML
                    break;
                default:
                    throw 'Rikiki didn\'t support dataType ' + this.dataType + ' yet';
                    break;
                }
            }
            break;
            case 'data-status':
            options.success = function(response, message) {
                switch (this.dataType) {
                case 'json':
                    var status_key = Rikiki.Config('model.process_status_key');
                    var data_key = Rikiki.Config('model.process_data_key');
                    if (typeof(response[status_key]) === 'undefined') {
                        throw "response data haven't a key named '" + status_key + "'";
                    }
                    if (typeof(response[data_key]) === 'undefined') {
                        throw "response data haven't a key named '" + data_key + "'";
                    }
                    return_json_processor(response[data_key], response[data_key]);
                    break;
                default:
                    throw 'Rikiki didn\'t support dataType ' + this.dataType + ' yet';
                    break;
                }
            }
            options.error = function(xhq, statusText,errorThrown) {
                console.error(xhq.responseText);
            }
            break;
            default:
            throw "unrecognized process type '" + Rikiki.Config('model.process_style') + "' for Rikiki.httprequest options";
            break;
        }
        /*
        options.error = function() {console.log('error', arguments);}
        options.beforeSend  = function(xhq, opts) {console.log('beforeSend', this, arguments);}
        options.complete  = function(xhq, message) {console.log('complete', this, arguments);}
        options.dataFilter  = function(data, type) {console.log('dataFilter', this, arguments); return data;}
        options.success  = function(data, message, xhq) {console.log('success', this, arguments);}
        /**/
        console.log("");
        console.log(options);/**/
        if (Rikiki.Runtime("ajaxing")) {
            Rikiki.Runtime("ajaxing").abort();
            Rikiki.Runtime_delete("ajaxing");
        }
        Rikiki.Runtime("ajaxing", $.ajax(options));
    }
    RikikiCore.httprequest_query = function(uri, query_data, response_processors) {
        query_data = query_data || {};
        var default_response_processors = {
            200 : function(data){
                console.log('query', 200, data);
            }, 
            404 : function(data){
                console.log('query', 404, data)
            }
        };
        response_processors = $.extend({}, default_response_processors, response_processors);
        var options = {
            type:'get', 
            url:uri, 
            data:query_data
        };
        Rikiki.httprequest(options, response_processors);
    }
    RikikiCore.httprequest_delete = function(uri, query_data, response_processors) {
        query_data = query_data || {};
        var default_response_processors = {
            201 : function(data){
                console.log('not found', 201, data);
            },
            200: function(data){
                console.log('delete', 200, data);
            }
        };
        response_processors = $.extend({}, default_response_processors, response_processors);

        var method = 'delete';
        query_data = query_data || {};        
        if (Rikiki.Config('model.post_type') == 'query-action') {
            method = 'post';
            query_data[Rikiki.Config('model.post_key')] = 'delete';
        }
        var options = {
            type:method, 
            url:uri
        };
        options.query_data = query_data;
        Rikiki.httprequest(options, response_processors);
    }
    RikikiCore.httprequest_create = function(uri, query_data, data, response_processors) {
        query_data = query_data || {};
        data = data || {};
        var default_response_processors = {
            201 : function(data){
                console.log('existed', 201, data);
            },
            400 : function(data){
                console.log('parameter error', 400, data);
            },
            200: function(data){
                console.log('ok', 200, data);
            }
        };
        response_processors = $.extend({}, default_response_processors, response_processors);

        var options = {
            type:'post', 
            url:uri, 
            data:data,
            query_data:query_data
        };
        Rikiki.httprequest(options, response_processors);
    }
    RikikiCore.httprequest_update = function(uri, query_data, data, response_processors) {
        query_data = query_data || {};
        data = data || {};
        var default_response_processors = {
            404 : function(data){
                console.log('not found', 404, data);
            },
            400 : function(data){
                console.log('parameter error', 400, data);
            },
            200: function(data){
                console.log('ok', 200, data);
            }
        };
        response_processors = $.extend({}, default_response_processors, response_processors);

        var method = 'put';
        query_data = query_data || {};        
        if (Rikiki.Config('model.post_type') == 'query-action') {
            method = 'post';
            query_data[Rikiki.Config('model.post_key')] = 'update';
        }
        var options = {
            type:method, 
            url:uri, 
            data:data,
            query_data:query_data
        };
        if (options.type == 'put') {
            options.data = JSON.stringify(options.data);
            options.contentType = 'application/json';
        }
        Rikiki.httprequest(options, response_processors);
    }

    // preset
    Rikiki.ready(function(){
        Rikiki.View("404", "uri not found");
        Rikiki.Controller(
            'error', {
            action_404:function(){
                    $('body').children().hide();
                    Rikiki.View("404").show();
                }
            }
        );
    });

    // exception
    // Rikiki.Exception_Network Rikiki.Exception_Request Rikiki.Exception_Reflection Rikiki.Exception_InternalError
    Rikiki.Exception_InternalError = function(message, context) {
        return Rikiki.Exception.call(this, 'internal_error', message, context);
    }
    Rikiki.Exception_Reflection = function(message, context) {
        return RikikiCore.Exception.call(this, 'reflection', message, context);
    }
    Rikiki.Exception_Request = function(message, context) {
        return RikikiCore.Exception.call(this, 'request', message, context);
    }
    Rikiki.Exception_Network = function(message, context) {
        return RikikiCore.Exception.call(this, 'network', message, context);
    }

    // bootstrap
    Rikiki.start = function(){
        return RikikiCore.start.apply(this, arguments);
    }
    // .Config
    Rikiki.Config = function(nameOrObject, val) {
        return RikikiCore.config.apply(this, arguments);
    }
    // Route
    Rikiki.Route = function(uri, regex) {
        return RikikiCore.route.apply(this, arguments);
    }
    Rikiki.Route_set = function(name, uri, regex) {
        return RikikiCore.route_set.apply(this, arguments);
    }
    Rikiki.Route_get = function(name) {
        return RikikiCore.route_get.apply(this, arguments);
    }
    Rikiki.Route_all = function() {
        return RikikiCore.route_all.apply(this, arguments);
    }
    // Class
    Rikiki.Class = function(classname, members) {
        return RikikiCore.Class.apply(this, arguments);
    }
    Rikiki.Class_instance = function(classname){
        return RikikiCore.Class_instance.apply(this, arguments);
    }
    // controller
    Rikiki.Controller = function(name, members) {
        return RikikiCore.controller.apply(this, arguments);
    }
    Rikiki.Controller_instance = function(name){
        return RikikiCore.controller_instance.apply(this, arguments);
    }

    // View
    Rikiki.View = function(name, content, parent) {
        return RikikiCore.view.apply(this, arguments);
    }

    // Event
    Rikiki.Event = function(name, fun) {
        return RikikiCore.event.apply(this, arguments);
    }
    Rikiki.Event_run = function(name, params) {
        return RikikiCore.event_run.apply(this, arguments);
    }

    // request
    Rikiki.Request = function(uri) {
        return RikikiCore.request.apply(this, arguments);
    }
    Rikiki.Request_factory = function(uri) {
        return RikikiCore.request_factory.apply(this, arguments);
    }
    Rikiki.Request_redirect = function(uri, post) {
        return  RikikiCore.request_redirect.apply(this, arguments);
    }
    Rikiki.Request_form = function(form) {
        return Rikiki.Runtime('request_form', form);
    }
    Rikiki.Request_post = function(data) {
        return Rikiki.Runtime('request_post', data);
    }
    Rikiki.Request_query = function(data) {
        return Rikiki.Runtime('request_query', data);
    }
    Rikiki.Request_method = function(data) {
        return Rikiki.Runtime('request_method', data);
    }
    Rikiki.UI_Current= function(uri) {
        return RikikiCore.UI_Current.apply(this, arguments);
    }

    // model
    Rikiki.httprequest = function(options, response_processors) {
        return RikikiCore.httprequest.apply(this, arguments);
    }
    Rikiki.httprequest_update = function(url, query_data, data, response_processors) {
        return RikikiCore.httprequest_update.apply(this, arguments);
    }
    Rikiki.httprequest_create = function(url, query_data, data, response_processors) {
        return RikikiCore.httprequest_create.apply(this, arguments);
    }
    Rikiki.httprequest_delete = function(url, query_data, response_processors) {
        return RikikiCore.httprequest_delete.apply(this, arguments);
    }
    Rikiki.httprequest_query = function(url, query_data, response_processors) {
        return RikikiCore.httprequest_query.apply(this, arguments);
    } 
    
    Rikiki.Effect_Show = function(params) {
        return RikikiCore.Effect('show', params);
    }
    Rikiki.Effect_Hide = function(params) {
        return RikikiCore.Effect('hide', params);
    }
})(jQuery);
