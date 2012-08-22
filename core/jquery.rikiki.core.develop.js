/*!
 * @Project: Redbud (The Swift Js MVC Framework with jQuery)
 * @Description: A javascript MVC-framework using jQuery, for making a easy way to create a web application(online/offline)
 * @Author: Aminby
 * @Url: http://aminby.net
 * @StartDate: 2012-1-25
 * @changelog:
 * 2012-1-25 get location hash use window.location.hash
 * 2012-1-26 create a timer(setInterval) to monitor hash, if location.hash changed then release a event
 *			 imply Route management, can set/get/match a Route and get controller and action
 * 2012-1-27 imply Class controller and Class request, we can new request(uri) then execute the specified action
 * 2012-1-28 imply View module, and write a example to control views' states(hide/show) and datas in a controller. 
			 We can control three data types of view(string, object, Array[object/string])
 * 2012-2-3 Refactoring
 * 2012-2-23 to 2-27 Research template.js from project named trimpath jsct (http://code.google.com/p/jsct/), So I rewrite the codes of view module
                     Use JSMinned template.js code instead of template.js file
                     Log usage of template.js in this file
 * 2012-3-1 to 4-8 desparate code to core and project
                   bugfix and write a demo
                   rewrite controller to be a chain-calling
 *
 */

/*! Todos:
 * function: transition for change view
 * function: let hash support post put get delete
 * function: imply controller for restful
 * function: imply controller for template [2012-2-27 finished throught introduce template.js file]
 * bug: Router can't support uri without controller(I should have a default controller)
 */

/*
 *  JSMinned trimpath jsct template.js
 *
 */
/*
 * Syntax for trimpath template.js
 *# Expressions and Expression Modifiers 
 * ${expr}
 * ${expr|modifier1|..|modifierN}
 * ${expr|modifier:arg_1,grg_2,..,arg_N}
 * Examples:
 * ${customer.firstname|default:"unknowned"|capitalize}
 *
 *# Statement 
 ** Control Flow
 * {if testExpr}
 *   {elseif testExpr}
 *   {else}
 * {/if}
 ** Loops 
 * {for varName Name in listExpr}
 *    // __LIST_varname - a copy of list (so list can be from a function return)
 * {forelse} // when listExpr is null or length is 0
 * {/for}
 * 
 *# variables declarations
 * {var varName} 
 * {var varName = varInitExpr}
 *
 *# Macro // like js function
 * {macro macro(arg1, arg2, .., argN) }
 *    ... body of the macro
 * {/macro}
 *
 *# CDATA
 * {cdata}
 *   ... text emitted without JST processing
 * {/cdata}
 * {cdata EOF}
 *   ... text emitted without JST processing
 * EOF
 *
 *# In-line Javascript
 * {eval}{/eval}
 *
 *# Minify block
 * {minify}{/minify}   {minify EOF} ... EOF
 */

var TrimPath;(function(){if(TrimPath==null)
TrimPath=new Object();if(TrimPath.evalEx==null)
TrimPath.evalEx=function(src){return eval(src);};var UNDEFINED;if(Array.prototype.pop==null)
Array.prototype.pop=function(){if(this.length===0){return UNDEFINED;}
return this[--this.length];};if(Array.prototype.push==null)
Array.prototype.push=function(){for(var i=0;i<arguments.length;++i){this[this.length]=arguments[i];}
return this.length;};TrimPath.parseTemplate=function(tmplContent,optTmplName,optEtc){if(optEtc==null)
optEtc=TrimPath.parseTemplate_etc;var funcSrc=parse(tmplContent,optTmplName,optEtc);var func=TrimPath.evalEx(funcSrc,optTmplName,1);if(func!=null)
return new optEtc.Template(optTmplName,tmplContent,funcSrc,func,optEtc);return null;}
try{String.prototype.process=function(context,optFlags){var template=TrimPath.parseTemplate(this,null);if(template!=null)
return template.process(context,optFlags);return this;}}catch(e){}
TrimPath.parseTemplate_etc={};TrimPath.parseTemplate_etc.statementTag="forelse|for|if|elseif|else|var|macro";TrimPath.parseTemplate_etc.statementDef={"if":{delta:1,prefix:"if (",suffix:") {",paramMin:1},"else":{delta:0,prefix:"} else {"},"elseif":{delta:0,prefix:"} else if (",suffix:") {",paramDefault:"true"},"/if":{delta:-1,prefix:"}"},"for":{delta:1,paramMin:3,prefixFunc:function(stmtParts,state,tmplName,etc){if(stmtParts[2]!="in")
throw new etc.ParseError(tmplName,state.line,"bad for loop statement: "+stmtParts.join(' '));var iterVar=stmtParts[1];var listVar="__LIST__"+iterVar;return["var ",listVar," = ",stmtParts[3],";","var __LENGTH_STACK__;","if (typeof(__LENGTH_STACK__) == 'undefined' || !__LENGTH_STACK__.length) __LENGTH_STACK__ = new Array();","__LENGTH_STACK__[__LENGTH_STACK__.length] = 0;","if ((",listVar,") != null) { ","var ",iterVar,"_ct = 0;","for (var ",iterVar,"_index in ",listVar,") { ",iterVar,"_ct++;","if (typeof(",listVar,"[",iterVar,"_index]) == 'function') {continue;}","__LENGTH_STACK__[__LENGTH_STACK__.length - 1]++;","var ",iterVar," = ",listVar,"[",iterVar,"_index];"].join("");}},"forelse":{delta:0,prefix:"} } if (__LENGTH_STACK__[__LENGTH_STACK__.length - 1] == 0) { if (",suffix:") {",paramDefault:"true"},"/for":{delta:-1,prefix:"} }; delete __LENGTH_STACK__[__LENGTH_STACK__.length - 1];"},"var":{delta:0,prefix:"var ",suffix:";"},"macro":{delta:1,prefixFunc:function(stmtParts,state,tmplName,etc){var macroName=stmtParts[1].split('(')[0];return["var ",macroName," = function",stmtParts.slice(1).join(' ').substring(macroName.length),"{ var _OUT_arr = []; var _OUT = { write: function(m) { if (m) _OUT_arr.push(m); } }; "].join('');}},"/macro":{delta:-1,prefix:" return _OUT_arr.join(''); };"}}
TrimPath.parseTemplate_etc.modifierDef={"eat":function(v){return"";},"escape":function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");},"capitalize":function(s){return String(s).toUpperCase();},"default":function(s,d){return s!=null?s:d;}}
TrimPath.parseTemplate_etc.modifierDef.h=TrimPath.parseTemplate_etc.modifierDef.escape;TrimPath.parseTemplate_etc.Template=function(tmplName,tmplContent,funcSrc,func,etc){this.process=function(context,flags){if(context==null)
context={};if(context._MODIFIERS==null)
context._MODIFIERS={};if(context.defined==null)
context.defined=function(str){return(context[str]!=undefined);};for(var k in etc.modifierDef){if(context._MODIFIERS[k]==null)
context._MODIFIERS[k]=etc.modifierDef[k];}
if(flags==null)
flags={};var resultArr=[];var resultOut={write:function(m){resultArr.push(m);}};try{func(resultOut,context,flags);}catch(e){if(flags.throwExceptions==true)
throw e;var result=new String(resultArr.join("")+"[ERROR: "+e.toString()+(e.message?'; '+e.message:'')+"]");result["exception"]=e;return result;}
return resultArr.join("");}
this.name=tmplName;this.source=tmplContent;this.sourceFunc=funcSrc;this.toString=function(){return"TrimPath.Template ["+tmplName+"]";}}
TrimPath.parseTemplate_etc.ParseError=function(name,line,message){this.name=name;this.line=line;this.message=message;}
TrimPath.parseTemplate_etc.ParseError.prototype.toString=function(){return("TrimPath template ParseError in "+this.name+": line "+this.line+", "+this.message);}
var parse=function(body,tmplName,etc){body=cleanWhiteSpace(body);var funcText=["var TrimPath_Template_TEMP = function(_OUT, _CONTEXT, _FLAGS) { with (_CONTEXT) {"];var state={stack:[],line:1};var endStmtPrev=-1;while(endStmtPrev+1<body.length){var begStmt=endStmtPrev;begStmt=body.indexOf("{",begStmt+1);while(begStmt>=0){var endStmt=body.indexOf('}',begStmt+1);var stmt=body.substring(begStmt,endStmt);var blockrx=stmt.match(/^\{(cdata|minify|eval)/);if(blockrx){var blockType=blockrx[1];var blockMarkerBeg=begStmt+blockType.length+1;var blockMarkerEnd=body.indexOf('}',blockMarkerBeg);if(blockMarkerEnd>=0){var blockMarker;if(blockMarkerEnd-blockMarkerBeg<=0){blockMarker="{/"+blockType+"}";}else{blockMarker=body.substring(blockMarkerBeg+1,blockMarkerEnd);}
var blockEnd=body.indexOf(blockMarker,blockMarkerEnd+1);if(blockEnd>=0){emitSectionText(body.substring(endStmtPrev+1,begStmt),funcText);var blockText=body.substring(blockMarkerEnd+1,blockEnd);if(blockType=='cdata'){emitText(blockText,funcText);}else if(blockType=='minify'){emitText(scrubWhiteSpace(blockText),funcText);}else if(blockType=='eval'){if(blockText!=null&&blockText.length>0)
funcText.push('_OUT.write( (function() { '+blockText+' })() );');}
begStmt=endStmtPrev=blockEnd+blockMarker.length-1;}}}else if(body.charAt(begStmt-1)!='$'&&body.charAt(begStmt-1)!='\\'){var offset=(body.charAt(begStmt+1)=='/'?2:1);if(body.substring(begStmt+offset,begStmt+10+offset).search(TrimPath.parseTemplate_etc.statementTag)==0)
break;}
begStmt=body.indexOf("{",begStmt+1);}
if(begStmt<0)
break;var endStmt=body.indexOf("}",begStmt+1);if(endStmt<0)
break;emitSectionText(body.substring(endStmtPrev+1,begStmt),funcText);emitStatement(body.substring(begStmt,endStmt+1),state,funcText,tmplName,etc);endStmtPrev=endStmt;}
emitSectionText(body.substring(endStmtPrev+1),funcText);if(state.stack.length!=0)
throw new etc.ParseError(tmplName,state.line,"unclosed, unmatched statement(s): "+state.stack.join(","));funcText.push("}}; TrimPath_Template_TEMP");return funcText.join("");}
var emitStatement=function(stmtStr,state,funcText,tmplName,etc){var parts=stmtStr.slice(1,-1).split(' ');var stmt=etc.statementDef[parts[0]];if(stmt==null){emitSectionText(stmtStr,funcText);return;}
if(stmt.delta<0){if(state.stack.length<=0)
throw new etc.ParseError(tmplName,state.line,"close tag does not match any previous statement: "+stmtStr);state.stack.pop();}
if(stmt.delta>0)
state.stack.push(stmtStr);if(stmt.paramMin!=null&&stmt.paramMin>=parts.length)
throw new etc.ParseError(tmplName,state.line,"statement needs more parameters: "+stmtStr);if(stmt.prefixFunc!=null)
funcText.push(stmt.prefixFunc(parts,state,tmplName,etc));else
funcText.push(stmt.prefix);if(stmt.suffix!=null){if(parts.length<=1){if(stmt.paramDefault!=null)
funcText.push(stmt.paramDefault);}else{for(var i=1;i<parts.length;i++){if(i>1)
funcText.push(' ');funcText.push(parts[i]);}}
funcText.push(stmt.suffix);}}
var emitSectionText=function(text,funcText){if(text.length<=0)
return;var nlPrefix=0;var nlSuffix=text.length-1;while(nlPrefix<text.length&&(text.charAt(nlPrefix)=='\n'))
nlPrefix++;while(nlSuffix>=0&&(text.charAt(nlSuffix)==' '||text.charAt(nlSuffix)=='\t'))
nlSuffix--;if(nlSuffix<nlPrefix)
nlSuffix=nlPrefix;if(nlPrefix>0){funcText.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');var s=text.substring(0,nlPrefix).replace('\n','\\n');if(s.charAt(s.length-1)=='\n')
s=s.substring(0,s.length-1);funcText.push(s);funcText.push('");');}
var lines=text.substring(nlPrefix,nlSuffix+1).split('\n');for(var i=0;i<lines.length;i++){emitSectionTextLine(lines[i],funcText);if(i<lines.length-1)
funcText.push('_OUT.write("\\n");\n');}
if(nlSuffix+1<text.length){funcText.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');var s=text.substring(nlSuffix+1).replace('\n','\\n');if(s.charAt(s.length-1)=='\n')
s=s.substring(0,s.length-1);funcText.push(s);funcText.push('");');}}
var emitSectionTextLine=function(line,funcText){var endMarkPrev='}';var endExprPrev=-1;while(endExprPrev+endMarkPrev.length<line.length){var begMark="${",endMark="}";var begExpr=line.indexOf(begMark,endExprPrev+endMarkPrev.length);if(begExpr<0)
break;if(line.charAt(begExpr+2)=='%'){begMark="${%";endMark="%}";}
var endExpr=line.indexOf(endMark,begExpr+begMark.length);if(endExpr<0)
break;emitText(line.substring(endExprPrev+endMarkPrev.length,begExpr),funcText);var exprArr=line.substring(begExpr+begMark.length,endExpr).replace(/\|\|/g,"#@@#").split('|');for(var k in exprArr){if(exprArr[k].replace)
exprArr[k]=exprArr[k].replace(/#@@#/g,'||');}
funcText.push('_OUT.write(');emitExpression(exprArr,exprArr.length-1,funcText);funcText.push(');');endExprPrev=endExpr;endMarkPrev=endMark;}
emitText(line.substring(endExprPrev+endMarkPrev.length),funcText);}
var emitText=function(text,funcText){if(text==null||text.length<=0)
return;text=text.replace(/\\/g,'\\\\');text=text.replace(/\n/g,'\\n');text=text.replace(/"/g,'\\"');funcText.push('_OUT.write("');funcText.push(text);funcText.push('");');}
var emitExpression=function(exprArr,index,funcText){var expr=exprArr[index];if(index<=0){funcText.push(expr);return;}
var parts=expr.split(':');funcText.push('_MODIFIERS["');funcText.push(parts[0]);funcText.push('"](');emitExpression(exprArr,index-1,funcText);if(parts.length>1){funcText.push(',');funcText.push(parts[1]);}
funcText.push(')');}
var cleanWhiteSpace=function(result){result=result.replace(/\t/g,"    ");result=result.replace(/\r\n/g,"\n");result=result.replace(/\r/g,"\n");result=result.replace(/^(\s*\S*(\s+\S+)*)\s*$/,'$1');return result;}
var scrubWhiteSpace=function(result){result=result.replace(/^\s+/g,"");result=result.replace(/\s+$/g,"");result=result.replace(/\s+/g," ");result=result.replace(/^(\s*\S*(\s+\S+)*)\s*$/,'$1');return result;}
TrimPath.parseDOMTemplate=function(elementId,optDocument,optEtc){if(optDocument==null)
optDocument=document;var element=optDocument.getElementById(elementId);var content=element.value;if(content==null)
content=element.innerHTML;content=content.replace(/&lt;/g,"<").replace(/&gt;/g,">");return TrimPath.parseTemplate(content,elementId,optEtc);}
TrimPath.processDOMTemplate=function(elementId,context,optFlags,optDocument,optEtc){return TrimPath.parseDOMTemplate(elementId,optDocument,optEtc).process(context,optFlags);}})();

// $.Utility
(function($, undefined){
    $.Utility = {
        // Example: $.Utility.String.trim("$$$$$$abc$$$","$"); => abc
        // Example: $.Utility.String.trim("$$##$abc$$$#",["$", "#"]); => abc
        // Example: $.Utility.String.trim("  $abc  "); => $abc
        String:{
            trim:function(text, chr /*default:\s*/){
                if ($.isArray(chr))
                    chr = chr.join("");
                if (chr == undefined)
                    chr = '\\s';
                chr = chr.replace("/","\\/");
                leftTrim = "^["+chr+"]+";
                rightTrim = "["+chr+"]+$";
                return text.replace(new RegExp(leftTrim, "g"), "").replace(new RegExp(rightTrim,"g"), "");
            },
            tr:function(str, fromOrReplacePair, to){
                if (typeof(str) != 'string')
                    return str;
                if ($.isPlainObject(fromOrReplacePair)) {
                    for(var prop in fromOrReplacePair) {
                        str = str.replace(prop, fromOrReplacePair[prop]);
                    }
                    return str;
                }
                return str.replace(fromOrReplacePair, to)
            }
        },
        Array:{
            inArray:function(obj, arr) {
                if (!$.isArray(arr))
                    return false;
                function oc(arr) {
                    var tmp = {};
                    for(var i in arr){
                        tmp[arr[i]] = '';
                    }
                    return tmp;
                }
                return obj in oc(arr);
            }
        },
        // Example: $.Utility.System.UUID();
        System:{
            UUID:function(){
                return Date.parse((new Date).toString())+(new Date).getMilliseconds();
            },
            getCurrentUri:function() {
                var hash = undefined == window.location.hash ? '': window.location.hash.replace($.rikiki.config('locationHashPrefix'), "");
                return $.Utility.System.setCurrentUri(hash);
            },
            setCurrentUri:function(uri){
                var hash = '/' + $.Utility.String.trim(uri, ["/","\\s"]);
                window.location.hash = $.rikiki.config('locationHashPrefix') + hash;
                return hash;
            },
            getHashPrefix : function(){
                return $.rikiki.config('locationHashPrefix');
            }
        },
        Regex:{
            // @params re: regex string
            // @params group 
            // Examples: $.Utility.Regex.group('<name1>/<name2>/<name3>', {name1:'\\w+', name2:'[a-d]+', name3:'\\d+'}, 'qqqq/ass/12') => {name1:'qqqq', name2:'ass', name3:12}
            group:function(re, groups, s){
                var names = [], result = {}, cursor = 0;
                re = re.replace(/<(\w+)>/g, function(m, gname) {
                    names.push(gname);
                    if (groups[gname] == undefined)
                        return '(\\w+)';
                    else
                        return '(:regex)'.replace(/:regex/g, groups[gname]);
                });
                
                re = new RegExp(re);
                if (!re.test(s))
                    return false;

                var tmp = re.exec(s);
                if (tmp) {
                    for(var i in tmp)
                        if (tmp[i] != undefined && names[i-1])
                            result[names[i-1]] = tmp[i];
                }
                return result;
            }
        }
    }
})(jQuery);   
/*!
 * extend for jquery
 *
 */
(function($, undefined){
    $.fn.extend({
        // jquery element 对象是否在dom树中
        in_dom:function(){
            if ($(this).parent().length > 0 
                || $(this) == $(document))
                return true;
            return false;
        },
        
        serializeObject : function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }
    });
})(jQuery);

/*!
 * Core
 *
 */
// for boostrap
(function($, undefined){
    $.rikiki = function(fun){
        if ($.rikikitraps == undefined)
            $.rikikitraps = [];
        if ($.isFunction(fun))
            $.rikikitraps.push(fun);
        else {
            for(var i in $.rikikitraps)
                $.rikikitraps[i]();
            $.rikikitraps = [];
        }
    }
    $.rikiki.core = {};
    $.rikiki.core.start = function(){
        $.rikiki();
        $.rikiki.EV("hashTimerId", setInterval('$.rikiki.event.run("locationHashTrackTimer")', $.rikiki.config('locationHashTrackInterval')));
//        $.rikiki.EV("hashTimerId", setTimeout('$.rikiki.event.run("locationHashTrackTimer")', $.rikiki.config('locationHashTrackInterval')));

    }
    
    // start
    $(function(){
        $.rikiki.start();
    });
})(jQuery);

// about request
// 处理uri 动态调用controller的相应处理
// 若处理不存在，导向404
(function($, undefined){
    $.rikiki.core.request = function (uri){
        /*
        var _messages = {
            200 : 'OK',
            404 : 'Not Found',
            500 : 'Bad request'
        };
        */
        var _self = this;
        function execute_without_trycatch(){
            var _controller = $.rikiki.controller.instance(_self.controller);
            if (typeof(_controller["action_"+_self.action]) !== 'function') {
                throw $.rikiki.Exception.Reflection(_self.controller + "have not method action_" + _self.action);
            }
            
            _controller.before();
            _controller["action_"+_self.action].apply(_controller, _self.args);
            _controller.after();
            
            // ui nav item current
            // todo: fix
            $(".ui-nav-item-current").removeClass("ui-nav-item-current");
            $('.ui-nav-item').filter(function(){
                return $("a", this).attr('href') === '#!' + uri;
            }).addClass("ui-nav-item-current");
        }
        function execute() {
             try {
                execute_without_trycatch();
             }
             catch(e){
                 if (e instanceof $.rikiki.Exception.Reflection) {
                     _self.status = 404;
                     throw _self;
                 }
                 else {
                    _self.status = 500;
                    throw _self;
                 }
             }
        }
        this.execute = function(){
            if ($.rikiki.method !== 'POST')
                $.rikiki.method = 'GET';
            
            if (! $.rikiki.config("debug"))
                execute();
            else
                execute_without_trycatch();
            return this;
        }
        
        function init(){
            this.status = 200;
            var routes = $.rikiki.route.all();
            var params = false;
            for(var i in routes) {
                if ((params = routes[i].matches(uri)) === false)
                    continue;
                
                this.controller = params.controller;
                this.action = params.action;
                delete params.controller;
                delete params.action;
                
                var args = [];
                $.each(params, function(k,v) {
                    args.push(v);
                });
                this.args = args;
                break;
            }
            if (!params) {
                this.status = 404;
                var msg = 'Unable to find a route to match the URI: :uri'.replace(":uri", uri);
                throw new $.rikiki.Exception.Request(msg);
            }
            return this;
        }
        return init.call(this);
    }
    
    $.rikiki.core.request.factory = function(uri){
        if (uri != undefined)
            return new $.rikiki.request(uri);
        return null;
    }
    
    $.rikiki.core.request.redirect = function(uri, post) {
        $.rikiki.EV("reflesh", true);
        uri = uri.replace('#!', '');
        if (typeof(post) !== 'undefined') {
            $.rikiki.method = 'POST';
            $.rikiki.post = post;
            console.log($.rikiki.post);
        }
        $.Utility.System.setCurrentUri(uri);
    }
})(jQuery);

// about route
(function($, undefined){
    // <controller>/<action>, 
    $.rikiki.core.route = function (uri, regex){
        this._vars = {
            defaults:{controller:'welcome', action : 'index'},
            uri_regex:'',
            regex_map:regex
        };
        
        uri = $.Utility.String.trim(uri, "/");
        
        this.defaults = function (defaults) {
            this._vars.defaults = $.extend({}, this._vars.defaults, defaults);
            return this;
        }
        
        // var _regex_order;
        this.matches = function (_uri) {
            _uri = $.Utility.String.trim(_uri, "/");
            var ret = $.Utility.Regex.group(this._vars.uri_regex, this._vars.regex_map, _uri);
            if (ret === false)
                return false;

            ret = $.extend({}, this._vars.defaults, ret);
            return ret;
        }
        
        this._vars.uri_regex = (function(uri){
            return "^" + uri.replace(/\(/g, '(?:').replace(/\)/g, ')?') + "$";
        })(uri);
        
        return this;
    }
    
    $.rikiki.core.route.set = function(name, uri, regex){
        $.rikiki._routes = $.rikiki._routes || {};
        return $.rikiki._routes[name] = new $.rikiki.route(uri, regex);
    }
    $.rikiki.core.route.all = function(){
        $.rikiki._routes = $.rikiki._routes || {};
        return $.rikiki._routes;
    }
    $.rikiki.core.route.get = function(name){
        $.rikiki._routes = $.rikiki._routes || {};
        return $.rikiki._routes[name];
    }
})(jQuery);

/*
 * Class
 */
(function($, undefined){
    $.rikiki.core.Class = function(classname, members, statics){
        $.rikiki._classes = $.rikiki._classes || {};
        $.rikiki._classes_cached = $.rikiki._classes_cached || {};
        
        // AddClass
        function addClass(classname, members, statics){
            // if class existed
            if ($.rikiki._classes[classname] != undefined)
                console.error("Class :class existed".replace(":class", classname));
                
            // initial class members
            var Class = {
                init:function(){
                    console.log("you can overwrite function init to constructor");
                    return this;
                },
                name:classname
            };
            
            // static function
            statics = statics || {};
            statics.member = function(name, object){
                    if (typeof(name) !== 'string')
                        return;
                        
                    if (typeof(object) !== 'undefined')
                        this.prototype[name] = object;
           
                    // retore cached
                    $.rikiki.core.Class.instance(classname, true);
                    
                    return this[name];
                };
            
            function Base() {}
            Base.extend = function(initialize, parent_args, members, statics) {
                Function.prototype.alloc = Function.prototype.alloc || function(args) {
                    var str_args = [];
                    for(var i in args) {
                        str_args.push("args[:i]".replace(":i", i));
                    }
                    return eval("new this(:str_args)".replace(":str_args", str_args.join()));
                }
                Function.prototype.run = Function.prototype.run || function(args) {
                    var str_args = [];
                    for(var i in args) {
                        str_args.push("args[:i]".replace(":i", i));
                    }
                    return eval("this(:str_args)".replace(":str_args", str_args.join()));
                }
                Function.prototype.comment = Function.prototype.comment || function() {  
                    var lines = new String(this);  
                    lines = lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));  
                    return lines;  
                }

                var parent = this;
                function child(){
                    if (typeof(this.init) == 'function') {
                        return this.init.call(this, arguments);
                    }
                }
                var classname = 'child';
                var code = (function (){
                    /*
                    :child.prototype = parent.alloc(parent_args);

                    // members
                    members = members || {};
                    for(var k in members) 
                         :child.prototype[k] = members[k];

                    // static functions
                    for (var k in parent) 
                         :child[k] = parent[k];
                    statics = statics || {};
                    for(var k in statics) {
                         :child[k] = statics[k];
                    }

                    // for parent function
                    :child.$ = function(key, args, obj) {
                        var fun = function(){};
                        if (typeof(obj) !== 'undefined') {
                            var obj = parent.alloc(parent_args);
                            if (typeof(obj[key]) != 'undefined')
                                fun = obj[key];
                            return fun.call(obj, args);
                        }
                        else {
                            if (typeof(parent[key]) !== 'undefined')
                                fun = parent[key];
                            return fun.call(args);
                        }
                    }
                    */
                })
                .comment()
                .replace(/:child/g, classname);
                eval(code);
                return eval(classname);;
            }
            
            // resultant class members
            members = $.extend({}, Class, members);
            $.rikiki._classes[classname] = Base.extend(undefined, undefined, members, statics);
            return $.rikiki._classes[classname];
        }
        
        // get class
        function getClass(classname){
            // class not existed
            if ($.rikiki._classes[classname] == undefined) {
                var msg = "Class :Class not existed".replace(":Class", classname);
                throw new $.rikiki.Exception.Reflection(msg);
            }
            
            // _classes_cached
            /*
            $.rikiki._classes_cached = $.rikiki._classes_cached || {};
            $.rikiki._classes_cached[classname] = new $.rikiki._classes[classname]();
            */
            
            // return 
            return $.rikiki._classes[classname];
        }
        
        // folking execute
        if (members != undefined)
            return addClass(classname, members, statics);
        else
            return getClass(classname);
    }
    
    $.rikiki.core.Class.instance = function(classname, clearCached){
        // class not existed
        $.rikiki._classes = $.rikiki._classes || {};
        if ($.rikiki._classes[classname] == undefined) {
            var msg = "Class :Class not existed".replace(":Class", classname);
            throw new $.rikiki.Exception.Reflection(msg);
        }
        
        // cache
        clearCached = clearCached || false;
        if (clearCached) {
            $.rikiki._classes_cached[classname] = undefined;
            return;
        }
        
        if (typeof($.rikiki._classes_cached[classname]) === 'undefined') {
            $.rikiki._classes_cached[classname] = new $.rikiki._classes[classname]();
        }
        
        // return 
        return $.rikiki._classes_cached[classname];
    }
})(jQuery);

/* 
 * controller base Class
 * 处理调用函数
 *
 */
(function($, undefined){
    $.rikiki.core.controller = function(ctrlName, members){
        if (typeof(ctrlName) === 'undefined') 
            console.error("controller name can not be null!");
        
        if (typeof(members) !== 'undefined') {
            var members = $.extend({}, {
                views:[],
                conflictControllers:[],
                before:function(){
                           console.log('base before');
                           return this;
                       },
                after:function(){
                    $.rikiki.method = 'GET';
                    $.rikiki.post = undefined;
                    console.log('base after');
                    return this;
                    },
                hideViews:function(excepts){
                    excepts = excepts || [];
                    if (typeof(excepts) === 'string')
                        excepts = [excepts];
                        
                    // hide self other views
                    for(var idx in this.views) {
                        if ($.inArray(this.views[idx], excepts) < 0) {
                            $.rikiki.view(this.views[idx]).hide();
                        }
                    }
                    
                    // hide conflict controllers' views 
                    for(var i in this.conflictControllers) {
                        var v = this.controller(this.conflictControllers[i]);
                        
                        for(var idx in v.views) {
                            if ($.inArray(v.views[idx], excepts) < 0) {
                                $.rikiki.view(v.views[idx]).hide();
                            }
                        }
                    };
                    
                    return this;
                 },
                 action:function(name, argus){
                    if (typeof(this["action_" + name]) !== 'function') {
                        throw new $.rikiki.Exception(this.name, "have no action " + name);
                    }
                    return this["action_" + name].call(this, argus);
                 },
                 view:function(name) {
                    if ($.inArray(name, this.views) < 0)
                        throw "Controller :controller have no View named :view"
                                .replace(/:controller/g, ctrlName)
                                .replace(/:view/g, name);

                    this.hideViews(name);

                    return $.rikiki.view(name);
                 },
                 controller:function(name) {
                    if ($.inArray(name, this.conflictControllers) < 0)
                        throw "Controller :controller have no View named :view"
                                .replace(/:controller/g, ctrlName)
                                .replace(/:view/g, name);

                    return $.rikiki.controller.instance(name);
                 }
            }, members);
            var statics = {
                 ctrlName:ctrlName,
                 action:function(name, fun) {
                    if (typeof(name) !== 'string' || typeof(fun) != 'function')
                        return false;
                    this.member("action_" + name, fun);
                    
                    $.rikiki.controller.instance(this.ctrlName, true);
                    
                    return this;
                 },
                 view:function(view) {
                    if (typeof(view.name) === 'function'){
                        view = view.name();
                    }
                 
                    if (!$.isArray(view) && typeof(view) !== 'string') {
                        return;
                    }
                    
                    if (typeof(view) === 'string') {
                        view = [view];
                    }
                    
                    for(var i in view) {
                        this.prototype.views.push(view[i]);
                    }
                    $.rikiki.controller.instance(this.ctrlName, true);
                    return this;
                 },
                 conflictController:function(controller) {
                    if (typeof(controller.name) === 'function'){
                        view = controller.name();
                    }
                 
                    if (!$.isArray(controller) && typeof(controller) !== 'string') {
                        return;
                    }
                    
                    if (typeof(controller) === 'string') {
                        controller = [controller];
                    }
                    
                    for(var i in controller) {
                        this.prototype.conflictControllers.push(controller[i]);
                    }
                    $.rikiki.controller.instance(this.ctrlName, true);
                    return this;
                 },
                 
                 before:function(fun) {
                    var prefun = this.prototype.before;
                    if (typeof(fun) === 'function')
                        this.member("before", function() {
                            prefun.call(this, arguments);
                            fun.call(this, arguments);
                        });
                    $.rikiki.controller.instance(this.ctrlName, true);
                    return this;
                 },
                 after:function(fun) {
                    var prefun = this.prototype.after;
                    if (typeof(fun) === 'function')
                        this.member("after", function(){
                            prefun.call(this, arguments);
                            fun.call(this, arguments);
                        });
                    $.rikiki.controller.instance(this.ctrlName, true);
                    return this;
                 }
            };
            return $.rikiki.Class("controller_"+ctrlName, members, statics);
        }
        return $.rikiki.Class("controller_"+ctrlName);
    }
    
    $.rikiki.core.controller.instance = function(name, clearCached) {
        return $.rikiki.Class.instance("controller_"+name, clearCached);
    }
    
    $.rikiki(function(){
        $.rikiki.view("404", "uri not found");
        $.rikiki.controller(
            'error', {
                action_404:function(){
                    $.rikiki.view("404").show();
                }
            }
        );
    });
})(jQuery);

/*
 * views
 *
 */
(function($, undefined){
    // View Class
    function View(name, content, parent) {
        self = this;
    
        if (!content)
            console.error("View content can't be null");

        // specify a parent for view, then it
        // choose specified parent preferentially
        // then if content is a dom element, use its parent
        // end use $('body')
        function fn_parent(_content, _parent) {
            if (_parent)
                return _parent;
            
            if (typeof(_content) == "object" && $(_content).in_dom())
                return _content.parent();
            
            return $("body");
        }

        function fn_content(_content) {
            if (typeof(_content) == "object") {
                _content = $(_content);
                if(_content.in_dom()) {
                    _content.detach();
                }
            }
            else {
                if ($(_content).length > 0) {
                    _content = $(_content);
                }
                else {
                    _content = $("<div />").html(_content);
                }
            }
            
            return $("<div />").append(_content).html();
        }
        
        this._name = name;
        this._parent  = fn_parent(content, parent);
        this._content = fn_content(content);

        this._reload_data  = true;
        this._reload_event = true;
    }
    
    View.prototype = {
        // the jquery element node that  the view redering
        renderingNode : undefined,
        
        // name
        name:function() {
            return this._name;
        },
        
        // set data
        data : function(nameOrObject, data) {
            this._data = this._data || {};
            if (typeof(nameOrObject) == 'string') { 
                var name = nameOrObject;
                this._data[name] = data;
            }
            else if ($.isPlainObject(nameOrObject)){
                $.extend(true, this._data, nameOrObject);
            }
            this._reload_data = true;
            return this;
        },
        
        node : function() {
            return this.renderingNode;
        },

        // hide
        hide : function() {
            if (this.renderingNode && this.renderingNode.in_dom()) {
                this.renderingNode
                    .hide("fast");
            }
            return this;
        },
        
        // show -- render and show
        show : function() {
            if (this.render().renderingNode && this.renderingNode.in_dom()) {
                this.renderingNode.prependTo(this._parent);
                this.renderingNode.show("fast");
            }
            return this;
        },
        
        // render -- load and process data (if data changed reload it)
        render : function() {
            // load data, using trimPath
            if (this._reload_data) {
                if (this.renderingNode && this.renderingNode.in_dom())
                    this.renderingNode.remove();
            
                var _rendering_content = this._content.process(this._data);
                try {
                    $("<div />").html(_rendering_content);
                    this.renderingNode = $(_rendering_content);
                }
                catch(e){
                    console.error(_rendering_content.substr(_rendering_content.lastIndexOf('[ERROR')));
                }
            }
            
            // bind event
            if (this.renderingNode && (this._reload_data || this._reload_event)) {
                for(var i in this._event) {
                    var struct = this._event[i];
                    $(struct.sel, this.renderingNode).bind(struct.ev, struct.fn);
                }
            }
            
            // clear reload_data and reload_event flag
            this._reload_data = false;
            this._reload_event = false;
                
            // append to parent
            if (this.renderingNode && !this.renderingNode.in_dom()) {
                this.renderingNode.attr({rel:"ui-view-" + this._name})
                    .hide()
                    .prependTo(this._parent);
            }
           
            return this;
        },
        
        // node 
        node : function(selector) {
            return $(selector, this.renderingNode);
        },
        
        // state
        state : function(state, render/* function(visible - bool) or selector */) {
            this._state = this._state || {};
            if (render) {
                this._state[state] = render;
            }
            else {
                var self = this;
                $.each(this._state, function(k, v) {
                    var visible = (k === state);
                    (function(visible) {
                        if (typeof(v) === 'function') {
                            v.call(self, visible);
                        }
                        else if (typeof(v) === 'string') {
                            var node = $(v, this.renderingNode);
                            visible ? node.show() : node.hide();
                        }
                    })(visible);
                });
            }
            return this;
        },
        
        // bind - selector event function
        bind:function(sel, ev,  fn) {
            this._event = this._event || [];
            if (typeof(sel) === 'string' && typeof(ev) === 'string' && typeof(fn) === 'function') {
                this._event.push({
                    sel:sel,
                    ev:ev,
                    fn:fn
                });
                this._reload_event = true;
            }
            return this;
        }
    }
    
    // add View
    function addView(name, content, parent) {
        $.rikiki._views = $.rikiki._views || {};
        if (typeof($.rikiki._views[name]) != 'undefined') {
            console.warning('view named "' + name + '" has been defined before!');
        }
        $.rikiki._views[name] = new View(name, content, parent);
        
        // previous binding
        $.rikiki._views[name].bind("form.rikiki", "submit", function(){
            try {
                console.log($(this).attr("action"));
                console.log($(this).serializeObject());
                $.rikiki.request.redirect($(this).attr("action"), $(this).serializeObject());
            }
            catch(e) {
                console.log(e);
                return false;
            }
            return false;
        });
        
        return $.rikiki._views[name];
    }
    
    // get view
    function getView(name) {
        $.rikiki._views = $.rikiki._views || {};
        if (typeof($.rikiki._views[name]) == 'undefined') {
            console.error('view named "' + name + '" has never been defined before use!');
            return null;
        }
        return $.rikiki._views[name];
    }

    // forking execute
    // @eg. $.rikiki.view(name, content, parent)
    // @eg. $.rikiki.view({name:xx,content:xx,parent:xx)
    $.rikiki.core.view = function(nameOrObject, content, parent) {
        // to add view
        if ($.isPlainObject(nameOrObject) || content) {
            var params = typeof(content) !== 'undefined'
                            ? {
                                name:nameOrObject,
                                content:content,
                                parent:parent
                               }
                            : nameOrObject;
            return addView(params.name, params.content, params.parent);
        }
        // to get View
        else if (typeof(nameOrObject) === 'string')
            return getView(nameOrObject);
    }
})(jQuery);

/*
 * Events
 */
(function($, undefined){
    // Event binding: name - function
    $.rikiki.core.event = function(name, fun) {
        $.rikiki._events = $.rikiki._events || {};
        if (!$.Utility.Array.inArray(typeof(name), ["string","number"]))
            return;
        if (fun && $.isFunction(fun)) {
            if ($.isFunction(fun))
                $.rikiki._events[name] = fun;
        }
    };
    
    // Event callback
    $.rikiki.core.event.run = function(name, params) {
        $.rikiki._events = $.rikiki._events || {};
        if (typeof($.rikiki._events[name]) == 'function')
            $.rikiki._events[name](params);
    }
    
    // three initial event
    $.rikiki(function(){
        // 1.location hast track - for check weather hash changed, if changed if view run a locationHashChanged
        $.rikiki.event("locationHashTrackTimer", function (){
            var currentUri = $.Utility.System.getCurrentUri();
            var referrer = $.rikiki.EV('referrer');
            var reflesh = $.rikiki.EV('reflesh', false);
            if (referrer != currentUri || reflesh) {
                $.rikiki.event.run("locationHashChanged", currentUri);
                $.rikiki.EV("referrer", currentUri);
            }
        })
        // 2.request Exception occurence
        $.rikiki.event("requestException", function(req) {
            try {
                $.rikiki.request.factory("error/" + req.status).execute();
            }
            catch(e) {
                console.error('you may have to handle the request for error code ' + req.status);
            }
        });
        // 3.locationHashChanged
        $.rikiki.event("locationHashChanged", function(uri) {
            if (! $.rikiki.config("debug")) {
                try {
                    $.rikiki.request.factory(uri).execute();
                }
                catch(e) {
                    if (e instanceof $.rikiki.request)
                           $.rikiki.event.run("requestException", e);
                    else
                           console.error(e);
                }
            }
            else {
                $.rikiki.request.factory(uri).execute();
            }
        });
        // 4.Stop System
        $.rikiki.event("stopApplication", function() {
            clearInterval($.rikiki.EV("hashTimerId"));
        });
    });
})(jQuery);

// about hash
// require request
(function($, undefined){
    // Environmment Variable
    $.rikiki.EV = function(name, val){
        if (!name)
            return;
            
        $.rikiki._evs = $.rikiki._evs || {};
        var ret = $.rikiki._evs[name];
        if (val !== undefined)
            $.rikiki._evs[name] = val;
        return ret;
    };
})(jQuery);

// Exception
(function($, undefined){
    $.rikiki.Exception = function(type, message){
        this.message = message;
        this.type = type;
        this.toString = function(){
            return "Error :type: :message".replace(/:type/g, this.type).replace(/:message/g, this.message);
        }
        return this;
    }
    $.rikiki.Exception.Reflection = function(message) {
        return $.rikiki.Exception.call(this, 'reflection', message);
    }
    $.rikiki.Exception.Request = function(message) {
        return $.rikiki.Exception.call(this, 'request', message);
    }
    
})(jQuery);

// config
(function($, undefined){
    $.rikiki.core.config = function(nameOrObject, val) {
        $.rikiki._config = $.rikiki._config || {};
        if ($.isPlainObject(nameOrObject)) {
            $.rikiki._config = $.extend({}, $.rikiki._config, nameOrObject);
            return $.rikiki._config;
        }
        if (val == undefined)
            return $.rikiki._config[nameOrObject];
        return $.rikiki._config[nameOrObject] = val;
    };
    $.rikiki(function(){
        $.rikiki.config({
            locationHashPrefix:"#",
            locationHashTrackInterval:100,
            debug:true
        })
    });
    
    $.rikiki.Effects = {};
})(jQuery);

(function($, undefined){
    // bootstrap
    $.rikiki.start = function(){
        return $.rikiki.core.start.apply(this, arguments);
    }
    // config
    $.rikiki.config = function(nameOrObject, val) {
        return $.rikiki.core.config.apply(this, arguments);
    }
    // request
    $.rikiki.request = function(uri) {
        return $.rikiki.core.request.apply(this, arguments);
    }
    $.rikiki.request.factory = function(uri) {
        return $.rikiki.core.request.factory.apply(this, arguments);
    }
    $.rikiki.request.redirect = function(uri, post) {
        return  $.rikiki.core.request.redirect.apply(this, arguments);
    }
    // Route
    $.rikiki.route = function(uri, regex) {
        return $.rikiki.core.route.apply(this, arguments);
    }
    $.rikiki.route.set = function(name, uri, regex) {
        return $.rikiki.core.route.set.apply(this, arguments);
    }
    $.rikiki.route.get = function(name) {
        return $.rikiki.core.route.get.apply(this, arguments);
    }
    $.rikiki.route.all = function() {
        return $.rikiki.core.route.all.apply(this, arguments);
    }
    // Class
    $.rikiki.Class = function(classname, members) {
        return $.rikiki.core.Class.apply(this, arguments);
    }
    $.rikiki.Class.instance = function(classname){
        return $.rikiki.core.Class.instance.apply(this, arguments);
    }
    // controller
    $.rikiki.controller = function(name, members) {
        return $.rikiki.core.controller.apply(this, arguments);
    }
    $.rikiki.controller.instance = function(name){
        return $.rikiki.core.controller.instance.apply(this, arguments);
    }
    
    // View
    $.rikiki.view = function(name, content, parent) {
        return $.rikiki.core.view.apply(this, arguments);
    }
    
    // Event
    $.rikiki.event = function(name, fun) {
        return $.rikiki.core.event.apply(this, arguments);
    }
    $.rikiki.event.run = function(name, params) {
        return $.rikiki.core.event.run.apply(this, arguments);
    }
})(jQuery);
