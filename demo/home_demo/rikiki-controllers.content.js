$.rikiki(function(){
    $.rikiki.view("documentation", $("[rel=documentation]", "#ui-view-content"));
    $.rikiki.view("resource", $("[rel=resource]", "#ui-view-content"));

    $.rikiki.controller("content", {})
        .conflictController("contact")
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
        
        .view("documentation")
        .action("documentation", function(){
                document.title = "Rikiki Documentation";
                this.view("documentation").show();
            })
            
        .view("resource")
        .action("resource", function(){
            document.title = "Rikiki Resource";
            this.view("resource").show();
        });
});
