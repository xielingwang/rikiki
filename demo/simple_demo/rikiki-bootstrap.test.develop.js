// bootsrap
Rikiki.ready(function(){
    Rikiki.Config({
        locationHashPrefix:"#!",
        locationHashTrackInterval:3000
    });

    Rikiki.Route_set('default', '(<controller>(/<action>(/<id>)))',{id:/\d+/,controller:/\w+/,action:/\w+/})
                .defaults({id:null, controller:'test', action:'index'});
});