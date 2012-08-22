// bootsrap
(function($, undefined){
    $.rikiki(function(){
        $.rikiki.config({
            locationHashPrefix:"#!",
            locationHashTrackInterval:300
        });

        $.rikiki.route.set('content', '(<action>)', {action:'home|documentation|resource'})
        .defaults({controller:'content', action:'index'});
        
        $.rikiki.route.set('default', '<controller>(/<action>(/<id>))',{controller:'\\w+',action:'\\w+', id:'\\d+'})
        .defaults({controller:'content', action:'index'});
        /*
        $.rikiki.Effects = {
            show:function(callback){$(this).show(500, callback);},
            hide:function(callback){$(this).hide(500, callback);}
        };
        */
    });
})(jQuery);
