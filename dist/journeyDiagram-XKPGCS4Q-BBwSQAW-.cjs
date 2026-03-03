"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const j=require("./chunk-TZMSLE5B-fZ7rBBGd.cjs"),pt=require("./chunk-FMBD7UC4-D4gKS7pU.cjs"),i=require("./mermaid.core-Bit-s-R3.cjs"),X=require("./index-Cn-2cvk-.cjs"),et=require("./arc-g393xDQ9.cjs");var U=(function(){var t=i.__name(function(h,n,s,l){for(s=s||{},l=h.length;l--;s[h[l]]=n);return s},"o"),e=[6,8,10,11,12,14,16,17,18],a=[1,9],c=[1,10],r=[1,11],f=[1,12],u=[1,13],y=[1,14],_={trace:i.__name(function(){},"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:i.__name(function(n,s,l,d,p,o,b){var x=o.length-1;switch(p){case 1:return o[x-1];case 2:this.$=[];break;case 3:o[x-1].push(o[x]),this.$=o[x-1];break;case 4:case 5:this.$=o[x];break;case 6:case 7:this.$=[];break;case 8:d.setDiagramTitle(o[x].substr(6)),this.$=o[x].substr(6);break;case 9:this.$=o[x].trim(),d.setAccTitle(this.$);break;case 10:case 11:this.$=o[x].trim(),d.setAccDescription(this.$);break;case 12:d.addSection(o[x].substr(8)),this.$=o[x].substr(8);break;case 13:d.addTask(o[x-1],o[x]),this.$="task";break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:a,12:c,14:r,16:f,17:u,18:y},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:15,11:a,12:c,14:r,16:f,17:u,18:y},t(e,[2,5]),t(e,[2,6]),t(e,[2,8]),{13:[1,16]},{15:[1,17]},t(e,[2,11]),t(e,[2,12]),{19:[1,18]},t(e,[2,4]),t(e,[2,9]),t(e,[2,10]),t(e,[2,13])],defaultActions:{},parseError:i.__name(function(n,s){if(s.recoverable)this.trace(n);else{var l=new Error(n);throw l.hash=s,l}},"parseError"),parse:i.__name(function(n){var s=this,l=[0],d=[],p=[null],o=[],b=this.table,x="",E=0,J=0,ut=2,K=1,dt=o.slice.call(arguments,1),k=Object.create(this.lexer),A={yy:{}};for(var q in this.yy)Object.prototype.hasOwnProperty.call(this.yy,q)&&(A.yy[q]=this.yy[q]);k.setInput(n,A.yy),A.yy.lexer=k,A.yy.parser=this,typeof k.yylloc>"u"&&(k.yylloc={});var O=k.yylloc;o.push(O);var yt=k.options&&k.options.ranges;typeof A.yy.parseError=="function"?this.parseError=A.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ft(w){l.length=l.length-2*w,p.length=p.length-w,o.length=o.length-w}i.__name(ft,"popStack");function Q(){var w;return w=d.pop()||k.lex()||K,typeof w!="number"&&(w instanceof Array&&(d=w,w=d.pop()),w=s.symbols_[w]||w),w}i.__name(Q,"lex");for(var v,I,T,Y,F={},N,M,tt,z;;){if(I=l[l.length-1],this.defaultActions[I]?T=this.defaultActions[I]:((v===null||typeof v>"u")&&(v=Q()),T=b[I]&&b[I][v]),typeof T>"u"||!T.length||!T[0]){var H="";z=[];for(N in b[I])this.terminals_[N]&&N>ut&&z.push("'"+this.terminals_[N]+"'");k.showPosition?H="Parse error on line "+(E+1)+`:
`+k.showPosition()+`
Expecting `+z.join(", ")+", got '"+(this.terminals_[v]||v)+"'":H="Parse error on line "+(E+1)+": Unexpected "+(v==K?"end of input":"'"+(this.terminals_[v]||v)+"'"),this.parseError(H,{text:k.match,token:this.terminals_[v]||v,line:k.yylineno,loc:O,expected:z})}if(T[0]instanceof Array&&T.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+v);switch(T[0]){case 1:l.push(v),p.push(k.yytext),o.push(k.yylloc),l.push(T[1]),v=null,J=k.yyleng,x=k.yytext,E=k.yylineno,O=k.yylloc;break;case 2:if(M=this.productions_[T[1]][1],F.$=p[p.length-M],F._$={first_line:o[o.length-(M||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(M||1)].first_column,last_column:o[o.length-1].last_column},yt&&(F._$.range=[o[o.length-(M||1)].range[0],o[o.length-1].range[1]]),Y=this.performAction.apply(F,[x,J,E,A.yy,T[1],p,o].concat(dt)),typeof Y<"u")return Y;M&&(l=l.slice(0,-1*M*2),p=p.slice(0,-1*M),o=o.slice(0,-1*M)),l.push(this.productions_[T[1]][0]),p.push(F.$),o.push(F._$),tt=b[l[l.length-2]][l[l.length-1]],l.push(tt);break;case 3:return!0}}return!0},"parse")},g=(function(){var h={EOF:1,parseError:i.__name(function(s,l){if(this.yy.parser)this.yy.parser.parseError(s,l);else throw new Error(s)},"parseError"),setInput:i.__name(function(n,s){return this.yy=s||this.yy||{},this._input=n,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:i.__name(function(){var n=this._input[0];this.yytext+=n,this.yyleng++,this.offset++,this.match+=n,this.matched+=n;var s=n.match(/(?:\r\n?|\n).*/g);return s?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),n},"input"),unput:i.__name(function(n){var s=n.length,l=n.split(/(?:\r\n?|\n)/g);this._input=n+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-s),this.offset-=s;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),l.length-1&&(this.yylineno-=l.length-1);var p=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:l?(l.length===d.length?this.yylloc.first_column:0)+d[d.length-l.length].length-l[0].length:this.yylloc.first_column-s},this.options.ranges&&(this.yylloc.range=[p[0],p[0]+this.yyleng-s]),this.yyleng=this.yytext.length,this},"unput"),more:i.__name(function(){return this._more=!0,this},"more"),reject:i.__name(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:i.__name(function(n){this.unput(this.match.slice(n))},"less"),pastInput:i.__name(function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:i.__name(function(){var n=this.match;return n.length<20&&(n+=this._input.substr(0,20-n.length)),(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:i.__name(function(){var n=this.pastInput(),s=new Array(n.length+1).join("-");return n+this.upcomingInput()+`
`+s+"^"},"showPosition"),test_match:i.__name(function(n,s){var l,d,p;if(this.options.backtrack_lexer&&(p={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(p.yylloc.range=this.yylloc.range.slice(0))),d=n[0].match(/(?:\r\n?|\n).*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-d[d.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+n[0].length},this.yytext+=n[0],this.match+=n[0],this.matches=n,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(n[0].length),this.matched+=n[0],l=this.performAction.call(this,this.yy,this,s,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),l)return l;if(this._backtrack){for(var o in p)this[o]=p[o];return!1}return!1},"test_match"),next:i.__name(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var n,s,l,d;this._more||(this.yytext="",this.match="");for(var p=this._currentRules(),o=0;o<p.length;o++)if(l=this._input.match(this.rules[p[o]]),l&&(!s||l[0].length>s[0].length)){if(s=l,d=o,this.options.backtrack_lexer){if(n=this.test_match(l,p[o]),n!==!1)return n;if(this._backtrack){s=!1;continue}else return!1}else if(!this.options.flex)break}return s?(n=this.test_match(s,p[d]),n!==!1?n:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:i.__name(function(){var s=this.next();return s||this.lex()},"lex"),begin:i.__name(function(s){this.conditionStack.push(s)},"begin"),popState:i.__name(function(){var s=this.conditionStack.length-1;return s>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:i.__name(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:i.__name(function(s){return s=this.conditionStack.length-1-Math.abs(s||0),s>=0?this.conditionStack[s]:"INITIAL"},"topState"),pushState:i.__name(function(s){this.begin(s)},"pushState"),stateStackSize:i.__name(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:i.__name(function(s,l,d,p){switch(d){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;case 8:return this.popState(),"acc_title_value";case 9:return this.begin("acc_descr"),14;case 10:return this.popState(),"acc_descr_value";case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}};return h})();_.lexer=g;function m(){this.yy={}}return i.__name(m,"Parser"),m.prototype=_,_.Parser=m,new m})();U.parser=U;var _t=U,R="",Z=[],V=[],L=[],gt=i.__name(function(){Z.length=0,V.length=0,R="",L.length=0,i.clear()},"clear"),mt=i.__name(function(t){R=t,Z.push(t)},"addSection"),xt=i.__name(function(){return Z},"getSections"),kt=i.__name(function(){let t=nt();const e=100;let a=0;for(;!t&&a<e;)t=nt(),a++;return V.push(...L),V},"getTasks"),vt=i.__name(function(){const t=[];return V.forEach(a=>{a.people&&t.push(...a.people)}),[...new Set(t)].sort()},"updateActors"),bt=i.__name(function(t,e){const a=e.substr(1).split(":");let c=0,r=[];a.length===1?(c=Number(a[0]),r=[]):(c=Number(a[0]),r=a[1].split(","));const f=r.map(y=>y.trim()),u={section:R,type:R,people:f,task:t,score:c};L.push(u)},"addTask"),wt=i.__name(function(t){const e={section:R,type:R,description:t,task:t,classes:[]};V.push(e)},"addTaskOrg"),nt=i.__name(function(){const t=i.__name(function(a){return L[a].processed},"compileTask");let e=!0;for(const[a,c]of L.entries())t(a),e=e&&c.processed;return e},"compileTasks"),Tt=i.__name(function(){return vt()},"getActors"),it={getConfig:i.__name(()=>i.getConfig2().journey,"getConfig"),clear:gt,setDiagramTitle:i.setDiagramTitle,getDiagramTitle:i.getDiagramTitle,setAccTitle:i.setAccTitle,getAccTitle:i.getAccTitle,setAccDescription:i.setAccDescription,getAccDescription:i.getAccDescription,addSection:mt,getSections:xt,getTasks:kt,addTask:bt,addTaskOrg:wt,getActors:Tt},St=i.__name(t=>`.label {
    font-family: ${t.fontFamily};
    color: ${t.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${t.textColor}
  }

  .legend {
    fill: ${t.textColor};
    font-family: ${t.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${t.textColor}
  }

  .face {
    ${t.faceColor?`fill: ${t.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${t.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${t.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${t.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${t.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${t.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${t.fontFamily};
    font-size: 12px;
    background: ${t.tertiaryColor};
    border: 1px solid ${t.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${t.fillType0?`fill: ${t.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${t.fillType0?`fill: ${t.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${t.fillType0?`fill: ${t.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${t.fillType0?`fill: ${t.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${t.fillType0?`fill: ${t.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${t.fillType0?`fill: ${t.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${t.fillType0?`fill: ${t.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${t.fillType0?`fill: ${t.fillType7}`:""};
  }

  .actor-0 {
    ${t.actor0?`fill: ${t.actor0}`:""};
  }
  .actor-1 {
    ${t.actor1?`fill: ${t.actor1}`:""};
  }
  .actor-2 {
    ${t.actor2?`fill: ${t.actor2}`:""};
  }
  .actor-3 {
    ${t.actor3?`fill: ${t.actor3}`:""};
  }
  .actor-4 {
    ${t.actor4?`fill: ${t.actor4}`:""};
  }
  .actor-5 {
    ${t.actor5?`fill: ${t.actor5}`:""};
  }
  ${pt.getIconStyles()}
`,"getStyles"),$t=St,D=i.__name(function(t,e){return j.drawRect(t,e)},"drawRect"),Mt=i.__name(function(t,e){const c=t.append("circle").attr("cx",e.cx).attr("cy",e.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),r=t.append("g");r.append("circle").attr("cx",e.cx-15/3).attr("cy",e.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),r.append("circle").attr("cx",e.cx+15/3).attr("cy",e.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function f(_){const g=et.d3arc().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);_.append("path").attr("class","mouth").attr("d",g).attr("transform","translate("+e.cx+","+(e.cy+2)+")")}i.__name(f,"smile");function u(_){const g=et.d3arc().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);_.append("path").attr("class","mouth").attr("d",g).attr("transform","translate("+e.cx+","+(e.cy+7)+")")}i.__name(u,"sad");function y(_){_.append("line").attr("class","mouth").attr("stroke",2).attr("x1",e.cx-5).attr("y1",e.cy+7).attr("x2",e.cx+5).attr("y2",e.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return i.__name(y,"ambivalent"),e.score>3?f(r):e.score<3?u(r):y(r),c},"drawFace"),lt=i.__name(function(t,e){const a=t.append("circle");return a.attr("cx",e.cx),a.attr("cy",e.cy),a.attr("class","actor-"+e.pos),a.attr("fill",e.fill),a.attr("stroke",e.stroke),a.attr("r",e.r),a.class!==void 0&&a.attr("class",a.class),e.title!==void 0&&a.append("title").text(e.title),a},"drawCircle"),ot=i.__name(function(t,e){return j.drawText(t,e)},"drawText"),Ct=i.__name(function(t,e){function a(r,f,u,y,_){return r+","+f+" "+(r+u)+","+f+" "+(r+u)+","+(f+y-_)+" "+(r+u-_*1.2)+","+(f+y)+" "+r+","+(f+y)}i.__name(a,"genPoints");const c=t.append("polygon");c.attr("points",a(e.x,e.y,50,20,7)),c.attr("class","labelBox"),e.y=e.y+e.labelMargin,e.x=e.x+.5*e.labelMargin,ot(t,e)},"drawLabel"),Et=i.__name(function(t,e,a){const c=t.append("g"),r=j.getNoteRect();r.x=e.x,r.y=e.y,r.fill=e.fill,r.width=a.width*e.taskCount+a.diagramMarginX*(e.taskCount-1),r.height=a.height,r.class="journey-section section-type-"+e.num,r.rx=3,r.ry=3,D(c,r),ct(a)(e.text,c,r.x,r.y,r.width,r.height,{class:"journey-section section-type-"+e.num},a,e.colour)},"drawSection"),rt=-1,Pt=i.__name(function(t,e,a){const c=e.x+a.width/2,r=t.append("g");rt++,r.append("line").attr("id","task"+rt).attr("x1",c).attr("y1",e.y).attr("x2",c).attr("y2",450).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),Mt(r,{cx:c,cy:300+(5-e.score)*30,score:e.score});const u=j.getNoteRect();u.x=e.x,u.y=e.y,u.fill=e.fill,u.width=a.width,u.height=a.height,u.class="task task-type-"+e.num,u.rx=3,u.ry=3,D(r,u);let y=e.x+14;e.people.forEach(_=>{const g=e.actors[_].color,m={cx:y,cy:e.y,r:7,fill:g,stroke:"#000",title:_,pos:e.actors[_].position};lt(r,m),y+=10}),ct(a)(e.task,r,u.x,u.y,u.width,u.height,{class:"task"},a,e.colour)},"drawTask"),At=i.__name(function(t,e){j.drawBackgroundRect(t,e)},"drawBackgroundRect"),ct=(function(){function t(r,f,u,y,_,g,m,h){const n=f.append("text").attr("x",u+_/2).attr("y",y+g/2+5).style("font-color",h).style("text-anchor","middle").text(r);c(n,m)}i.__name(t,"byText");function e(r,f,u,y,_,g,m,h,n){const{taskFontSize:s,taskFontFamily:l}=h,d=r.split(/<br\s*\/?>/gi);for(let p=0;p<d.length;p++){const o=p*s-s*(d.length-1)/2,b=f.append("text").attr("x",u+_/2).attr("y",y).attr("fill",n).style("text-anchor","middle").style("font-size",s).style("font-family",l);b.append("tspan").attr("x",u+_/2).attr("dy",o).text(d[p]),b.attr("y",y+g/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),c(b,m)}}i.__name(e,"byTspan");function a(r,f,u,y,_,g,m,h){const n=f.append("switch"),l=n.append("foreignObject").attr("x",u).attr("y",y).attr("width",_).attr("height",g).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");l.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(r),e(r,n,u,y,_,g,m,h),c(l,m)}i.__name(a,"byFo");function c(r,f){for(const u in f)u in f&&r.attr(u,f[u])}return i.__name(c,"_setTextAttrs"),function(r){return r.textPlacement==="fo"?a:r.textPlacement==="old"?t:e}})(),It=i.__name(function(t){t.append("defs").append("marker").attr("id","arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics"),B={drawRect:D,drawCircle:lt,drawSection:Et,drawText:ot,drawLabel:Ct,drawTask:Pt,drawBackgroundRect:At,initGraphics:It},Ft=i.__name(function(t){Object.keys(t).forEach(function(a){$[a]=t[a]})},"setConf"),C={},W=0;function ht(t){const e=i.getConfig2().journey,a=e.maxLabelWidth;W=0;let c=60;Object.keys(C).forEach(r=>{const f=C[r].color,u={cx:20,cy:c,r:7,fill:f,stroke:"#000",pos:C[r].position};B.drawCircle(t,u);let y=t.append("text").attr("visibility","hidden").text(r);const _=y.node().getBoundingClientRect().width;y.remove();let g=[];if(_<=a)g=[r];else{const m=r.split(" ");let h="";y=t.append("text").attr("visibility","hidden"),m.forEach(n=>{const s=h?`${h} ${n}`:n;if(y.text(s),y.node().getBoundingClientRect().width>a){if(h&&g.push(h),h=n,y.text(n),y.node().getBoundingClientRect().width>a){let d="";for(const p of n)d+=p,y.text(d+"-"),y.node().getBoundingClientRect().width>a&&(g.push(d.slice(0,-1)+"-"),d=p);h=d}}else h=s}),h&&g.push(h),y.remove()}g.forEach((m,h)=>{const n={x:40,y:c+7+h*20,fill:"#666",text:m,textMargin:e.boxTextMargin??5},l=B.drawText(t,n).node().getBoundingClientRect().width;l>W&&l>e.leftMargin-l&&(W=l)}),c+=Math.max(20,g.length*20)})}i.__name(ht,"drawActorLegend");var $=i.getConfig2().journey,P=0,Rt=i.__name(function(t,e,a,c){const r=i.getConfig2(),f=r.journey.titleColor,u=r.journey.titleFontSize,y=r.journey.titleFontFamily,_=r.securityLevel;let g;_==="sandbox"&&(g=X.select("#i"+e));const m=_==="sandbox"?X.select(g.nodes()[0].contentDocument.body):X.select("body");S.init();const h=m.select("#"+e);B.initGraphics(h);const n=c.db.getTasks(),s=c.db.getDiagramTitle(),l=c.db.getActors();for(const E in C)delete C[E];let d=0;l.forEach(E=>{C[E]={color:$.actorColours[d%$.actorColours.length],position:d},d++}),ht(h),P=$.leftMargin+W,S.insert(0,0,P,Object.keys(C).length*50),Vt(h,n,0);const p=S.getBounds();s&&h.append("text").text(s).attr("x",P).attr("font-size",u).attr("font-weight","bold").attr("y",25).attr("fill",f).attr("font-family",y);const o=p.stopy-p.starty+2*$.diagramMarginY,b=P+p.stopx+2*$.diagramMarginX;i.configureSvgSize(h,o,b,$.useMaxWidth),h.append("line").attr("x1",P).attr("y1",$.height*4).attr("x2",b-P-4).attr("y2",$.height*4).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#arrowhead)");const x=s?70:0;h.attr("viewBox",`${p.startx} -25 ${b} ${o+x}`),h.attr("preserveAspectRatio","xMinYMin meet"),h.attr("height",o+x+25)},"draw"),S={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:i.__name(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},"init"),updateVal:i.__name(function(t,e,a,c){t[e]===void 0?t[e]=a:t[e]=c(a,t[e])},"updateVal"),updateBounds:i.__name(function(t,e,a,c){const r=i.getConfig2().journey,f=this;let u=0;function y(_){return i.__name(function(m){u++;const h=f.sequenceItems.length-u+1;f.updateVal(m,"starty",e-h*r.boxMargin,Math.min),f.updateVal(m,"stopy",c+h*r.boxMargin,Math.max),f.updateVal(S.data,"startx",t-h*r.boxMargin,Math.min),f.updateVal(S.data,"stopx",a+h*r.boxMargin,Math.max),_!=="activation"&&(f.updateVal(m,"startx",t-h*r.boxMargin,Math.min),f.updateVal(m,"stopx",a+h*r.boxMargin,Math.max),f.updateVal(S.data,"starty",e-h*r.boxMargin,Math.min),f.updateVal(S.data,"stopy",c+h*r.boxMargin,Math.max))},"updateItemBounds")}i.__name(y,"updateFn"),this.sequenceItems.forEach(y())},"updateBounds"),insert:i.__name(function(t,e,a,c){const r=Math.min(t,a),f=Math.max(t,a),u=Math.min(e,c),y=Math.max(e,c);this.updateVal(S.data,"startx",r,Math.min),this.updateVal(S.data,"starty",u,Math.min),this.updateVal(S.data,"stopx",f,Math.max),this.updateVal(S.data,"stopy",y,Math.max),this.updateBounds(r,u,f,y)},"insert"),bumpVerticalPos:i.__name(function(t){this.verticalPos=this.verticalPos+t,this.data.stopy=this.verticalPos},"bumpVerticalPos"),getVerticalPos:i.__name(function(){return this.verticalPos},"getVerticalPos"),getBounds:i.__name(function(){return this.data},"getBounds")},G=$.sectionFills,at=$.sectionColours,Vt=i.__name(function(t,e,a){const c=i.getConfig2().journey;let r="";const f=c.height*2+c.diagramMarginY,u=a+f;let y=0,_="#CCC",g="black",m=0;for(const[h,n]of e.entries()){if(r!==n.section){_=G[y%G.length],m=y%G.length,g=at[y%at.length];let l=0;const d=n.section;for(let o=h;o<e.length&&e[o].section==d;o++)l=l+1;const p={x:h*c.taskMargin+h*c.width+P,y:50,text:n.section,fill:_,num:m,colour:g,taskCount:l};B.drawSection(t,p,c),r=n.section,y++}const s=n.people.reduce((l,d)=>(C[d]&&(l[d]=C[d]),l),{});n.x=h*c.taskMargin+h*c.width+P,n.y=u,n.width=c.diagramMarginX,n.height=c.diagramMarginY,n.colour=g,n.fill=_,n.num=m,n.actors=s,B.drawTask(t,n,c),S.insert(n.x,n.y,n.x+n.width+c.taskMargin,450)}},"drawTasks"),st={setConf:Ft,draw:Rt},Lt={parser:_t,db:it,renderer:st,styles:$t,init:i.__name(t=>{st.setConf(t.journey),it.clear()},"init")};exports.diagram=Lt;
