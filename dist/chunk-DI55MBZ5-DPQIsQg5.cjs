"use strict";const Jt=require("./chunk-55IACEB6-CTgZAmsS.cjs"),Qt=require("./chunk-QN33PNHL-BpuLfacI.cjs"),s=require("./mermaid.core-DReK6Gz0.cjs");var Dt=(function(){var e=s.__name(function(B,l,u,o){for(u=u||{},o=B.length;o--;u[B[o]]=l);return u},"o"),t=[1,2],i=[1,3],n=[1,4],r=[2,4],c=[1,9],f=[1,11],S=[1,16],p=[1,17],y=[1,18],T=[1,19],E=[1,33],b=[1,20],C=[1,21],w=[1,22],A=[1,23],R=[1,24],d=[1,26],x=[1,27],O=[1,28],N=[1,29],F=[1,30],$=[1,31],Y=[1,32],st=[1,35],it=[1,36],rt=[1,37],at=[1,38],H=[1,34],_=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],nt=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],vt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],pt={trace:s.__name(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:s.__name(function(l,u,o,g,m,a,q){var h=a.length-1;switch(m){case 3:return g.setRootDoc(a[h]),a[h];case 4:this.$=[];break;case 5:a[h]!="nl"&&(a[h-1].push(a[h]),this.$=a[h-1]);break;case 6:case 7:this.$=a[h];break;case 8:this.$="nl";break;case 12:this.$=a[h];break;case 13:const J=a[h-1];J.description=g.trimColon(a[h]),this.$=J;break;case 14:this.$={stmt:"relation",state1:a[h-2],state2:a[h]};break;case 15:const St=g.trimColon(a[h]);this.$={stmt:"relation",state1:a[h-3],state2:a[h-1],description:St};break;case 19:this.$={stmt:"state",id:a[h-3],type:"default",description:"",doc:a[h-1]};break;case 20:var V=a[h],W=a[h-2].trim();if(a[h].match(":")){var lt=a[h].split(":");V=lt[0],W=[W,lt[1]]}this.$={stmt:"state",id:V,type:"default",description:W};break;case 21:this.$={stmt:"state",id:a[h-3],type:"default",description:a[h-5],doc:a[h-1]};break;case 22:this.$={stmt:"state",id:a[h],type:"fork"};break;case 23:this.$={stmt:"state",id:a[h],type:"join"};break;case 24:this.$={stmt:"state",id:a[h],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:a[h-1].trim(),note:{position:a[h-2].trim(),text:a[h].trim()}};break;case 29:this.$=a[h].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=a[h].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:a[h-3],url:a[h-2],tooltip:a[h-1]};break;case 33:this.$={stmt:"click",id:a[h-3],url:a[h-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:a[h-1].trim(),classes:a[h].trim()};break;case 36:this.$={stmt:"style",id:a[h-1].trim(),styleClass:a[h].trim()};break;case 37:this.$={stmt:"applyClass",id:a[h-1].trim(),styleClass:a[h].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:a[h].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:a[h-2].trim(),classes:[a[h].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:a[h-2].trim(),classes:[a[h].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:t,5:i,6:n},{1:[3]},{3:5,4:t,5:i,6:n},{3:6,4:t,5:i,6:n},e([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],r,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:c,5:f,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:p,19:y,22:T,24:E,25:b,26:C,27:w,28:A,29:R,32:25,33:d,35:x,37:O,38:N,41:F,45:$,48:Y,51:st,52:it,53:rt,54:at,57:H},e(_,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:S,17:p,19:y,22:T,24:E,25:b,26:C,27:w,28:A,29:R,32:25,33:d,35:x,37:O,38:N,41:F,45:$,48:Y,51:st,52:it,53:rt,54:at,57:H},e(_,[2,7]),e(_,[2,8]),e(_,[2,9]),e(_,[2,10]),e(_,[2,11]),e(_,[2,12],{14:[1,40],15:[1,41]}),e(_,[2,16]),{18:[1,42]},e(_,[2,18],{20:[1,43]}),{23:[1,44]},e(_,[2,22]),e(_,[2,23]),e(_,[2,24]),e(_,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},e(_,[2,28]),{34:[1,49]},{36:[1,50]},e(_,[2,31]),{13:51,24:E,57:H},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},e(nt,[2,44],{58:[1,56]}),e(nt,[2,45],{58:[1,57]}),e(_,[2,38]),e(_,[2,39]),e(_,[2,40]),e(_,[2,41]),e(_,[2,6]),e(_,[2,13]),{13:58,24:E,57:H},e(_,[2,17]),e(vt,r,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},e(_,[2,29]),e(_,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},e(_,[2,14],{14:[1,71]}),{4:c,5:f,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:p,19:y,21:[1,72],22:T,24:E,25:b,26:C,27:w,28:A,29:R,32:25,33:d,35:x,37:O,38:N,41:F,45:$,48:Y,51:st,52:it,53:rt,54:at,57:H},e(_,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},e(_,[2,34]),e(_,[2,35]),e(_,[2,36]),e(_,[2,37]),e(nt,[2,46]),e(nt,[2,47]),e(_,[2,15]),e(_,[2,19]),e(vt,r,{7:78}),e(_,[2,26]),e(_,[2,27]),{5:[1,79]},{5:[1,80]},{4:c,5:f,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:p,19:y,21:[1,81],22:T,24:E,25:b,26:C,27:w,28:A,29:R,32:25,33:d,35:x,37:O,38:N,41:F,45:$,48:Y,51:st,52:it,53:rt,54:at,57:H},e(_,[2,32]),e(_,[2,33]),e(_,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:s.__name(function(l,u){if(u.recoverable)this.trace(l);else{var o=new Error(l);throw o.hash=u,o}},"parseError"),parse:s.__name(function(l){var u=this,o=[0],g=[],m=[null],a=[],q=this.table,h="",V=0,W=0,lt=2,J=1,St=a.slice.call(arguments,1),D=Object.create(this.lexer),M={yy:{}};for(var _t in this.yy)Object.prototype.hasOwnProperty.call(this.yy,_t)&&(M.yy[_t]=this.yy[_t]);D.setInput(l,M.yy),M.yy.lexer=D,M.yy.parser=this,typeof D.yylloc>"u"&&(D.yylloc={});var gt=D.yylloc;a.push(gt);var Xt=D.options&&D.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function qt(L){o.length=o.length-2*L,m.length=m.length-L,a.length=a.length-L}s.__name(qt,"popStack");function Ct(){var L;return L=g.pop()||D.lex()||J,typeof L!="number"&&(L instanceof Array&&(g=L,L=g.pop()),L=u.symbols_[L]||L),L}s.__name(Ct,"lex");for(var v,U,I,yt,z={},ct,P,At,ht;;){if(U=o[o.length-1],this.defaultActions[U]?I=this.defaultActions[U]:((v===null||typeof v>"u")&&(v=Ct()),I=q[U]&&q[U][v]),typeof I>"u"||!I.length||!I[0]){var mt="";ht=[];for(ct in q[U])this.terminals_[ct]&&ct>lt&&ht.push("'"+this.terminals_[ct]+"'");D.showPosition?mt="Parse error on line "+(V+1)+`:
`+D.showPosition()+`
Expecting `+ht.join(", ")+", got '"+(this.terminals_[v]||v)+"'":mt="Parse error on line "+(V+1)+": Unexpected "+(v==J?"end of input":"'"+(this.terminals_[v]||v)+"'"),this.parseError(mt,{text:D.match,token:this.terminals_[v]||v,line:D.yylineno,loc:gt,expected:ht})}if(I[0]instanceof Array&&I.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+v);switch(I[0]){case 1:o.push(v),m.push(D.yytext),a.push(D.yylloc),o.push(I[1]),v=null,W=D.yyleng,h=D.yytext,V=D.yylineno,gt=D.yylloc;break;case 2:if(P=this.productions_[I[1]][1],z.$=m[m.length-P],z._$={first_line:a[a.length-(P||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(P||1)].first_column,last_column:a[a.length-1].last_column},Xt&&(z._$.range=[a[a.length-(P||1)].range[0],a[a.length-1].range[1]]),yt=this.performAction.apply(z,[h,W,V,M.yy,I[1],m,a].concat(St)),typeof yt<"u")return yt;P&&(o=o.slice(0,-1*P*2),m=m.slice(0,-1*P),a=a.slice(0,-1*P)),o.push(this.productions_[I[1]][0]),m.push(z.$),a.push(z._$),At=q[o[o.length-2]][o[o.length-1]],o.push(At);break;case 3:return!0}}return!0},"parse")},Kt=(function(){var B={EOF:1,parseError:s.__name(function(u,o){if(this.yy.parser)this.yy.parser.parseError(u,o);else throw new Error(u)},"parseError"),setInput:s.__name(function(l,u){return this.yy=u||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:s.__name(function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var u=l.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},"input"),unput:s.__name(function(l){var u=l.length,o=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),o.length-1&&(this.yylineno-=o.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:o?(o.length===g.length?this.yylloc.first_column:0)+g[g.length-o.length].length-o[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},"unput"),more:s.__name(function(){return this._more=!0,this},"more"),reject:s.__name(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:s.__name(function(l){this.unput(this.match.slice(l))},"less"),pastInput:s.__name(function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:s.__name(function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:s.__name(function(){var l=this.pastInput(),u=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+u+"^"},"showPosition"),test_match:s.__name(function(l,u){var o,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],o=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),o)return o;if(this._backtrack){for(var a in m)this[a]=m[a];return!1}return!1},"test_match"),next:s.__name(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,u,o,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),a=0;a<m.length;a++)if(o=this._input.match(this.rules[m[a]]),o&&(!u||o[0].length>u[0].length)){if(u=o,g=a,this.options.backtrack_lexer){if(l=this.test_match(o,m[a]),l!==!1)return l;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(l=this.test_match(u,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:s.__name(function(){var u=this.next();return u||this.lex()},"lex"),begin:s.__name(function(u){this.conditionStack.push(u)},"begin"),popState:s.__name(function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:s.__name(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:s.__name(function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},"topState"),pushState:s.__name(function(u){this.begin(u)},"pushState"),stateStackSize:s.__name(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:s.__name(function(u,o,g,m){switch(g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState("SCALE"),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin("acc_title"),33;case 19:return this.popState(),"acc_title_value";case 20:return this.begin("acc_descr"),35;case 21:return this.popState(),"acc_descr_value";case 22:this.begin("acc_descr_multiline");break;case 23:this.popState();break;case 24:return"acc_descr_multiline_value";case 25:return this.pushState("CLASSDEF"),41;case 26:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 27:return this.popState(),this.pushState("CLASSDEFID"),42;case 28:return this.popState(),43;case 29:return this.pushState("CLASS"),48;case 30:return this.popState(),this.pushState("CLASS_STYLE"),49;case 31:return this.popState(),50;case 32:return this.pushState("STYLE"),45;case 33:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 34:return this.popState(),47;case 35:return this.pushState("SCALE"),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState("STATE");break;case 39:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState("STATE_STRING");break;case 50:return this.pushState("STATE_ID"),"AS";case 51:return this.popState(),"ID";case 52:this.popState();break;case 53:return"STATE_DESCR";case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState("struct"),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin("NOTE"),29;case 61:return this.popState(),this.pushState("NOTE_ID"),59;case 62:return this.popState(),this.pushState("NOTE_ID"),60;case 63:this.popState(),this.pushState("FLOATING_NOTE");break;case 64:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 65:break;case 66:return"NOTE_TEXT";case 67:return this.popState(),"ID";case 68:return this.popState(),this.pushState("NOTE_TEXT"),24;case 69:return this.popState(),o.yytext=o.yytext.substr(2).trim(),31;case 70:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return o.yytext=o.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return B})();pt.lexer=Kt;function ot(){this.yy={}}return s.__name(ot,"Parser"),ot.prototype=pt,pt.Parser=ot,new ot})();Dt.parser=Dt;var Zt=Dt,te="TB",$t="TB",xt="dir",X="state",K="root",bt="relation",ee="classDef",se="style",ie="applyClass",tt="default",Pt="divider",Ft="fill:none",Yt="fill: #333",Bt="c",Gt="text",Vt="normal",Tt="rect",Et="rectWithTitle",re="stateStart",ae="stateEnd",Lt="divider",Rt="roundedWithTitle",ne="note",oe="noteGroup",et="statediagram",le="state",ce=`${et}-${le}`,Mt="transition",he="note",ue="note-edge",de=`${Mt} ${ue}`,fe=`${et}-${he}`,pe="cluster",Se=`${et}-${pe}`,_e="cluster-alt",ge=`${et}-${_e}`,Ut="parent",jt="note",ye="state",kt="----",me=`${kt}${jt}`,Ot=`${kt}${Ut}`,Ht=s.__name((e,t=$t)=>{if(!e.doc)return t;let i=t;for(const n of e.doc)n.stmt==="dir"&&(i=n.value);return i},"getDir"),Te=s.__name(function(e,t){return t.db.getClasses()},"getClasses"),Ee=s.__name(async function(e,t,i,n){s.log.info("REF0:"),s.log.info("Drawing state diagram (v2)",t);const{securityLevel:r,state:c,layout:f}=s.getConfig2();n.db.extract(n.db.getRootDocV2());const S=n.db.getData(),p=Jt.getDiagramElement(t,r);S.type=n.type,S.layoutAlgorithm=f,S.nodeSpacing=(c==null?void 0:c.nodeSpacing)||50,S.rankSpacing=(c==null?void 0:c.rankSpacing)||50,S.markers=["barb"],S.diagramId=t,await s.render(S,p);const y=8;try{(typeof n.db.getLinks=="function"?n.db.getLinks():new Map).forEach((E,b)=>{var O;const C=typeof b=="string"?b:typeof(b==null?void 0:b.id)=="string"?b.id:"";if(!C){s.log.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(b));return}const w=(O=p.node())==null?void 0:O.querySelectorAll("g");let A;if(w==null||w.forEach(N=>{var $;(($=N.textContent)==null?void 0:$.trim())===C&&(A=N)}),!A){s.log.warn("⚠️ Could not find node matching text:",C);return}const R=A.parentNode;if(!R){s.log.warn("⚠️ Node has no parent, cannot wrap:",C);return}const d=document.createElementNS("http://www.w3.org/2000/svg","a"),x=E.url.replace(/^"+|"+$/g,"");if(d.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",x),d.setAttribute("target","_blank"),E.tooltip){const N=E.tooltip.replace(/^"+|"+$/g,"");d.setAttribute("title",N)}R.replaceChild(d,A),d.appendChild(A),s.log.info("🔗 Wrapped node in <a> tag for:",C,E.url)})}catch(T){s.log.error("❌ Error injecting clickable links:",T)}s.utils_default.insertTitle(p,"statediagramTitleText",(c==null?void 0:c.titleTopMargin)??25,n.db.getDiagramTitle()),Qt.setupViewPortForSVG(p,y,et,(c==null?void 0:c.useMaxWidth)??!0)},"draw"),De={getClasses:Te,draw:Ee,getDir:Ht},dt=new Map,G=0;function ft(e="",t=0,i="",n=kt){const r=i!==null&&i.length>0?`${n}${i}`:"";return`${ye}-${e}${r}-${t}`}s.__name(ft,"stateDomId");var be=s.__name((e,t,i,n,r,c,f,S)=>{s.log.trace("items",t),t.forEach(p=>{switch(p.stmt){case X:Z(e,p,i,n,r,c,f,S);break;case tt:Z(e,p,i,n,r,c,f,S);break;case bt:{Z(e,p.state1,i,n,r,c,f,S),Z(e,p.state2,i,n,r,c,f,S);const y={id:"edge"+G,start:p.state1.id,end:p.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Ft,labelStyle:"",label:s.common_default.sanitizeText(p.description??"",s.getConfig2()),arrowheadStyle:Yt,labelpos:Bt,labelType:Gt,thickness:Vt,classes:Mt,look:f};r.push(y),G++}break}})},"setupDoc"),Nt=s.__name((e,t=$t)=>{let i=t;if(e.doc)for(const n of e.doc)n.stmt==="dir"&&(i=n.value);return i},"getDir");function Q(e,t,i){if(!t.id||t.id==="</join></fork>"||t.id==="</choice>")return;t.cssClasses&&(Array.isArray(t.cssCompiledStyles)||(t.cssCompiledStyles=[]),t.cssClasses.split(" ").forEach(r=>{const c=i.get(r);c&&(t.cssCompiledStyles=[...t.cssCompiledStyles??[],...c.styles])}));const n=e.find(r=>r.id===t.id);n?Object.assign(n,t):e.push(t)}s.__name(Q,"insertOrUpdateNode");function Wt(e){var t;return((t=e==null?void 0:e.classes)==null?void 0:t.join(" "))??""}s.__name(Wt,"getClassesFromDbInfo");function zt(e){return(e==null?void 0:e.styles)??[]}s.__name(zt,"getStylesFromDbInfo");var Z=s.__name((e,t,i,n,r,c,f,S)=>{var C,w,A;const p=t.id,y=i.get(p),T=Wt(y),E=zt(y),b=s.getConfig2();if(s.log.info("dataFetcher parsedItem",t,y,E),p!=="root"){let R=Tt;t.start===!0?R=re:t.start===!1&&(R=ae),t.type!==tt&&(R=t.type),dt.get(p)||dt.set(p,{id:p,shape:R,description:s.common_default.sanitizeText(p,b),cssClasses:`${T} ${ce}`,cssStyles:E});const d=dt.get(p);t.description&&(Array.isArray(d.description)?(d.shape=Et,d.description.push(t.description)):(C=d.description)!=null&&C.length&&d.description.length>0?(d.shape=Et,d.description===p?d.description=[t.description]:d.description=[d.description,t.description]):(d.shape=Tt,d.description=t.description),d.description=s.common_default.sanitizeTextOrArray(d.description,b)),((w=d.description)==null?void 0:w.length)===1&&d.shape===Et&&(d.type==="group"?d.shape=Rt:d.shape=Tt),!d.type&&t.doc&&(s.log.info("Setting cluster for XCX",p,Nt(t)),d.type="group",d.isGroup=!0,d.dir=Nt(t),d.shape=t.type===Pt?Lt:Rt,d.cssClasses=`${d.cssClasses} ${Se} ${c?ge:""}`);const x={labelStyle:"",shape:d.shape,label:d.description,cssClasses:d.cssClasses,cssCompiledStyles:[],cssStyles:d.cssStyles,id:p,dir:d.dir,domId:ft(p,G),type:d.type,isGroup:d.type==="group",padding:8,rx:10,ry:10,look:f};if(x.shape===Lt&&(x.label=""),e&&e.id!=="root"&&(s.log.trace("Setting node ",p," to be child of its parent ",e.id),x.parentId=e.id),x.centerLabel=!0,t.note){const O={labelStyle:"",shape:ne,label:t.note.text,cssClasses:fe,cssStyles:[],cssCompiledStyles:[],id:p+me+"-"+G,domId:ft(p,G,jt),type:d.type,isGroup:d.type==="group",padding:(A=b.flowchart)==null?void 0:A.padding,look:f,position:t.note.position},N=p+Ot,F={labelStyle:"",shape:oe,label:t.note.text,cssClasses:d.cssClasses,cssStyles:[],id:p+Ot,domId:ft(p,G,Ut),type:"group",isGroup:!0,padding:16,look:f,position:t.note.position};G++,F.id=N,O.parentId=N,Q(n,F,S),Q(n,O,S),Q(n,x,S);let $=p,Y=O.id;t.note.position==="left of"&&($=O.id,Y=p),r.push({id:$+"-"+Y,start:$,end:Y,arrowhead:"none",arrowTypeEnd:"",style:Ft,labelStyle:"",classes:de,arrowheadStyle:Yt,labelpos:Bt,labelType:Gt,thickness:Vt,look:f})}else Q(n,x,S)}t.doc&&(s.log.trace("Adding nodes children "),be(t,t.doc,i,n,r,!c,f,S))},"dataFetcher"),ke=s.__name(()=>{dt.clear(),G=0},"reset"),k={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},It=s.__name(()=>new Map,"newClassesList"),wt=s.__name(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),ut=s.__name(e=>JSON.parse(JSON.stringify(e)),"clone"),j,ve=(j=class{constructor(t){this.version=t,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=It(),this.documents={root:wt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=s.getAccTitle,this.setAccTitle=s.setAccTitle,this.getAccDescription=s.getAccDescription,this.setAccDescription=s.setAccDescription,this.setDiagramTitle=s.setDiagramTitle,this.getDiagramTitle=s.getDiagramTitle,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}extract(t){this.clear(!0);for(const r of Array.isArray(t)?t:t.doc)switch(r.stmt){case X:this.addState(r.id.trim(),r.type,r.doc,r.description,r.note);break;case bt:this.addRelation(r.state1,r.state2,r.description);break;case ee:this.addStyleClass(r.id.trim(),r.classes);break;case se:this.handleStyleDef(r);break;case ie:this.setCssClass(r.id.trim(),r.styleClass);break;case"click":this.addLink(r.id,r.url,r.tooltip);break}const i=this.getStates(),n=s.getConfig2();ke(),Z(void 0,this.getRootDocV2(),i,this.nodes,this.edges,!0,n.look,this.classes);for(const r of this.nodes)if(Array.isArray(r.label)){if(r.description=r.label.slice(1),r.isGroup&&r.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${r.id}]`);r.label=r.label[0]}}handleStyleDef(t){const i=t.id.trim().split(","),n=t.styleClass.split(",");for(const r of i){let c=this.getState(r);if(!c){const f=r.trim();this.addState(f),c=this.getState(f)}c&&(c.styles=n.map(f=>{var S;return(S=f.replace(/;/g,""))==null?void 0:S.trim()}))}}setRootDoc(t){s.log.info("Setting root doc",t),this.rootDoc=t,this.version===1?this.extract(t):this.extract(this.getRootDocV2())}docTranslator(t,i,n){if(i.stmt===bt){this.docTranslator(t,i.state1,!0),this.docTranslator(t,i.state2,!1);return}if(i.stmt===X&&(i.id===k.START_NODE?(i.id=t.id+(n?"_start":"_end"),i.start=n):i.id=i.id.trim()),i.stmt!==K&&i.stmt!==X||!i.doc)return;const r=[];let c=[];for(const f of i.doc)if(f.type===Pt){const S=ut(f);S.doc=ut(c),r.push(S),c=[]}else c.push(f);if(r.length>0&&c.length>0){const f={stmt:X,id:s.generateId(),type:"divider",doc:ut(c)};r.push(ut(f)),i.doc=r}i.doc.forEach(f=>this.docTranslator(i,f,!0))}getRootDocV2(){return this.docTranslator({id:K,stmt:K},{id:K,stmt:K,doc:this.rootDoc},!0),{id:K,doc:this.rootDoc}}addState(t,i=tt,n=void 0,r=void 0,c=void 0,f=void 0,S=void 0,p=void 0){const y=t==null?void 0:t.trim();if(!this.currentDocument.states.has(y))s.log.info("Adding state ",y,r),this.currentDocument.states.set(y,{stmt:X,id:y,descriptions:[],type:i,doc:n,note:c,classes:[],styles:[],textStyles:[]});else{const T=this.currentDocument.states.get(y);if(!T)throw new Error(`State not found: ${y}`);T.doc||(T.doc=n),T.type||(T.type=i)}if(r&&(s.log.info("Setting state description",y,r),(Array.isArray(r)?r:[r]).forEach(E=>this.addDescription(y,E.trim()))),c){const T=this.currentDocument.states.get(y);if(!T)throw new Error(`State not found: ${y}`);T.note=c,T.note.text=s.common_default.sanitizeText(T.note.text,s.getConfig2())}f&&(s.log.info("Setting state classes",y,f),(Array.isArray(f)?f:[f]).forEach(E=>this.setCssClass(y,E.trim()))),S&&(s.log.info("Setting state styles",y,S),(Array.isArray(S)?S:[S]).forEach(E=>this.setStyle(y,E.trim()))),p&&(s.log.info("Setting state styles",y,S),(Array.isArray(p)?p:[p]).forEach(E=>this.setTextStyle(y,E.trim())))}clear(t){this.nodes=[],this.edges=[],this.documents={root:wt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=It(),t||(this.links=new Map,s.clear())}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){s.log.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(t,i,n){this.links.set(t,{url:i,tooltip:n}),s.log.warn("Adding link",t,i,n)}getLinks(){return this.links}startIdIfNeeded(t=""){return t===k.START_NODE?(this.startEndCount++,`${k.START_TYPE}${this.startEndCount}`):t}startTypeIfNeeded(t="",i=tt){return t===k.START_NODE?k.START_TYPE:i}endIdIfNeeded(t=""){return t===k.END_NODE?(this.startEndCount++,`${k.END_TYPE}${this.startEndCount}`):t}endTypeIfNeeded(t="",i=tt){return t===k.END_NODE?k.END_TYPE:i}addRelationObjs(t,i,n=""){const r=this.startIdIfNeeded(t.id.trim()),c=this.startTypeIfNeeded(t.id.trim(),t.type),f=this.startIdIfNeeded(i.id.trim()),S=this.startTypeIfNeeded(i.id.trim(),i.type);this.addState(r,c,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(f,S,i.doc,i.description,i.note,i.classes,i.styles,i.textStyles),this.currentDocument.relations.push({id1:r,id2:f,relationTitle:s.common_default.sanitizeText(n,s.getConfig2())})}addRelation(t,i,n){if(typeof t=="object"&&typeof i=="object")this.addRelationObjs(t,i,n);else if(typeof t=="string"&&typeof i=="string"){const r=this.startIdIfNeeded(t.trim()),c=this.startTypeIfNeeded(t),f=this.endIdIfNeeded(i.trim()),S=this.endTypeIfNeeded(i);this.addState(r,c),this.addState(f,S),this.currentDocument.relations.push({id1:r,id2:f,relationTitle:n?s.common_default.sanitizeText(n,s.getConfig2()):void 0})}}addDescription(t,i){var c;const n=this.currentDocument.states.get(t),r=i.startsWith(":")?i.replace(":","").trim():i;(c=n==null?void 0:n.descriptions)==null||c.push(s.common_default.sanitizeText(r,s.getConfig2()))}cleanupLabel(t){return t.startsWith(":")?t.slice(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(t,i=""){this.classes.has(t)||this.classes.set(t,{id:t,styles:[],textStyles:[]});const n=this.classes.get(t);i&&n&&i.split(k.STYLECLASS_SEP).forEach(r=>{const c=r.replace(/([^;]*);/,"$1").trim();if(RegExp(k.COLOR_KEYWORD).exec(r)){const S=c.replace(k.FILL_KEYWORD,k.BG_FILL).replace(k.COLOR_KEYWORD,k.FILL_KEYWORD);n.textStyles.push(S)}n.styles.push(c)})}getClasses(){return this.classes}setCssClass(t,i){t.split(",").forEach(n=>{var c;let r=this.getState(n);if(!r){const f=n.trim();this.addState(f),r=this.getState(f)}(c=r==null?void 0:r.classes)==null||c.push(i)})}setStyle(t,i){var n,r;(r=(n=this.getState(t))==null?void 0:n.styles)==null||r.push(i)}setTextStyle(t,i){var n,r;(r=(n=this.getState(t))==null?void 0:n.textStyles)==null||r.push(i)}getDirectionStatement(){return this.rootDoc.find(t=>t.stmt===xt)}getDirection(){var t;return((t=this.getDirectionStatement())==null?void 0:t.value)??te}setDirection(t){const i=this.getDirectionStatement();i?i.value=t:this.rootDoc.unshift({stmt:xt,value:t})}trimColon(t){return t.startsWith(":")?t.slice(1).trim():t.trim()}getData(){const t=s.getConfig2();return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:Ht(this.getRootDocV2())}}getConfig(){return s.getConfig2().state}},s.__name(j,"StateDB"),j.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},j),Ce=s.__name(e=>`
defs #statediagram-barbEnd {
    fill: ${e.transitionColor};
    stroke: ${e.transitionColor};
  }
g.stateGroup text {
  fill: ${e.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${e.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${e.stateLabelColor};
}

g.stateGroup rect {
  fill: ${e.mainBkg};
  stroke: ${e.nodeBorder};
}

g.stateGroup line {
  stroke: ${e.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${e.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${e.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${e.noteBorderColor};
  fill: ${e.noteBkgColor};

  text {
    fill: ${e.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${e.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${e.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${e.edgeLabelBackground};
  p {
    background-color: ${e.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${e.edgeLabelBackground};
    fill: ${e.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${e.transitionLabelColor||e.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${e.transitionLabelColor||e.tertiaryTextColor};
}

.stateLabel text {
  fill: ${e.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${e.specialStateColor};
  stroke: ${e.specialStateColor};
}

.node .fork-join {
  fill: ${e.specialStateColor};
  stroke: ${e.specialStateColor};
}

.node circle.state-end {
  fill: ${e.innerEndBackground};
  stroke: ${e.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${e.compositeBackground||e.background};
  // stroke: ${e.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${e.stateBkg||e.mainBkg};
  stroke: ${e.stateBorder||e.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${e.mainBkg};
  stroke: ${e.stateBorder||e.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${e.lineColor};
}

.statediagram-cluster rect {
  fill: ${e.compositeTitleBackground};
  stroke: ${e.stateBorder||e.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${e.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${e.stateBorder||e.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${e.compositeBackground||e.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${e.altBackground?e.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${e.altBackground?e.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${e.noteBkgColor};
  stroke: ${e.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${e.noteBkgColor};
  stroke: ${e.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${e.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${e.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${e.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${e.lineColor};
  stroke: ${e.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${e.textColor};
}
`,"getStyles"),Ae=Ce;exports.StateDB=ve;exports.stateDiagram_default=Zt;exports.stateRenderer_v3_unified_default=De;exports.styles_default=Ae;
