<?php
/**
接收客户端提交的用户名，查询数据库返回形如下述的JSON字符串：
    [
      {"label":"1月", value:3000},
      {"label":"2月", value:4000},
      {"label":"3月", value:3500},
      {"label":"4月", value:8000}
    ]
**/
header('Content-Type: application/json');

$uname = $_REQUEST['uname'];

//模拟访问了数据库
$output = [];
$output[] = ['label'=>'1月','value'=>3000];
$output[] = ['label'=>'2月','value'=>2000];
$output[] = ['label'=>'3月','value'=>6000];
$output[] = ['label'=>'4月','value'=>8000];
$output[] = ['label'=>'5月','value'=>4000];
$output[] = ['label'=>'6月','value'=>1000];
$output[] = ['label'=>'7月','value'=>0];
$output[] = ['label'=>'8月','value'=>6000];
$output[] = ['label'=>'9月','value'=>7000];
$output[] = ['label'=>'10月','value'=>4500];
$output[] = ['label'=>'11月','value'=>5000];
$output[] = ['label'=>'12月','value'=>7500];

//把数据编码为JSON格式的字符串，输出给客户端
echo json_encode($output);