"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const t=require("./mermaid.core-D-i83odx.cjs"),L=require("./chunk-4BX2VUAB-S_G4JsxO.cjs"),B=require("./mermaid-parser.core-4tqC6yMV.cjs");require("./index-o4zEo1SE.cjs");const N=require("./arc-CtQCztkn.cjs"),V=require("./ordinal-CagbB1m8.cjs");function U(e,r){return r<e?-1:r>e?1:r>=e?0:NaN}function j(e){return e}function X(){var e=j,r=U,f=null,S=t.constant(0),s=t.constant(t.tau),c=t.constant(0);function o(a){var i,u=(a=t.array(a)).length,d,y,h=0,g=new Array(u),l=new Array(u),v=+S.apply(this,arguments),A=Math.min(t.tau,Math.max(-t.tau,s.apply(this,arguments)-v)),m,w=Math.min(Math.abs(A)/u,c.apply(this,arguments)),_=w*(A<0?-1:1),p;for(i=0;i<u;++i)(p=l[g[i]=i]=+e(a[i],i,a))>0&&(h+=p);for(r!=null?g.sort(function(x,D){return r(l[x],l[D])}):f!=null&&g.sort(function(x,D){return f(a[x],a[D])}),i=0,y=h?(A-u*_)/h:0;i<u;++i,v=m)d=g[i],p=l[d],m=v+(p>0?p*y:0)+_,l[d]={data:a[d],index:i,value:p,startAngle:v,endAngle:m,padAngle:w};return l}return o.value=function(a){return arguments.length?(e=typeof a=="function"?a:t.constant(+a),o):e},o.sortValues=function(a){return arguments.length?(r=a,f=null,o):r},o.sort=function(a){return arguments.length?(f=a,r=null,o):f},o.startAngle=function(a){return arguments.length?(S=typeof a=="function"?a:t.constant(+a),o):S},o.endAngle=function(a){return arguments.length?(s=typeof a=="function"?a:t.constant(+a),o):s},o.padAngle=function(a){return arguments.length?(c=typeof a=="function"?a:t.constant(+a),o):c},o}var Z=t.defaultConfig_default.pie,E={sections:new Map,showData:!1},T=E.sections,M=E.showData,H=structuredClone(Z),J=t.__name(()=>structuredClone(H),"getConfig"),K=t.__name(()=>{T=new Map,M=E.showData,t.clear()},"clear"),Q=t.__name(({label:e,value:r})=>{if(r<0)throw new Error(`"${e}" has invalid value: ${r}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,r),t.log.debug(`added new section: ${e}, with value: ${r}`))},"addSection"),Y=t.__name(()=>T,"getSections"),ee=t.__name(e=>{M=e},"setShowData"),te=t.__name(()=>M,"getShowData"),O={getConfig:J,clear:K,setDiagramTitle:t.setDiagramTitle,getDiagramTitle:t.getDiagramTitle,setAccTitle:t.setAccTitle,getAccTitle:t.getAccTitle,setAccDescription:t.setAccDescription,getAccDescription:t.getAccDescription,addSection:Q,getSections:Y,setShowData:ee,getShowData:te},ae=t.__name((e,r)=>{L.populateCommonDb(e,r),r.setShowData(e.showData),e.sections.map(r.addSection)},"populateDb"),re={parse:t.__name(async e=>{const r=await B.parse("pie",e);t.log.debug(r),ae(r,O)},"parse")},ne=t.__name(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),ie=ne,le=t.__name(e=>{const r=[...e.values()].reduce((s,c)=>s+c,0),f=[...e.entries()].map(([s,c])=>({label:s,value:c})).filter(s=>s.value/r*100>=1).sort((s,c)=>c.value-s.value);return X().value(s=>s.value)(f)},"createPieArcs"),se=t.__name((e,r,f,S)=>{t.log.debug(`rendering pie chart
`+e);const s=S.db,c=t.getConfig2(),o=t.cleanAndMerge(s.getConfig(),c.pie),a=40,i=18,u=4,d=450,y=d,h=t.selectSvgElement(r),g=h.append("g");g.attr("transform","translate("+y/2+","+d/2+")");const{themeVariables:l}=c;let[v]=t.parseFontSize(l.pieOuterStrokeWidth);v??(v=2);const A=o.textPosition,m=Math.min(y,d)/2-a,w=N.d3arc().innerRadius(0).outerRadius(m),_=N.d3arc().innerRadius(m*A).outerRadius(m*A);g.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const p=s.getSections(),x=le(p),D=[l.pie1,l.pie2,l.pie3,l.pie4,l.pie5,l.pie6,l.pie7,l.pie8,l.pie9,l.pie10,l.pie11,l.pie12];let C=0;p.forEach(n=>{C+=n});const z=x.filter(n=>(n.data.value/C*100).toFixed(0)!=="0"),$=V.ordinal(D);g.selectAll("mySlices").data(z).enter().append("path").attr("d",w).attr("fill",n=>$(n.data.label)).attr("class","pieCircle"),g.selectAll("mySlices").data(z).enter().append("text").text(n=>(n.data.value/C*100).toFixed(0)+"%").attr("transform",n=>"translate("+_.centroid(n)+")").style("text-anchor","middle").attr("class","slice"),g.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const F=[...p.entries()].map(([n,k])=>({label:n,value:k})),b=g.selectAll(".legend").data(F).enter().append("g").attr("class","legend").attr("transform",(n,k)=>{const G=i+u,R=G*F.length/2,q=12*i,I=k*G-R;return"translate("+q+","+I+")"});b.append("rect").attr("width",i).attr("height",i).style("fill",n=>$(n.label)).style("stroke",n=>$(n.label)),b.append("text").attr("x",i+u).attr("y",i-u).text(n=>s.getShowData()?`${n.label} [${n.value}]`:n.label);const W=Math.max(...b.selectAll("text").nodes().map(n=>(n==null?void 0:n.getBoundingClientRect().width)??0)),P=y+a+i+u+W;h.attr("viewBox",`0 0 ${P} ${d}`),t.configureSvgSize(h,d,P,o.useMaxWidth)},"draw"),oe={draw:se},ce={parser:re,db:O,renderer:oe,styles:ie};exports.diagram=ce;
