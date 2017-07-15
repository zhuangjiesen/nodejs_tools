// 随机函数库
var randomTools = require('../dbTools/randomTools.js');

console.log('hello_db_tools ....');



/*


插入语句

INSERT INTO `goods` 

(
goods_id  , 
goods_name  , 
goods_create_user   ,
goods_create_time  ,
goods_qty  ,
goods_is_remain
)

VALUES 
(
    '3c27e0d4-d5cb-46f4-8b45-89ab0d34faaa', 
    '抢购商品1',
     '', 
     '2017-02-02 00:09:52', 
     '50', 
     '0'
);



*/

var mysql = require('../dbTools/app-mysql');
//初始化连接池
mysql.initMysqlConnectPool();


function insert(){
    var paramsObject = {};
    paramsObject.goods_id = null;
    paramsObject.goods_name = '商品名称999';

    var insertParams = mysql.insert('goods' , paramsObject  , function(err, result){
        console.log(' insert : .......');
    });
}

// 单挑插入语句
// insert();


function insertByBatch(){
    var array = [];

    for (var i = 0 ; i < 4 ; i++) {
        var paramsObject = {};
        paramsObject.goods_id = null;
        paramsObject.goods_name = '商品名称';

        array.push(paramsObject);

    }

    mysql.insertByBatch( 'goods'  ,array  ,function(err, result){
        console.log(' insertByBatch : .......');
    });



}
// 批量添加事例；
/*
        拼接成sql :
        sql :  INSERT INTO goods   (  `goods_id` , `goods_name`  )   VALUES  
        (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  )

        插入多条语句

*/
// insertByBatch();


function updateTest(){
     var whereObject = {};
    whereObject.goods_id = 12;



    var updateParams = {};
    updateParams.goods_name = '2222';
    updateParams.goods_create_user = 'user.....';

    var insertParams = mysql.update('goods' , updateParams , whereObject , function(err, result){
        console.log(' update : .......');
    });




}
//update操作事例
// updateTest();



/*

有时候造数据需要进行关联，就可以查出其他表的数据进行随机，然后构造关联表数据，复杂程度也不高
*/ 
function selectTest(){
    var whereParams = {};
    whereParams.goods_id = 12;
    mysql.select('goods' ,

        /*  select 后 选择取出的字段名 null 默认 * 全部取出 */
        [
            'goods_name',
            'goods_id',
            'goods_create_user'
        ] , 
        whereParams , null , null  , function(err, result){

                console.log('result : '+ JSON.stringify(result));



        });
}

//查询测试
// selectTest();





//批量造数据
function insertBigDataByBatch (){

    mysql.insertByBatchCustome    (  100 /* 几次循环 */, 
        //构造数据对象的函数
        function(){


            return createNew_goods();
        } 
    ,'goods'  ,1000 /*  values () 后拼接的数组大小 */ );


}

function createNew_goods(callback){
        var params = {};
    params.goods_id = null;
    
    var now = new Date();

    params.goods_name = '商品_' + randomTools.getRandomBetweenNumbers(1,10) + now.getTime();
    params.goods_create_user = randomTools.getRandomBetweenNumbers(1,10);
    params.goods_qty = randomTools.getRandomBetweenNumbers(1,100);
    params.goods_is_remain = randomTools.getRandomBetweenNumbers(0,1);
  
    params.goods_create_time =  randomTools.getRandomTime();

/*

INSERT INTO `goods` 

(
goods_id  , 
goods_name  , 
goods_create_user   ,
goods_create_time  ,
goods_qty  ,
goods_is_remain
)

VALUES 
(
    '3c27e0d4-d5cb-46f4-8b45-89ab0d34faaa', 
    '抢购商品1',
     '', 
     '2017-02-02 00:09:52', 
     '50', 
     '0'
);
*/
    if (callback) {
        callback(params);
    }
    return params;


}

// insertBigDataByBatch ();


function create_new_col(){

    mysql.query    (  'alter table  ', null  ,function(err, result){



    });

}


