Rikiki.ready(function(){
    console.log("test controller");

    Rikiki.View("fuck1", $("[rel=fuck1]","#controller-test"));
    Rikiki.View("fuck2", $("[rel=fuck2]","#controller-test"));
    Rikiki.View("fuck3.3", $("[rel=fuck3]","#controller-test"));
    Rikiki.View("fuck3", "<span>fuck content 3</span>",$("#controller-test"));
    Rikiki.View("fuck4", "fuck content4",	$("#controller-test"));
    Rikiki.View({
		name:"fuck5",
		content:$("<div />").text("fuck content 5"), 
		parent:$("#controller-test")
    });
    
    console.log(Rikiki.View("fuck1"));

    Rikiki.View("index", $("[rel=index]","#controller-test"));
    Rikiki.Controller("test", {
        _views:["fuck1", "fuck2", "fuck3", "fuck4", "fuck5", "index"],
        action_index:function(params){
            console.log('action index');
            console.log(params);
        },
        action_fuck1:function(){
                         console.log('action fuck1');
                         Rikiki.View("fuck1").data('title', 'hello').data('year', Math.random()*10000+1);
                         Rikiki.View("fuck1").show();
                     },
        action_fuck2:function(){
                         console.log('action fuck2');
                         var datas = [{key:'fuck2', value:'fuck2value'},{key:Math.round(Math.random()*1000),value:778}];
                         Rikiki.View("fuck2").data('p', {key:'fuck2', value:'fuck2value'});
                         Rikiki.View("fuck2").show();
                     },
        action_fuck3:function(){
                         console.log('action fuck3');
                         Rikiki.View("fuck3").show();
                     },
        action_fuck4:function(){
                         console.log('action fuck4');
                         Rikiki.View("fuck4").show();
                     },
        action_fuck5:function(){
                         console.log('action fuck5');
                         Rikiki.View("fuck5").show();
                     }
                        });
console.log(Rikiki.Controller("test")); 
});



/*
function Animal(){
    this.species = "动物";
    this.speak = function(){
        console.log('I have no name');
    }
}
function Cat(name,color){
    this.name = name;
    this.color = color;
    this.speak = function() {
        console.log("I'm " +  name);
    }
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
Cat.speak.prototype = new Animal.speak();
var cat1 = new Cat("大毛","黄色");
alert(cat1.species); // 动物
*/
