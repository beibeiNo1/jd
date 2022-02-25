/*封装$*/
function $(selector){
	return document.querySelectorAll(selector);
}
/*广告图片数组*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];

var slider={
	LIWIDTH:0,//每个li的宽度
	DURATION:500,//动画开始到结束的持续时间
	STEPS:50,//动画要移动的总步数
	moved:0,
	INTERVAL:0,//每步的时间间隔：DURATION/STEPS
	WAIT:3000,//自动轮播之间等待的时间
	canAuto:true,
	init:function(){
		var me=this;//留住this
		//计算INTERVAL为DURATION/STEPS
		me.INTERVAL=me.DURATION/me.STEPS
		//找到id为slider的元素的width属性，保存在当前对象的LIWIDTH属性中
		me.LIWIDTH=parseFloat(getComputedStyle($("#slider")[0]).width);
		//修改id为imgs的ul的width属性为LIWIDTH*imgs数组的元素个数
		$("#imgs")[0].style.width=me.LIWIDTH*imgs.length+"px";
		
		//i从1开始，到<=imgs.length结束，每次+1，同时声明 idxs数组
		for(var i=1,idxs=[];i<=imgs.length;i++){
		//	向idxs中加入<li>i</li>
			idxs[i]="<li>"+i+"</li>";
		//(遍历结束)
		}
		//设置id为indexs的ul的内容为idxs无缝拼接的结果
		$("#indexs")[0].innerHTML=idxs.join("");
		//找到id为indexs下第一个li,设置class为hover
		$("#indexs>li:first-child")[0].className="hover";

		$("#indexs")[0].onmouseover=function(e){
			e=window.event||e;
			var target=e.srcElement||e.target;
			if(target.nodeName=="LI"&&target.className!="hover"){
				//找到indexs中.hover的li取出内容
				var oldi=$("#indexs>.hover")[0].innerHTML;
				me.move(target.innerHTML-oldi);
			}
		}
		
		$("#slider")[0].onmouseover=function(){
			me.canAuto=false;
		}
		$("#slider")[0].onmouseout=function(){
			me.canAuto=true;
		}

		me.updateView();
		me.autoMove();
	},
	updateView:function(){//按数组的内容更新ul
		//遍历imgs数组中的每个元素，同时声明数组lis
		for(var i=0,lis=[];i<imgs.length;i++){
		//	每遍历一个元素，就将当前元素拼接为:
		//	<li><img src="当前元素的img属性"/></li>
			lis[i]='<li><img src="'+imgs[i].img+'"></li>';
		//(遍历结束后)
		}
		//设置id为imgs的ul的内容为lis无缝拼接后的结果
		$("#imgs")[0].innerHTML=lis.join("");

		$("#indexs>.hover")[0].className="";
		
		$("#indexs>li")[imgs[0].i].className="hover";
	},
	move:function(n){//移动n个li，n新的li-旧的li
		//停止当前正在执行的动画
		clearTimeout(this.timer);
		this.timer=null;//设置timer为null
		if(n<0){//右移
			//先更新数组:删除数组末尾n个元素,补到开头
			imgs=imgs.splice(imgs.length-(-n),-n)
					 .concat(imgs);
			//更新页面
			this.updateView();
			//先设置id为imgs的ul的left为LIWIDTH*n
			$("#imgs")[0].style.left=this.LIWIDTH*n+"px";
		}
		//计算步长step: LIWIDTH*n/STEPS
		var step=this.LIWIDTH*n/this.STEPS;
		this.moveStep(n,step);
	},
	moveStep:function(n,step){//只负责移动1步
		//获得id为imgs的ul的left属性，保存在left中
		var left=parseFloat(
			getComputedStyle($("#imgs")[0]).left);
		//将id为imgs的ul的left属性设置为left-step
		$("#imgs")[0].style.left=left-step+"px";
		this.moved++;
		if(this.moved<=this.STEPS){//还可继续移动
		// 再次启动一次性定时器，传入moveStep方法作为参数
			this.timer=setTimeout(
				this.moveStep.bind(this,n,step),
				this.INTERVAL
			);
		}else{//否则(移动完毕)
			this.moved=0;//	moved重置为0;
			this.timer=null; //  timer清空为null
			//将id为imgs的ul的left设置为0
			$("#imgs")[0].style.left="";
			if(n>0){//	如果n>0,左移
		//		修改数组：删除开头的n个元素,拼接到结尾
				imgs=imgs.concat(imgs.splice(0,n));
		//      更新页面
				this.updateView();
			}
			//只要移动结束，就启动新的自动轮播
			this.autoMove();
		}
	},
	autoMove:function(){//启动自动轮播
		if(this.canAuto){
			this.timer=setTimeout(
				this.move.bind(this,1),
				this.WAIT
			);
		}else{
			clearTimeout(this.timer);
			this.timer=setTimeout(
				this.autoMove.bind(this),
				this.WAIT
			);
		}
	}

}
window.addEventListener(
	"load",slider.init.bind(slider),false
);