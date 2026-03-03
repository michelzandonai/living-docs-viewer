"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("./mermaid.core-DReK6Gz0.cjs"),L=require("./chunk-4BX2VUAB-D1h1wAkk.cjs"),O=require("./mermaid-parser.core-zwPePCDS.cjs");var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},y={axes:[],curves:[],options:h},p=structuredClone(y),S=s.defaultConfig_default.radar,k=s.__name(()=>s.cleanAndMerge({...S,...s.getConfig().radar}),"getConfig"),f=s.__name(()=>p.axes,"getAxes"),D=s.__name(()=>p.curves,"getCurves"),R=s.__name(()=>p.options,"getOptions"),I=s.__name(a=>{p.axes=a.map(e=>({name:e.name,label:e.label??e.name}))},"setAxes"),E=s.__name(a=>{p.curves=a.map(e=>({name:e.name,label:e.label??e.name,entries:F(e.entries)}))},"setCurves"),F=s.__name(a=>{if(a[0].axis==null)return a.map(t=>t.value);const e=f();if(e.length===0)throw new Error("Axes must be populated before curves for reference entries");return e.map(t=>{const r=a.find(n=>{var o;return((o=n.axis)==null?void 0:o.$refText)===t.name});if(r===void 0)throw new Error("Missing entry for axis "+t.label);return r.value})},"computeCurveEntries"),P=s.__name(a=>{var t,r,n,o,l;const e=a.reduce((i,c)=>(i[c.name]=c,i),{});p.options={showLegend:((t=e.showLegend)==null?void 0:t.value)??h.showLegend,ticks:((r=e.ticks)==null?void 0:r.value)??h.ticks,max:((n=e.max)==null?void 0:n.value)??h.max,min:((o=e.min)==null?void 0:o.value)??h.min,graticule:((l=e.graticule)==null?void 0:l.value)??h.graticule}},"setOptions"),G=s.__name(()=>{s.clear(),p=structuredClone(y)},"clear"),_={getAxes:f,getCurves:D,getOptions:R,setAxes:I,setCurves:E,setOptions:P,getConfig:k,clear:G,setAccTitle:s.setAccTitle,getAccTitle:s.getAccTitle,setDiagramTitle:s.setDiagramTitle,getDiagramTitle:s.getDiagramTitle,getAccDescription:s.getAccDescription,setAccDescription:s.setAccDescription},z=s.__name(a=>{L.populateCommonDb(a,_);const{axes:e,curves:t,options:r}=a;_.setAxes(e),_.setCurves(t),_.setOptions(r)},"populate"),B={parse:s.__name(async a=>{const e=await O.parse("radar",a);s.log.debug(e),z(e)},"parse")},V=s.__name((a,e,t,r)=>{const n=r.db,o=n.getAxes(),l=n.getCurves(),i=n.getOptions(),c=n.getConfig(),d=n.getDiagramTitle(),u=s.selectSvgElement(e),m=W(u,c),g=i.max??Math.max(...l.map($=>Math.max(...$.entries))),x=i.min,v=Math.min(c.width,c.height)/2;j(m,o,v,i.ticks,i.graticule),q(m,o,v,c),C(m,o,l,x,g,i.graticule,c),A(m,l,i.showLegend,c),m.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),W=s.__name((a,e)=>{const t=e.width+e.marginLeft+e.marginRight,r=e.height+e.marginTop+e.marginBottom,n={x:e.marginLeft+e.width/2,y:e.marginTop+e.height/2};return a.attr("viewbox",`0 0 ${t} ${r}`).attr("width",t).attr("height",r),a.append("g").attr("transform",`translate(${n.x}, ${n.y})`)},"drawFrame"),j=s.__name((a,e,t,r,n)=>{if(n==="circle")for(let o=0;o<r;o++){const l=t*(o+1)/r;a.append("circle").attr("r",l).attr("class","radarGraticule")}else if(n==="polygon"){const o=e.length;for(let l=0;l<r;l++){const i=t*(l+1)/r,c=e.map((d,u)=>{const m=2*u*Math.PI/o-Math.PI/2,g=i*Math.cos(m),x=i*Math.sin(m);return`${g},${x}`}).join(" ");a.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),q=s.__name((a,e,t,r)=>{const n=e.length;for(let o=0;o<n;o++){const l=e[o].label,i=2*o*Math.PI/n-Math.PI/2;a.append("line").attr("x1",0).attr("y1",0).attr("x2",t*r.axisScaleFactor*Math.cos(i)).attr("y2",t*r.axisScaleFactor*Math.sin(i)).attr("class","radarAxisLine"),a.append("text").text(l).attr("x",t*r.axisLabelFactor*Math.cos(i)).attr("y",t*r.axisLabelFactor*Math.sin(i)).attr("class","radarAxisLabel")}},"drawAxes");function C(a,e,t,r,n,o,l){const i=e.length,c=Math.min(l.width,l.height)/2;t.forEach((d,u)=>{if(d.entries.length!==i)return;const m=d.entries.map((g,x)=>{const v=2*Math.PI*x/i-Math.PI/2,$=w(g,r,n,c),M=$*Math.cos(v),T=$*Math.sin(v);return{x:M,y:T}});o==="circle"?a.append("path").attr("d",b(m,l.curveTension)).attr("class",`radarCurve-${u}`):o==="polygon"&&a.append("polygon").attr("points",m.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${u}`)})}s.__name(C,"drawCurves");function w(a,e,t,r){const n=Math.min(Math.max(a,e),t);return r*(n-e)/(t-e)}s.__name(w,"relativeRadius");function b(a,e){const t=a.length;let r=`M${a[0].x},${a[0].y}`;for(let n=0;n<t;n++){const o=a[(n-1+t)%t],l=a[n],i=a[(n+1)%t],c=a[(n+2)%t],d={x:l.x+(i.x-o.x)*e,y:l.y+(i.y-o.y)*e},u={x:i.x-(c.x-l.x)*e,y:i.y-(c.y-l.y)*e};r+=` C${d.x},${d.y} ${u.x},${u.y} ${i.x},${i.y}`}return`${r} Z`}s.__name(b,"closedRoundCurve");function A(a,e,t,r){if(!t)return;const n=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,l=20;e.forEach((i,c)=>{const d=a.append("g").attr("transform",`translate(${n}, ${o+c*l})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(i.label)})}s.__name(A,"drawLegend");var H={draw:V},U=s.__name((a,e)=>{let t="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){const n=a[`cScale${r}`];t+=`
		.radarCurve-${r} {
			color: ${n};
			fill: ${n};
			fill-opacity: ${e.curveOpacity};
			stroke: ${n};
			stroke-width: ${e.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${n};
			fill-opacity: ${e.curveOpacity};
			stroke: ${n};
		}
		`}return t},"genIndexStyles"),X=s.__name(a=>{const e=s.getThemeVariables3(),t=s.getConfig(),r=s.cleanAndMerge(e,t.themeVariables),n=s.cleanAndMerge(r.radar,a);return{themeVariables:r,radarOptions:n}},"buildRadarStyleOptions"),N=s.__name(({radar:a}={})=>{const{themeVariables:e,radarOptions:t}=X(a);return`
	.radarTitle {
		font-size: ${e.fontSize};
		color: ${e.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${t.axisColor};
		stroke-width: ${t.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${t.axisLabelFontSize}px;
		color: ${t.axisColor};
	}
	.radarGraticule {
		fill: ${t.graticuleColor};
		fill-opacity: ${t.graticuleOpacity};
		stroke: ${t.graticuleColor};
		stroke-width: ${t.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${t.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${U(e,t)}
	`},"styles"),Y={parser:B,db:_,renderer:H,styles:N};exports.diagram=Y;
