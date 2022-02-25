/**1.异步请求页头和页尾**/
$('#header').load('header.php');
$('#footer').load('footer.php');


/**2.为“提交登录信息”按钮绑定监听函数**/
$('#login-form [type="button"]').click(function(){
  var result = $('#login-form').serialize( );
  //console.log(result);//k=v&k=v&...表单序列化
  $.post('data/user_login.php',result,function(txt){
    if(txt==='login-succ'){
      //alert('登录成功');
      $('.modal').fadeOut();  //去除遮罩层
      var uname = $('[name="uname"]').val();
      $('#login-msg').html('欢迎回来：'+uname);
      loadOrders(uname,1); //异步请求当前登录用户的订单
      drawBuyStat(uname); //异步请求消费统计信息，绘制统计图表
      drawBuyStatCJ(uname); //异步请求消费统计信息，绘制统计图表
      drawLuckLottery(); //绘制幸运抽奖内容
    }else if(txt==='login-err'){
      alert('登录失败');
    }
  });
});


/**3.为附加导航中的导航项添加事件监听**/
$('.affix ul li a').click(function(event){
  event.preventDefault();  //阻止超链接的跳转
  $(this).parent().addClass('active').siblings('.active').removeClass('active'); //控制li的active
  var id = $(this).attr('href');
  $(id).addClass('active').siblings('.active').removeClass('active');  //控制右侧的容器div的active 
});

/**4.用户登录完成后，异步请求该用户的订单**/
function loadOrders(uname,pno){
  //$.get   $.getJSON   $.ajax
  $.get('data/my-order.php',{uname:uname,pno:pno},function(pager){
    console.log('开始处理订单信息....');
    console.log(pager);
    $('#order-table tbody').empty();//清空已有内容
    //每个order对象生成两个TR标签
    $.each(pager.data, function(i,order){
      var str = '<tr>'
              +'<td colspan="6">'
              +'  订单编号：'+order.order_num
              +'  <a href="#">'+order.shop_name+'</a>'
              +'</td>'
            +'</tr>'
            +'<tr>'
              +'<td>';
    //把订单中的每个商品生成一个<a><img></a>元素
      $.each(order.productList, function(j,p){
        str += '<a href="#"><img src="'+p.product_img+'" title="'+p.product_name+'"></a>';
      })   
      str +=   '</td>'
              +'<td>'
                +order.user_name
              +'</td>'
              +'<td>'
                +'￥'+order.price+'<br>'+order.payment_mode
              +'</td>'
              +'<td>'
                +order.submit_time.replace('T','<br>')
              +'</td>'
              +'<td>'
                +order.order_state
              +'</td>'
              +'<td>'
                +'<a href="#">查看</a><br>'
                +'<a href="#">确认收货</a><br>'
                +'<a href="#">取消订单</a>'
              +'</td>'
            +'</tr>';
      $('#order-table tbody').append(str);
    });
    //////////创建动态的分页条//////////
    $('.pager').empty();
    //当前-2页
    $('.pager').append('<li><a href="#">'+(pager.cur_page-2)+'</a></li>');
    //当前-1页
    $('.pager').append('<li><a href="#">'+(pager.cur_page-1)+'</a></li>');
    
    //当前页
    $('.pager').append('<li class="active"><a href="#">'+pager.cur_page+'</a></li>');
    
    //当前+1页
    $('.pager').append('<li><a href="javascript: loadOrders(\'强东\', '+(pager.cur_page+1)+')">'+(pager.cur_page+1)+'</a></li>');  
    //<a href="javascript:loadOrders('强东',2)">
    //当前+2页
    $('.pager').append('<li><a href="#">'+(pager.cur_page+2)+'</a></li>');
  });
}

/**5.用户登录成功后，异步请求消费统计数据，绘制统计图**/
function drawBuyStat(uname){
  //服务器端返回的JSON形如：
  /**
    [
      {"label":"1月", value:3000},
      {"label":"2月", value:4000},
      {"label":"3月", value:3500},
      {"label":"4月", value:8000}
    ]
  **/
  //jQuery: load() $.get  $.post  $.getJSON $.getScript  $.ajax
  $.get('data/buy-stat.php',{uname:uname}, function(data){
    //console.log('开始处理服务器端返回消费统计数据');
    //console.log(data);
    var ctx = $('#canvasBuyStat')[0].getContext('2d');

    /////绘制统计图需要的变量/////
    var dataCount = data.length;  //数据的数量
    var dataMax = getMax();       //金额中的最大值
    var yAxisDataCount = 6;       //Y轴上坐标点的数量
    var xAxisDataCount = dataCount; //X轴上坐标点的数量
    var padding = 50;   //绘图内容距画布边界的距离
    var canvasWidth = canvasBuyStat.width;
    var canvasHeight = canvasBuyStat.height;
    var origin = {x:padding, y:canvasHeight-padding};  //坐标轴的原点
    var xAxisEnd = {x:canvasWidth-padding, y:canvasHeight-padding}; //X轴端点坐标
    var yAxisEnd = {x:padding, y:padding}; //Y轴端点坐标
    var xAxisSpacing = (canvasWidth-2*padding-30)/dataCount;//X轴上的坐标点间距
    var yAxisSpacing = (canvasHeight-2*padding-30)/yAxisDataCount;//Y轴上的坐标点间距
    var fontSize = 16;   //字体大小
    ctx.font = fontSize+'px SimHei';
    //debugger;
    function getMax(){
      var m = data[0].value;
      for(var i=1; i<dataCount; i++){
        if(data[i].value>m) m = data[i].value;
      }
      return m;
    }
    //////////////////////////////


    //绘制X轴及坐标点
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y); 
    ctx.lineTo(xAxisEnd.x, xAxisEnd.y);
    ctx.lineTo(xAxisEnd.x-10, xAxisEnd.y-10);
    ctx.moveTo(xAxisEnd.x, xAxisEnd.y);
    ctx.lineTo(xAxisEnd.x-10, xAxisEnd.y+10);
    for(var i=0; i<dataCount; i++){ //绘制X轴上的坐标点
      var x = origin.x + (i+1)*xAxisSpacing; //坐标点的下端点的X  
      var y = origin.y; //坐标点的下端点的Y
      ctx.moveTo(x,y);
      ctx.lineTo(x,y-5); //坐标点的上端点
      var txt = data[i].label;
      var txtWidth = ctx.measureText(txt).width;
      ctx.fillText(txt, x-txtWidth/2, y+fontSize);
    }
    //绘制统计折线——不能与上一个for循环合并
    for(var i=0; i<dataCount; i++){ 
      var x = origin.x + (i+1)*xAxisSpacing; //坐标点的下端点的X  
      var y = origin.y; //坐标点的下端点的Y
  
      ////绘制折线
      var dataX = x; //数据点的X
      var dataHeight = data[i].value*(canvasHeight-2*padding-30)/dataMax;   //数据点的高度
      var dataY = y-dataHeight; //数据点的Y
      if(i===0){  //移动到第0个点
        ctx.moveTo(dataX,dataY); 
      }else { //到其它点画线
        ctx.lineTo(dataX,dataY);
      }
      ////标明金额
      var txt = data[i].value;
      ctx.fillText(txt, dataX, dataY);
      ////绘制柱状图
      ctx.fillRect(dataX,dataY, xAxisSpacing/2,dataHeight);
    }

    //绘制Y轴及坐标点
    ctx.moveTo(origin.x, origin.y); 
    ctx.lineTo(yAxisEnd.x, yAxisEnd.y);
    ctx.lineTo(yAxisEnd.x-10, yAxisEnd.y+10);
    ctx.moveTo(yAxisEnd.x, yAxisEnd.y);
    ctx.lineTo(yAxisEnd.x+10, yAxisEnd.y+10);
    var yValueSpacing = dataMax/yAxisDataCount; //Y轴两个坐标点值的距离
    yValueSpacing = parseInt(yValueSpacing);
    for(var i=0; i<=yAxisDataCount; i++){ //Y轴上的坐标点
      var x = origin.x;  //Y轴坐标点的左端点X
      var y = origin.y-i*yAxisSpacing;
      ctx.moveTo(x, y);
      ctx.lineTo(x+5, y);//Y轴坐标点的右端点
      var txt = i*yValueSpacing;
      if(i===yAxisDataCount){
        txt = dataMax; //最顶的坐标点的数值
      }
      var txtWidth = ctx.measureText(txt).width;
      ctx.fillText(txt,x-txtWidth, y+fontSize/2); //Y轴坐标点的文字
    }


    ctx.stroke(); //对X轴/Y轴及坐标点描边
  });
}

function drawBuyStatCJ(uname){
  $.get('data/buy-stat.php',{uname:uname},function(data){
    //console.log('开始处理消费统计记录(ChartJS)');
    //console.log(data);
    //把服务器端返回的数据转为客户端能够使用的数据格式——格式转换
    var labels = [];
    var values = [];
    for(var i=0; i<data.length; i++){
      labels.push( data[i].label );
      values.push( data[i].value );
    }
    //使用Chart.js绘制图表
    new Chart(canvasBuyStatCJ, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '我的消费统计',
          data: values
        }] 
      }
    });
  })
}

/**6.用户登录成功后，异步请求消费抽奖信息，绘制抽奖图**/
function drawLuckLottery(){
  //圆盘图片
  var pan = new Image();
  pan.src='img/pan.png';
  var panLoaded = false;
  pan.onload = function(){
    panLoaded = true;
    if(pinLoaded){
      draw();
    }
  }
  //指针图片
  var pin = new Image();
  pin.src='img/pin.png';
  var pinLoaded = false;
  pin.onload = function(){
    pinLoaded = true;
    if(panLoaded){
      draw();
    }
  }

  function draw(){
    var ctx = canvasLuckLottery.getContext('2d');
    ctx.drawImage(pan, 0, 0);
    ctx.drawImage(pin, canvasLuckLottery.width/2-pin.width/2, canvasLuckLottery.height/2-pin.height/2);
    //点击“开始抽奖”按钮
    $('#btLottery').one('click', function(){
      //修改画布的坐标轴原点到画布中央
      ctx.translate(canvasLuckLottery.width/2,canvasLuckLottery.height/2);

      var degree = 0;   //转过的角度
      var duration = Math.random()*4000+5000; //允许的转动总时长，5000~9000ms间的随机数
      var last = 0; //当前已经连续旋转的时长
      
      var timer = setInterval(function(){
        //旋转degree度，绘制一个旋转了的圆盘
        ctx.rotate(degree*Math.PI/180);
        ctx.drawImage(pan, -pan.width/2, -pan.height/2);
        //逆向旋转degree度——相当于旋转了0度,绘制指针，一直指向正上方
        ctx.rotate(-degree*Math.PI/180)
        ctx.drawImage(pin, -pin.width/2,-pin.height/2);
        ////////////////////////////////////
        degree += 6;
        degree %= 360;  //370度与10度的效果一样
        last += 20;   //每次旋转都持续了20ms
        if(last>=duration){ //旋转持续时长已经达到了允许的最长时间
          clearInterval(timer);
        }
      },20);
    })
  }
}