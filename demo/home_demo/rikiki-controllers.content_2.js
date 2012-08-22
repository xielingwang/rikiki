$.rikiki(function(){
    $.rikiki.view("documentation", $("[rel=documentation]", "#ui-view-content"));

    $.rikiki.controller("content", {})
        .before(function(){
            this.modelContact = new Contact();
        })
        .view($.rikiki.view("home", $("[rel=home]", "#ui-view-content")))
        .action("index", function() {
            this.action("home");
        })
        .action("home", function() {
            document.title = "Rikiki Home Page";
            this.view("home").show();
        })
        .view("contacts-list")
        .action("contact", function() {
            document.title = "Rikiki Contacts";
            var contacts = this.modelContact.list();
            this.view("contacts-list")
                .data('contacts', contacts)
                .show();
        })
        .view("contact-edit")
        .action("editcontact", function(id){
            var contact = this.modelContact.get(id);
            console.log(contact);
            this.view("contact-edit").data({contact:contact}).show();
        })
        .action("test", function(){
            if ($.rikiki.post && $.rikiki.post.length > 0){
                console.log($.rikiki.post);
            }
        })
        .view("documentation")
        .action("documentation", function(){
                document.title = "Rikiki Documentation";
                this.view("documentation").show();
            });
});
