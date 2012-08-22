(function() {
    // config
    $.rikiki.config = function(nameOrObject, val) {
        return $.rikiki.core.config.apply(this, arguments);
    }
    // request
    $.rikiki.request = function(uri) {
        return $.rikiki.core.request.apply(this, arguments);
    }
    $.rikiki.request.factory = function(uri) {
        return $.rikiki.core.request.factory.apply(this, arguments);
    }
    // Route
    $.rikiki.route = function(uri, regex) {
        return $.rikiki.core.route.apply(this, arguments);
    }
    $.rikiki.route.set = function(name, uri, regex) {
        return $.rikiki.core.route.set.apply(this, arguments);
    }
    $.rikiki.route.get = function(name) {
        return $.rikiki.core.route.get.apply(this, arguments);
    }
    $.rikiki.route.all = function() {
        return $.rikiki.core.route.all.apply(this, arguments);
    }
    // Class
    $.rikiki.class = function(classname, members) {
        return $.rikiki.core.class.apply(this, arguments);
    }
    // controller
    $.rikiki.controller = function(name, members) {
        return $.rikiki.core.controller.apply(this, arguments);
    }
    
    // View
    $.rikiki.view = function(name, content, parent) {
        return $.rikiki.core.view.apply(this, arguments);
    }
    /*$.rikiki.view.factory = function(params) {
        return $.rikiki.core.view.factory.apply(this, arguments);
    }*/
    
    // Event
    $.rikiki.event = function(name, fun) {
        return $.rikiki.core.event.apply(this, arguments);
    }
    $.rikiki.event.run = function(name, params) {
        return $.rikiki.core.event.run.apply(this, arguments);
    }
})(jQuery);

// bootsrap
(function(){
$.rikiki(function(){
    $.rikiki.config({
        locationHashPrefix:"#!",
        locationHashTrackInterval:300
    });

    $.rikiki.route.set('default', '(<controller>(/<action>(/<id>)))',{id:'\\d+',controller:'\\w+',action:'\\w+'})
                .defaults({id:2, controller:'test', action:'index'});
    /*
    $.rikiki.Effects = {
        show:function(callback){$(this).show(500, callback);},
        hide:function(callback){$(this).hide(500, callback);}
    };*/
});
})(jQuery);