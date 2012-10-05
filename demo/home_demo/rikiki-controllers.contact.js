$.rikiki(function(){
    Rikiki.Controller("contact", {})
        .conflictController("content")
        .before(function() {
            this.modelContact = Contact.instance();//new Contact();
        })
        .action("index", function(){
            this.action("list");
        })
        .View("contacts-list")
        .action("list", function() {
            document.title = "Rikiki Contacts";
            var contacts = this.modelContact.list();
            this.View("contacts-list")
                .data('contacts', contacts)
                .show();
        })
        .View("contact-edit")
        .action("edit", function(id){
            if (Rikiki.Request_method() === 'POST') {
                if (id === undefined)
                    this.modelContact.add(Rikiki.Request_post());
                else {
                    Rikiki.Request_post().id = id;
                    this.modelContact.update(Rikiki.Request_post());
                }
                Rikiki.Request_redirect("/contact");
            }
            else {
                var contact = this.modelContact.get(id);
                this.View("contact-edit").data({contact:contact}).show();
            }
        })
        .action("delete", function(id){
            var contact = this.modelContact.get(id);
            if (contact && window.confirm("Are your sure you want to delete contact :name?".replace(':name', contact.name))) {
                this.modelContact.delete(id);
            }
            Rikiki.Request_redirect("/contact");
        })
        .action("add", function(){
            this.View("contact-edit").data({contact:{id:'',name:'',phone:'',email:''}}).show();
        });
});
