<?php
/**返回当前登录的用户的订单信息，返回数据形如：
{
	"record_count": 22,	//总记录数
	"page_size": 5,		//页面大小
	"page_count": 5,	//总页数
	"cur_page": 5,		//当前页号
	"data": [ {},{},{},{},{} ]//当前页中的数据
}
**/
header('Content-Type: application/json');
$pager = [
	'record_count'=>0,
	'page_size'=>5,
	'page_count'=>0,
	'cur_page'=>intval($_REQUEST['pno']),
	'data'=>NULL
];

//1 接收客户端提交的用户名
$uname = $_REQUEST['uname'];

//2 连接数据库
$conn = mysqli_connect('127.0.0.1','root',"",'jd',3306);

//3 提交SQL SELECT指令
mysqli_query($conn, "SET NAMES UTF8");
///获取符合条件的总记录数
$sql = "SELECT COUNT(order_id) FROM jd_orders WHERE user_name='$uname'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
$pager['record_count'] = intval(  $row['COUNT(order_id)']  ); //把string解析为int
///计算总页数 = 总记录数/页面大小
$pager['page_count'] = ceil( $pager['record_count']/$pager['page_size'] );

///获取当前页号对应的记录
$start = ($pager['cur_page']-1)*$pager['page_size'];
$count = $pager['page_size']; //想读取的记录数量
$sql = "SELECT * FROM jd_orders WHERE user_name='$uname' LIMIT  $start, $count";
$result = mysqli_query($conn, $sql);

if($result===FALSE){
	echo '{"msg":"SQL ERR!"}';
	return;
}
$output = [];  //用于保存所有订单的大数组
while(($order=mysqli_fetch_assoc($result))!==NULL){
	///////获取订单的产品列表///////////
	$order['productList'] = []; //产品列表
	$oid = $order['order_id']; //根据订单编号获取其所购买的所有产品的信息
	$sql = "SELECT * FROM jd_products WHERE product_id IN ( SELECT product_id FROM jd_order_product_detail WHERE order_id=$oid )";
	$productResult = mysqli_query($conn, $sql);
	while(($p=mysqli_fetch_assoc($productResult))!==NULL){
		$order['productList'][] = $p; //把查询到的产品保存入当前订单的产品列表
	}
	////////////////////////////////////
	$output[] = $order;
}

//4 把PHP数组编码为JSON字符串，输出给客户端
$pager['data'] = $output;
echo json_encode($pager);

