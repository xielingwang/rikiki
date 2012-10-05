$.rikiki(function(){
    Rikiki.View("documentation", $("[rel=documentation]", "#ui-view-content"));
    Rikiki.View("resource", $("[rel=resource]", "#ui-view-content"));

    Rikiki.Controller("content", {})
        .conflictController("contact")
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
        
        .View("documentation")
        .action("documentation", function(){
                document.title = "Rikiki Documentation";
                this.View("documentation").show();
            })
            
        .View("resource")
        .action("resource", function(){
            document.title = "Rikiki Resource";
            this.View("resource").show();
        });
});
