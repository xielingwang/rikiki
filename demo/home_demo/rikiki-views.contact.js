$.rikiki(function(){
    Rikiki.View("contacts-list", $("[rel=contacts-list]", "#ui-view-content"))
        .bind(".ui-button-more", 'click', function(){
            $(this).parents('.contact').children('.details').toggle("normal");
        })
        .bind(".ui-repeater-header form input", 'keyup', function(){
            var filter = $(this).val();
            $(this).parents(".ui-repeater").find("> li.contact").show();
            $(this).parents(".ui-repeater").find("> li.contact").filter(function(index){
                 var contact = Contact.instance().get($(this).attr('model-id'));
                 var matchesCriteria = (contact.name.toLowerCase().indexOf(filter) >= 0
                    || contact.phone.toLowerCase().indexOf(filter) >= 0
                    || contact.email.toLowerCase().indexOf(filter) >= 0);
                 return !matchesCriteria;
            }).hide();
        });
        
    Rikiki.View("contact-edit", $("[rel=contact-edit]", "#ui-view-content"))
        .bind(".ui-button-cancel", 'click', function(){
            var ret = window.confirm("Are you sure you want to cancel?");
            console.log(ret);
            return ret;
        });
});
