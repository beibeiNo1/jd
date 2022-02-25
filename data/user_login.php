<?php
/**验证客户端提交的用户名和密码是否正确，返回login-succ或者 login-err**/
header('Content-Type: text/plain');

//1 读取客户端提交的数据
$uname = $_REQUEST['uname'];
$upwd = $_REQUEST['upwd'];

//2 连接数据库
$conn = mysqli_connect('127.0.0.1','root',"",'jd',3306);

//3 执行SQL语句
mysqli_query($conn, "SET NAMES UTF8");
$sql = "SELECT user_id FROM jd_users WHERE user_name='$uname' AND user_pwd='$upwd'";
$result = mysqli_query($conn, $sql);

//var_dump($result);
//语法错误，$result: FALSE
//语法正确，SELECT： object#{ rows_count=>1...}
//          INSERT/DELETE/UPDATE:   TRUE

//4 查看执行结果
if($result===FALSE){
	echo 'sql-err';  //SQL语法错误！
}else {
	$row = mysqli_fetch_assoc($result);
	if($row===NULL){//结果集中不存在数据
		echo 'login-err';
	}else {	//结果集中存在数据
		echo 'login-succ';
	}
}



