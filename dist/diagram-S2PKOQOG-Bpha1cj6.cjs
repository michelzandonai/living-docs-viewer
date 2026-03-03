"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const a=require("./mermaid.core-DReK6Gz0.cjs"),x=require("./chunk-4BX2VUAB-D1h1wAkk.cjs"),B=require("./mermaid-parser.core-zwPePCDS.cjs");var $=a.defaultConfig_default.packet,b,m=(b=class{constructor(){this.packet=[],this.setAccTitle=a.setAccTitle,this.getAccTitle=a.getAccTitle,this.setDiagramTitle=a.setDiagramTitle,this.getDiagramTitle=a.getDiagramTitle,this.getAccDescription=a.getAccDescription,this.setAccDescription=a.setAccDescription}getConfig(){const t=a.cleanAndMerge({...$,...a.getConfig().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){a.clear(),this.packet=[]}},a.__name(b,"PacketDB"),b),C=1e4,_=a.__name((e,t)=>{x.populateCommonDb(e,t);let i=-1,o=[],l=1;const{bitsPerRow:c}=t.getConfig();for(let{start:r,end:n,bits:p,label:d}of e.blocks){if(r!==void 0&&n!==void 0&&n<r)throw new Error(`Packet block ${r} - ${n} is invalid. End must be greater than start.`);if(r??(r=i+1),r!==i+1)throw new Error(`Packet block ${r} - ${n??r} is not contiguous. It should start from ${i+1}.`);if(p===0)throw new Error(`Packet block ${r} is invalid. Cannot have a zero bit field.`);for(n??(n=r+(p??1)-1),p??(p=n-r+1),i=n,a.log.debug(`Packet block ${r} - ${i} with label ${d}`);o.length<=c+1&&t.getPacket().length<C;){const[g,s]=S({start:r,end:n,bits:p,label:d},l,c);if(o.push(g),g.end+1===l*c&&(t.pushWord(o),o=[],l++),!s)break;({start:r,end:n,bits:p,label:d}=s)}}t.pushWord(o)},"populate"),S=a.__name((e,t,i)=>{if(e.start===void 0)throw new Error("start should have been set during first phase");if(e.end===void 0)throw new Error("end should have been set during first phase");if(e.start>e.end)throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*i)return[e,void 0];const o=t*i-1,l=t*i;return[{start:e.start,end:o,label:e.label,bits:o-e.start},{start:l,end:e.end,label:e.label,bits:e.end-l}]},"getNextFittingBlock"),w={parser:{yy:void 0},parse:a.__name(async e=>{var o;const t=await B.parse("packet",e),i=(o=w.parser)==null?void 0:o.yy;if(!(i instanceof m))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");a.log.debug(t),_(t,i)},"parse")},P=a.__name((e,t,i,o)=>{const l=o.db,c=l.getConfig(),{rowHeight:r,paddingY:n,bitWidth:p,bitsPerRow:d}=c,g=l.getPacket(),s=l.getDiagramTitle(),k=r+n,h=k*(g.length+1)-(s?0:r),f=p*d+2,u=a.selectSvgElement(t);u.attr("viewbox",`0 0 ${f} ${h}`),a.configureSvgSize(u,h,f,c.useMaxWidth);for(const[v,y]of g.entries())T(u,y,v,c);u.append("text").text(s).attr("x",f/2).attr("y",h-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),T=a.__name((e,t,i,{rowHeight:o,paddingX:l,paddingY:c,bitWidth:r,bitsPerRow:n,showBits:p})=>{const d=e.append("g"),g=i*(o+c)+c;for(const s of t){const k=s.start%n*r+1,h=(s.end-s.start+1)*r-l;if(d.append("rect").attr("x",k).attr("y",g).attr("width",h).attr("height",o).attr("class","packetBlock"),d.append("text").attr("x",k+h/2).attr("y",g+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(s.label),!p)continue;const f=s.end===s.start,u=g-2;d.append("text").attr("x",k+(f?h/2:0)).attr("y",u).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",f?"middle":"start").text(s.start),f||d.append("text").attr("x",k+h).attr("y",u).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(s.end)}},"drawWord"),D={draw:P},A={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},z=a.__name(({packet:e}={})=>{const t=a.cleanAndMerge(A,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},"styles"),E={parser:w,get db(){return new m},renderer:D,styles:z};exports.diagram=E;
