// bootsrap
(function($, undefined){
    $.rikiki(function(){
        $.rikiki..Config({
            locationHashPrefix:"#!",
            locationHashTrackInterval:300
        });

        $.rikiki.route_set('content', '(<action>)', {action:'home|documentation|resource'})
        .defaults({controller:'content', action:'index'});
        
        $.rikiki.route_set('default', '<controller>(/<action>(/<id>))',{controller:'\\w+',action:'\\w+', id:'\\d+'})
        .defaults({controller:'content', action:'index'});
    });
})(jQuery);
