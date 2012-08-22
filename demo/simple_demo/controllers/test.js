$.rikiki(function(){
    $.rikiki.view("fuck1", $("[rel=fuck1]","#controller-test"));
    $.rikiki.view("fuck2", $("[rel=fuck2]","#controller-test"));
    $.rikiki.view("fuck3.3", $("[rel=fuck3]","#controller-test"));
    $.rikiki.view("fuck3", "<span>fuck content 3</span>",$("#controller-test"));
    $.rikiki.view("fuck4", "fuck content4",	$("#controller-test"));
    $.rikiki.view({
		name:"fuck5",
		content:$("<div />").text("fuck content 5"), 
		parent:$("#controller-test")
    });

    $.rikiki.view("index", $("[rel=index]","#controller-test"));
    $.rikiki.controller("test", {
        views:["fuck1", "fuck2", "fuck3", "fuck4", "fuck5", "index"],
        action_index:function(params){
            console.log('action index');
            console.log(params);
        },
        action_fuck1:function(){
                         console.log('action fuck1');
                         $.rikiki.view("fuck1").data('title', 'hello').data('year', Math.random()*10000+1);
                         $.rikiki.view("fuck1").show();
                     },
        action_fuck2:function(){
                         console.log('action fuck2');
                         var datas = [{key:'fuck2', value:'fuck2value'},{key:Math.round(Math.random()*1000),value:778}];
                         $.rikiki.view("fuck2").data('datas', datas);
                         $.rikiki.view("fuck2").show();
                     },
        action_fuck3:function(){
                         console.log('action fuck3');
                         $.rikiki.view("fuck3").show();
                     },
        action_fuck4:function(){
                         console.log('action fuck4');
                         $.rikiki.view("fuck4").show();
                     },
        action_fuck5:function(){
                         console.log('action fuck5');
                         $.rikiki.view("fuck5").show();
                     }
                        });
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
