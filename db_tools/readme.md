# node.js 操作 postgresql , mysql ,并用来批量造数据


### 最近做项目需要批量创建大数据，本来是用java mybatis 造数据，无奈复杂度太高，无法满足方便的创造海量随机数据；
### 而且面对关联数据（A表记录，某字段是B表的某个字段比如主键 ） ，构造数据不方便，不精确构造数据，可能对数据没有意义；

### nodejs入门：

#### 环境
#### 教程

---- 网址：



### 没有原材料（数据库表） 可以使用 main 文件夹下的 sql 进行测试

## mysql 
### 程序入口：


```

	测试类(程序):
	main文件夹中： mysql_test.js
	运行直接 node mysql_test.js 即可运行 脚本代码

	封装后的mysql工具类
	dbTools 文件夹中：app-mysql.js
	方法如下：

	// 初始化连接池 同时配置数据库属性，连接池属性，具体参数还可以找到mysql 库源码中： ConnectionConfig.js 查看
	initMysqlConnectPool();
	


	/*
	 sql 中 占位符用的是 ?  (postgresql 中是 $1 $2 从1 开始的占位符数组是0  ) ，参数用数组
	 如
	  sql : select * from table1 where field1 = ?
	  paramsArray : [ 'field1_value' ]

	  */
	query();

	

	/*
		查询方法：
		例子
		mysql.select('goods' ,
	        // select 后 选择取出的字段名 null 默认 * 全部取出 
	        [
	            'goods_name',
	            'goods_id',
	            'goods_create_user'
	        ] , 
	        whereParams , null , null  , function(err, result){

	                console.log('result : '+ JSON.stringify(result));

        });

	*/
	select();

	/*
	还有就是插入
	更新方法
	具体事例 mysql_test.js 都有
	*/
	insert();
	insertByBatch();
	update();




	/*

		批量构造数据函数
	  count : 循环几次
	  valueCount : 一共拼接几个 value 体 
	  即：
	          拼接成sql :
	        sql :  INSERT INTO goods   (  `goods_id` , `goods_name`  )   VALUES  
	        (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  )

	  paramFactoryFun : 构造参数对象的函数，返回Object对象
	  tableName : 表名


	  插入总条数： count * valueCount
	  注意因为数据库是异步操作，设置太大可能会出现并发争夺问题 (也与连接池的参数问题有关)
	  
	*/
	insertByBatchCustome();



```



## postgresql 

### 程序入口：

```


	测试类(程序):
	main文件夹中： postgresql_test.js
	运行直接 node postgresql_test.js 即可运行 脚本代码

	封装后的 postgresql 工具类
	dbTools 文件夹中：postgresql.js
	方法如下：

	// 初始化连接池 同时配置数据库属性，连接池属性，具体参数还可以找到 pg 库源码中进行查看
	initPgConnectPool();
	


	/*
	 sql 中 占位符用的是 $1 $2 ....从1开始 ，但是数据参数还是从0取的  (mysql 中是 ?  从1 开始的占位符数组是0  ) ，参数用数组
	 如
	  sql : select * from table1 where field1 = $1 and field2 = $2
	  paramsArray : [ 'field1_value'  , 'field2_value']

	  */
	query();

	

	/*
		查询方法：
		例子
		postgresql.select('goods' ,
	        // select 后 选择取出的字段名 null 默认 * 全部取出 
	        [
	            'goods_name',
	            'goods_id',
	            'goods_create_user'
	        ] , 
	        whereParams , null , null  , function(err, result){

	                console.log('result : '+ JSON.stringify(result));

        });

	*/
	select();

	/*
	还有就是插入
	更新方法
	具体事例 postgresql_test.js 都有
	*/
	insert();
	insertByBatch();
	update();




	/*

		批量构造数据函数
	  count : 循环几次
	  valueCount : 一共拼接几个 value 体 
	  即：
	          拼接成sql :
	        sql :  INSERT INTO goods   (  `goods_id` , `goods_name`  )   VALUES  
	        (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  )

	  paramFactoryFun : 构造参数对象的函数，返回Object对象
	  tableName : 表名


	  插入总条数： count * valueCount
	  注意因为数据库是异步操作，设置太大可能会出现并发争夺问题 (也与连接池的参数问题有关)
	  
	*/
	insertByBatchCustome();



```





## 造数据专用随机数据工具

```
dbTools 文件夹中：randomTools.js ;



// 加载随机函数库
var randomTools = require('../dbTools/randomTools.js');
//获取随机数字和时间，也可以自己拓展；
randomTools.getRandomBetweenNumbers(0,1);
randomTools.getRandomTime();



```