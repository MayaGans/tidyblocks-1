(this["webpackJsonpreact-skeleton"]=this["webpackJsonpreact-skeleton"]||[]).push([[0],{59:function(e,t,a){e.exports=a(76)},64:function(e,t,a){},74:function(e,t,a){},76:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(7),c=a.n(r),o=(a(64),a(11)),i=a(10),u=a(13),s=a(14),m=a(18),d=a(15),p=a(42),b=a.n(p),E=a(17),h=a(111),f=a(78),j=function(e){function t(e){return Object(o.a)(this,t),Object(u.a)(this,Object(s.a)(t).call(this,e))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",null,this.props.xml))}}]),t}(l.a.Component),v=function(e){function t(e){return Object(o.a)(this,t),Object(u.a)(this,Object(s.a)(t).call(this,e))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",null,l.a.createElement("pre",null,this.props.code)))}}]),t}(l.a.Component),O=function(e){function t(e){return Object(o.a)(this,t),Object(u.a)(this,Object(s.a)(t).call(this,e))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",null,this.props.plot))}}]),t}(l.a.Component),k=function(e){function t(e){return Object(o.a)(this,t),Object(u.a)(this,Object(s.a)(t).call(this,e))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",null,l.a.createElement("pre",null,this.props.error)))}}]),t}(l.a.Component),g=function(){return l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Name"),l.a.createElement("th",null,"Job")))},y=function(e){var t=e.dataFrame.map((function(e,t){return l.a.createElement("tr",{key:t},l.a.createElement("td",null,e.name),l.a.createElement("td",null,e.job))}));return l.a.createElement("tbody",null,t)},w=function(e){function t(){return Object(o.a)(this,t),Object(u.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props.dataFrame;return l.a.createElement("table",null,l.a.createElement(g,null),l.a.createElement(y,{dataFrame:e}))}}]),t}(n.Component),C=a(49),x=a(9),F=a(5),N=a(106),B=a(107),M=a(108),T=a(109),S=a(35),z=a(47),D=a.n(z),L=a(48),I=a.n(L),R=a(112),W=a(114),J=a(110),P=a(46),A=a.n(P),G=a(115),U=a(43),V=Object(F.a)({paper:{border:"1px solid #d3d4d5"}})((function(e){return l.a.createElement(R.a,Object.assign({elevation:0,getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"}},e))})),$=Object(F.a)((function(e){return{root:{"&:focus":{backgroundColor:e.palette.primary.main,"& .MuiListItemIcon-root, & .MuiListItemText-primary":{color:e.palette.common.white}}}}}))(W.a),q=Object(N.a)((function(e){var t;return{grow:{flexGrow:1},menuButton:{marginRight:e.spacing(1)},run:{justifyContent:"center"},title:(t={display:"none"},Object(x.a)(t,e.breakpoints.up("sm"),{display:"block"}),Object(x.a)(t,"paddingRight",10),t),inputRoot:{color:"inherit"},sectionDesktop:Object(x.a)({display:"none"},e.breakpoints.up("md"),{display:"flex"}),sectionMobile:Object(x.a)({display:"flex"},e.breakpoints.up("md"),{display:"none"}),button:{margin:e.spacing(1)},input:{display:"none"}}}));function H(){var e=q(),t=l.a.useState(null),a=Object(C.a)(t,2),n=a[0],r=a[1];return l.a.createElement("div",{className:e.grow},l.a.createElement(B.a,{position:"static",style:{background:"#1c313a"}},l.a.createElement(M.a,null,l.a.createElement("div",null,l.a.createElement(G.a,{disableFocusListener:!0,title:"Save"},l.a.createElement(T.a,{size:"medium",onClick:function(e){r(e.currentTarget)},color:"inherit"},l.a.createElement(A.a,null))),l.a.createElement(V,{id:"customized-menu",anchorEl:n,keepMounted:!0,open:Boolean(n),onClose:function(){r(null)}},l.a.createElement($,null,l.a.createElement("div",{onClick:function(){console.log("save xml")}},l.a.createElement(J.a,{primary:"Worskpace"}))),l.a.createElement($,null,l.a.createElement(U.CSVLink,{data:"this is a test"},l.a.createElement(J.a,{primary:"Data"}))),l.a.createElement($,null,l.a.createElement("div",{onClick:function(){console.log("save plot")}},l.a.createElement(J.a,{primary:"Plot"}))))),l.a.createElement("input",{accept:"text/*",className:e.input,id:"icon-button-file",type:"file"}),l.a.createElement("label",{htmlFor:"icon-button-file"},l.a.createElement(G.a,{disableFocusListener:!0,title:"Upload Workspace"},l.a.createElement(T.a,{color:"inherit",className:e.button,"aria-label":"upload picture",component:"span"},l.a.createElement(D.a,null)))),l.a.createElement(G.a,{disableFocusListener:!0,title:"Guide"},l.a.createElement(T.a,{color:"inherit",href:"./guide/"},l.a.createElement(I.a,null))),l.a.createElement("div",{className:e.grow}),l.a.createElement(S.a,{className:e.title,variant:"h6",noWrap:!0},"TidyBlocks"))))}a(74),a(75);var K=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(u.a)(this,Object(s.a)(t).call(this,e))).state={code:"This is where code will go",error:"This is where errors will go",plot:"This will display plots",xml:"This is where blocks go",table:[{name:"Charlie",job:"Janitor"},{name:"Mac",job:"Bouncer"},{name:"Dee",job:"Aspring actress"},{name:"Dennis",job:"Bartender"}]},a.runCode=a.runCode.bind(Object(m.a)(a)),a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"runCode",value:function(){this.setState({code:"new code",table:[{name:"Rick",job:"Scientist"},{name:"Morty",job:"Idiot"}],plot:"new plot",error:"new error",xml:"new xml"})}},{key:"render",value:function(){var e=this.props.classes;return l.a.createElement("div",null,l.a.createElement(H,{table:this.state.table}),l.a.createElement(b.a,{primaryMinSize:200,secondaryMinSize:0},l.a.createElement("div",{className:"leftPane"},l.a.createElement("h1",null,"Blockly"),l.a.createElement(j,{xml:this.state.xml}),l.a.createElement(h.a,{className:e.fab,onClick:this.runCode},"Run")),l.a.createElement("div",{className:"rightPane"},l.a.createElement(E.d,null,l.a.createElement(E.b,null,l.a.createElement(E.a,null,"Data"),l.a.createElement(E.a,null,"Plot"),l.a.createElement(E.a,null,"Text"),l.a.createElement(E.a,null,"Debug")),l.a.createElement(E.c,null,l.a.createElement(w,{dataFrame:this.state.table})),l.a.createElement(E.c,null,l.a.createElement(O,{plot:this.state.plot})),l.a.createElement(E.c,null,l.a.createElement(v,{code:this.state.code})),l.a.createElement(E.c,null,l.a.createElement(k,{error:this.state.error}))))))}}]),t}(l.a.Component),Q=Object(f.a)((function(e){return{fab:{backgroundColor:"#a7c0cd","&:hover":{backgroundColor:"#202F37"},color:"white",position:"absolute",right:10,top:10}}}))(K);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(Q,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[59,1,2]]]);
//# sourceMappingURL=main.de7944b8.chunk.js.map