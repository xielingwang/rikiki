Abc = new function() {
    function GOGO(xx){
        alert("SHow your Mother" + xx);
    };
    GOGO.fuck = function(){
        alert("SHow your fucking");
    }
    this.constructor = GOGO;
    return GOGO;
};

Abc("fdsfs");
Abc.fuck();