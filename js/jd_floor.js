function getElementTop(element){
	var top=element.offsetTop;
	while((element=element.offsetParent)!=null){
		top+=element.offsetTop;
	}
	return top;
}
var floor={
	MINTOP:150,
	MAXTOP:0,
	init:function(){
		var me=this;
		me.MAXTOP=window.innerHeight-me.MINTOP;
		document.onscroll=function(){
			var spans=$(".floor>header>span:first-child");
			for(var i=0;i<spans.length;i++){
				var top=getElementTop(spans[i]);
				var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
				var innerTop=top-scrollTop;
				var as=$("#elevator li[data-idx='"+parseInt(spans[i].innerHTML)+"']>a");
				if(innerTop>me.MINTOP&&innerTop<me.MAXTOP){
					spans[i].className="hover";
					as[0].style.display="none";
					as[1].style.display="block";
				}else{
					spans[i].className="";	
					as[0].style.display="block";
					as[1].style.display="none";
				}
				if(i==0){
					if(top<scrollTop+me.MAXTOP){
						$("#elevator")[0].style.display="block";
					}else{
						$("#elevator")[0].style.display="none";
					}
				}
			}
		}
		$("#elevator>ul")[0].onmouseover=function(e){
			e=window.event||e;
			var target=e.srcElement||e.target;
			target.nodeName=="A"&&(target=target.parentNode);
			if(target.nodeName=="LI"){
				var as=target.getElementsByTagName("a");
				as[0].style.display="none";
				as[1].style.display="block";
			}
		}
		$("#elevator>ul")[0].onmouseout=function(e){
			e=window.event||e;
			var target=e.srcElement||e.target;
			if(target.nodeName=="A"){
				target=target.parentNode;
			}
			if(target.nodeName=="LI"){
				var span=$("#f"+target.dataset.idx+">header>span")[0];
				if(span.className!="hover"){
					var as=target.getElementsByTagName("a");
					as[0].style.display="block";
					as[1].style.display="none";
				}
			}
		}
		$("#elevator>ul")[0].onclick=function(){
			e=window.event||e;
			var target=e.srcElement||e.target;
			target.nodeName=="A"&&(target=target.parentNode);
			if(target.nodeName=="LI"){
				var span=$("#f"+target.dataset.idx+">header>span")[0];
				var top=getElementTop(span);
				scrollTo(0,top-me.MINTOP-1);
			}
		}
	}
}
window.addEventListener(
	"load",floor.init.bind(floor),false
)


















