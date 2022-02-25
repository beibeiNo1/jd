function $(selector){
	return document.querySelectorAll(selector);
}
window.onload=function(){
	$(".service")[0].onmouseover=
	$(".app_jd")[0].onmouseover=function(){
		//找到当前li下的id属性以_items结尾的元素
		$("."+this.className+">[id$='_items']")[0].style.display="block";
		$("."+this.className+">a")[0].className="hover";
	}
	$(".service")[0].onmouseout=
	$(".app_jd")[0].onmouseout=function(){
		$("."+this.className+">[id$='_items']")[0].style.display="none";
		$("."+this.className+">a")[0].className="";
	}
	$("#category")[0].onmouseover=function(){
		$("#cate_box")[0].style.display="block";
	}
	$("#category")[0].onmouseout=function(){
		$("#cate_box")[0].style.display="none";
	}
	var lis=$("#cate_box>li");
	for(var i=0;i<lis.length;i++){
		lis[i].onmouseover=function(){
			//this --> li
			this.children[1].style.display="block";
			this.children[0].className="hover";
		}
		lis[i].onmouseout=function(){
			//this --> li
			this.children[1].style.display="none";
			this.children[0].className="";
		}
	}
	picture.init();
	//console.log(picture);

	$("#product_detail>.main_tabs")[0].onclick=function(e){
			e=window.event||e;//获得事件对象e
			var target=e.target||e.srcElement;//获得目标元素target
			var li=null;
			if(target.nodeName=="A"){
				li=target.parentNode;
			}else if(target.nodeName=="LI"){
				li=target;
			}
			if(li){
				//如果当前li的class不为current
				if(li.className!="current"){
				//	找到main_tabs下class为current的li,清除class属性
				//#product_detail>.main_tabs>li.current
					$(".main_tabs li[class*='current']")[0].className="";
				//	设置当前li的class为cuttenet
					li.className="current";
					var i=li.dataset.i;
					var divs=$("#product_detail>[id^='product_']");
					for(var n=0;n<divs.length;n++){
						divs[n].style.display="none";
					}
					if(i!==undefined){
						divs[i].style.display="block";
						
					}
				}
			}
		}
}
var picture={
	STARTLEFT:0,//ul初始left值
	LIWIDTH:0,//每个li的宽度
	count:0,//记录图片的总数
	moved:0,//记录图片左移的张数

	SMHEIGHT:0,//superMask的高
	SMWIDTH:0,//superMask的宽
	MHEIGHT:0,//mask的高
	MWIDTH:0,//mask的宽
	
	init:function(){
		var me=this;
		var lis=$("#icon_list>li");//找到ul下所有li
		me.count=lis.length;//初始化图片总数
		//
		me.LIWIDTH=//初始化每张图片宽度
			parseFloat(getComputedStyle(lis[0]).width);

		me.STARTLEFT=//初始化ul
			parseFloat(getComputedStyle($("#icon_list")[0]).left);
		//找到两个a，分别绑定move方法
		var btns=$("#preview>h1>a");
		btns[0].onclick=btns[1].onclick=function(){
			var btn=this;
			//如果当前按钮的class属性不包含disable
			if(btn.className.indexOf("disabled")==-1){
			//	将self的moved+=?如果class为forward，+1
				me.moved+=btn.className=="forward"?1:-1;
			//	设置id为icon_list的ul的left为：-(moved*LIWIDTH+STATTLEFT)
				$("#icon_list")[0].style.left=-(me.moved*me.LIWIDTH)+me.STARTLEFT+"px";
			}
			//检查两个按钮的可用状态
			var btns=$("#preview>h1>a");
			//如果me的moved为0
			if(me.moved==0){
			//	修改backward的class为:backward_disabled
				btns[0].className="backward_disabled";
			}//否则 如果count-moved等于5
			else if(me.count-me.moved==5){
			//	修改forward的class为forward_disabled
				btns[1].className="forward_disabled";
			}else{
			//否则
			//	修改backward的class为backward
				btns[0].className="backward";
			//	修改forward的class为forward
				btns[1].className="forward";
			}
		}
		$("#icon_list")[0].onmouseover=function(e){
			e=window.event||e;//获得事件对象e
			var target=e.target||e.srcElement;//获得目标元素target
			if(target.nodeName=="IMG"){//如果target是img元素
			//	取出target的src属性中的路径，保存到path中
				var path=target.src;
			//	找到path中最后一个.的位置i
				var i=path.lastIndexOf(".");
			//	使用.之前的子字符串，拼接-m，拼接.后剩余字符串，设置到id为mImg的元素的src属性
				$("#mImg")[0].src=path.slice(0,i)+"-m"+path.slice(i);
			}
		}
		$("#superMask")[0].onmouseover=
			$("#superMask")[0].onmouseout=function(){
			$("#mask")[0].style.display=$("#mask")[0].style.display!="block"?"block":"none";
			var path=$("#mImg")[0].src;

			var i=path.lastIndexOf(".");
			$("#largeDiv")[0].style.backgroundImage="url("+path.slice(0,i-1)+"l"+path.slice(i)+")";

			$("#largeDiv")[0].style.display=$("#mask")[0].style.display;
		}
		
		var style=getComputedStyle($("#superMask")[0]);
		this.SMHEIGHT=parseFloat(style.height);
		this.SMWIDTH=parseFloat(style.width);

		var style=getComputedStyle($("#mask")[0]);
		this.MHEIGHT=parseFloat(style.height);
		this.MWIDTH=parseFloat(style.width);
			
		$("#superMask")[0].onmousemove=function(e){
			//获得事件对象
			e=window.event||e;
			//获得鼠标位置x,y
			var x=e.offsetX||e.x;
			var y=e.offsetY||e.y;
			//计算mask的新left和top值,保存在mLeft和mTop中
			var mLeft=x-me.MWIDTH/2;
			var mTop=y-me.MHEIGHT/2;
			//如果mTop<0,就让mTop保持0
			mTop<0&&(mTop=0);
			//否则 如果mTop>SMHEIGHT-MHEIGHT,就让mTop保持SMHEIGHT-MHEIGHT
			mTop>me.SMHEIGHT-me.MHEIGHT&&(mTop=me.SMHEIGHT-me.MHEIGHT);
			//如果mLeft<0,就让mLeft保持0
			mLeft<0&&(mLeft=0);
			//否则 如果mLeft>SMWIDTH-MWIDTH,,就让mLeft保持SMWIDTH-MWIDTH
			mLeft>me.SMWIDTH-me.MWIDTH&&(mLeft=me.SMWIDTH-me.MWIDTH);
			//设置mask的top为mTop
			$("#mask")[0].style.top=mTop+"px";
			//设置mask的left为mLeft
			$("#mask")[0].style.left=mLeft+"px";

			$("#largeDiv")[0].style.backgroundPosition=-2*mLeft+"px "+(-2*mTop)+"px";
		}
	}
}