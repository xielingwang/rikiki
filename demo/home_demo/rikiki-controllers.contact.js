$.rikiki(function(){
    $.rikiki.controller("contact", {})
        .conflictController("content")
        .before(function() {
            this.modelContact = Contact.instance();//new Contact();
        })
        .action("index", function(){
            this.action("list");
        })
        .view("contacts-list")
        .action("list", function() {
            document.title = "Rikiki Contacts";
            var contacts = this.modelContact.list();
            this.view("contacts-list")
                .data('contacts', contacts)
                .show();
        })
        .view("contact-edit")
        .action("edit", function(id){
            if ($.rikiki.method === 'POST') {
                if (id === undefined)
                    this.modelContact.add($.rikiki.post);
                else {
                    $.rikiki.post.id = id;
                    this.modelContact.update($.rikiki.post);
                }
                $.rikiki.request.redirect("/contact");
            }
            else {
                var contact = this.modelContact.get(id);
                this.view("contact-edit").data({contact:contact}).show();
            }
        })
        .action("delete", function(id){
            var contact = this.modelContact.get(id);
            if (contact && window.confirm("Are your sure you want to delete contact :name?".replace(':name', contact.name))) {
                this.modelContact.delete(id);
            }
            $.rikiki.request.redirect("/contact");
        })
        .action("add", function(){
            this.view("contact-edit").data({contact:{id:'',name:'',phone:'',email:''}}).show();
        });
});
