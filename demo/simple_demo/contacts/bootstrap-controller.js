// bootsrap
Rikiki.ready(function(){
    Rikiki.Config({
        locationHashPrefix:"#!",
        locationHashTrackInterval:100
    });
    Rikiki.Config('model.base_url', 'http://localhost/mt/demo/simple_demo/contacts/');

    Rikiki.Route_set('default', '(<action>(/<id>))',{id:/\w+/,controller:/\w+/,action:/\w+/})
                .defaults({id:null, controller:'tester', action:'index'});

    var contactModel = {
        list:function(condition, callbacks) {
            Rikiki.httprequest_query('/contacts.php', condition, callbacks);
        },
        one:function(id, callbacks){
            var condition = {id:id};
            Rikiki.httprequest_query('/contacts.php', condition, callbacks);
        },
        create:function(data, callbacks) {
            Rikiki.httprequest_create('/contacts.php', null, data, callbacks);
        },
        update:function(id, data, callbacks){
            condition = {id:id};
            Rikiki.httprequest_update('/contacts.php', condition, data, callbacks);
        },
        delete:function(id, callbacks){
            condition = {id:id};
            Rikiki.httprequest_delete('/contacts.php', condition, callbacks);
        }
    }

    Rikiki.View("contact-index", $("#contact-views [rel=contact-index]"))
            .addSubviewBefore("search", $("#contact-views [rel=contact-search]"));
    Rikiki.View("contact-edit", $("#contact-views [rel=contact-edit]"));
    Rikiki.View("contact-index").getSubview("search").bind("#text-keywords", 'keyup', function() {
        contactModel.list({keywords:$(this).val()}, {200:function(data){
            Rikiki.Controller_instance("tester").showViews("contact-index", data);
        }});
    });
    Rikiki.Controller("tester", {
    	_views:['contact-index','contact-edit'],
    	action_index :function(){
            var _self = this;
            contactModel.list(null, {200:function(data){
                console.log('ok');
                _self.showViews("contact-index", data);
            }});
        },
    	action_edit:function(id) {
            var _self = this;
            if (Rikiki.Request_method() === 'POST') {
                Rikiki.Request_post().id = id;
                contactModel.update(id, Rikiki.Request_post(), {200:function(){console.log('update ok');}});
            }
            else {
                contactModel.one(id, {200:function(data){
                    console.log('ok');
                    _self.showViews("contact-edit", {contact:data,title:'Edit Contact'});
                }});
            }
        },
    	action_delete:function(id) {
            callbacks = {200:function(){
                Rikiki.Request_redirect('/');
            },201:function(){
                Rikiki.Request_redirect('/');
            }};
            contactModel.delete(id, callbacks);
        },
        action_add:function(){
            var _self = this;
            if (Rikiki.Request_method() === 'POST') {
                    contactModel.create(Rikiki.Request_post(), {
                        200:function() {
                            _self.showViews("contact-edit", {contact:empty, title:'Add Contact'});
                        }
                    });
            }
            else {
                var empty = {first_name:'',last_name:'',email:'', telephone:''};
                _self.showViews("contact-edit", {contact:empty, title:'Add Contact'});
            }
        }
    });
    console.log(Rikiki.Controller("tester"));
});