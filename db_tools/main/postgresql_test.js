// 随机函数库
var randomTools = require('../dbTools/randomTools.js');

console.log('hello_db_tools ....');

var postgresql = require('../dbTools/postgresql');

postgresql.initPgConnectPool();


function insert(){
    
    //构造插入数据
    var paramsObject = createNew_resource_crossing_lane_info(function(params){
                     params.c_name = '我是插入测试';
                });


    //插入数据
    var insertParams = postgresql.insert('resource_crossing_lane_info' , paramsObject  , function(err, result){
        console.log(' insert : .......');
    });
}

// 单挑插入语句
// insert();


function insertByBatch(){
    var array = [];

    for (var i = 0 ; i < 4 ; i++) {

        var paramsObject = createNew_resource_crossing_lane_info(function(params){
                 params.c_name = '我是插入测试 : '+ (i+1);
            });

        array.push(paramsObject);

    }

    postgresql.insertByBatch( 'resource_crossing_lane_info'  ,array  ,function(err, result){
        console.log(' insertByBatch : .......');
    });



}
// 批量添加事例；
/*
        拼接成sql :
        sql :  INSERT INTO createNew_resource_crossing_lane_info   (  "xxxxx" , "xxxxx"  )   VALUES  
        (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  ) , (  ? , ?  )

        插入多条语句
        插入效率快
*/
// insertByBatch();




function updateTest(){
     var whereObject = {};
    whereObject.i_id = 140;



    var updateParams = {};
    updateParams.c_name = '车道update111';
    updateParams.c_index_code = '55555555';

    var insertParams = postgresql.update('resource_crossing_lane_info' , updateParams , whereObject , function(err, result){
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
    whereParams.i_id = 140;
    postgresql.select('resource_crossing_lane_info' ,

        /*  select 后 选择取出的字段名 null 默认 * 全部取出 */
        [
            'i_id',
            'c_name',
            'c_index_code',
            'c_create_time'
        ] , 
        whereParams , null , null  , function(err, result){

                console.log('result : '+ JSON.stringify(result));



        });
}

//查询测试
// selectTest();





//批量造数据

function crossLaneData(){
    var crossIndexCodeArr = [  "16012100001310014427" , "33000000001310010293" ,"33000000001310011008" ,"33000000001310012007" , "33000000001310012585" ,"33000000001310013147" , "33000000001310013960" ,"33000000001310018610" ,"33000000001310019071" ,"33000000001310019580" ,"160125111653219560" ];

    for (var i = 0 ;i < crossIndexCodeArr.length ; i++) {
        var crossIndexCode = crossIndexCodeArr[i];

        //12车道
        for (var j = 0 ;j < 12 ; j++) {


            postgresql.insertByBatchCustome(1 ,function(){

                return createNew_resource_crossing_lane_info(function(params){
                    params.c_crossing_index_code = crossIndexCode;
                    params.c_name = '车道/'+ (j+1);
                    params.i_lane_number = (j+1);


                });

            }  ,'resource_crossing_lane_info'  ,1 );


        }


    }




}
// crossLaneData();





function createNew_resource_crossing_lane_info(callback){

    var params = {};
    params.i_id = "nextval('s_resource_crossing_lane_info')";
    params.c_index_code = randomTools.getRandomBetweenNumbers(1,10);
    params.c_crossing_index_code = randomTools.getRandomBetweenNumbers(1,10);
    params.i_speed_limit = randomTools.getRandomBetweenNumbers(1,10);
    params.c_direction_name = randomTools.getRandomBetweenNumbers(1,10);
    params.i_direction_no = randomTools.getRandomBetweenNumbers(1,10);
    params.i_trigger_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_enable_relate = randomTools.getRandomBetweenNumbers(1,10);

    params.c_create_time =  randomTools.getRandomTime();
    params.c_update_time =  randomTools.getRandomTime();

    params.c_related_camera_index_code = randomTools.getRandomBetweenNumbers(1,10);
    params.c_related_camera_name = randomTools.getRandomBetweenNumbers(1,10);
    params.c_related_camera_path = randomTools.getRandomBetweenNumbers(1,10);
    params.i_direct_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_jalaneno = randomTools.getRandomBetweenNumbers(1,10);
    params.i_cascade_id = randomTools.getRandomBetweenNumbers(1,10);
    params.i_crossing_camera_id = randomTools.getRandomBetweenNumbers(1,10);
    params.c_creator = randomTools.getRandomBetweenNumbers(1,10);
    params.i_res_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_org_id = randomTools.getRandomBetweenNumbers(1,10);
    params.i_device_res_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_enable = randomTools.getRandomBetweenNumbers(1,10);
    params.i_status = randomTools.getRandomBetweenNumbers(1,10);

/*

INSERT INTO "public"."resource_crossing_lane_info" ("i_id", "c_index_code", "c_name", "i_lane_number", "c_crossing_index_code", "i_speed_limit", "c_direction_name", "i_direction_no", "i_trigger_type", "i_enable_relate", "c_related_camera_index_code", "c_related_camera_name", "c_related_camera_path", "i_direct_type", "i_jalaneno", "i_cascade_id", "i_lane_type", "i_crossing_camera_id", "c_create_time", "c_update_time", "c_creator", "i_res_type", "i_org_id", "i_device_res_type", "i_enable", "i_status") VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

*/
    if (callback) {
        callback(params);
    }
    return params;
}