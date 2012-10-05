$.rikiki(function(){
    Rikiki.View("documentation", $("[rel=documentation]", "#ui-view-content"));

    Rikiki.Controller("content", {})
        .before(function(){
            this.modelContact = new Contact();
        })
        .View(Rikiki.View("home", $("[rel=home]", "#ui-view-content")))
        .action("index", function() {
            this.action("home");
        })
        .action("home", function() {
            document.title = "Rikiki Home Page";
            this.View("home").show();
        })
        .View("contacts-list")
        .action("contact", function() {
            document.title = "Rikiki Contacts";
            var contacts = this.modelContact.list();
            this.View("contacts-list")
                .data('contacts', contacts)
                .show();
        })
        .View("contact-edit")
        .action("editcontact", function(id){
            var contact = this.modelContact.get(id);
            console.log(contact);
            this.View("contact-edit").data({contact:contact}).show();
        })
        .action("test", function(){
            if (Rikiki.Request_post() && Rikiki.Request_post().length > 0){
                console.log(Rikiki.Request_post());
            }
        })
        .View("documentation")
        .action("documentation", function(){
                document.title = "Rikiki Documentation";
                this.View("documentation").show();
            });
});
