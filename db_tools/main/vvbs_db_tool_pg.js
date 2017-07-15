// 随机函数库
var randomTools = require('../dbTools/randomTools.js');

console.log('hello_db_tools ....');



var postgresql = require('../dbTools/postgresql');
// 初始化连接池
postgresql.initPgConnectPool();















// 卡口
function crossInfoData(){
    var crossIndexCodeArr = [  "16012100001310014427" , "33000000001310010293" ,"33000000001310011008" ,"33000000001310012007" , "33000000001310012585" ,"33000000001310013147" , "33000000001310013960" ,"33000000001310018610" ,"33000000001310019071" ,"33000000001310019580" ,"160125111653219560" ];
    for (var i = 0 ;i < crossIndexCodeArr.length ; i++) {
        var crossIndexCode = crossIndexCodeArr[i];


        postgresql.insertByBatchCustome(1 ,function(){

            return createNew_resource_crossing_info(function(params){
                params.c_index_code = crossIndexCode;
                params.c_name = '卡口/'+ (i+1);

            });

        }  ,'resource_crossing_info'  ,1 )


    }


}

// crossInfoData();



// 车道
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




// 过车记录
function recordData(){

var whereParams = {};
whereParams.i_id = 1;



postgresql.insertByBatchCustome( 250 ,function(){

                return createNew_vehicle_record(function(params){

                    var crossIndexCodeArr = [  "16012100001310014427" , "33000000001310010293" ,"33000000001310011008" ,"33000000001310012007" , "33000000001310012585" ,"33000000001310013147" , "33000000001310013960" ,"33000000001310018610" ,"33000000001310019071" ,"33000000001310019580" ,"160125111653219560" ];


                    params.c_cross_index_code = crossIndexCodeArr[randomTools.getRandom(crossIndexCodeArr.length - 1)];
                    params.i_lane_id = randomTools.getRandomBetweenNumbers(1,12);
                        
                    /*


                   

                    */

                    /*
                    params.c_camera_index_code = '90305225';

                    var crossArr = [
                        "001098",
                        "001083",
                        "001084",
                        "001085",
                        "001086",
                        "001097",
                        "001094",
                        "001095",
                        "001096",
                        "001093"
                    ];

                    params.c_cross_index_code = crossArr[randomTools.getRandom(crossArr.length - 1)];
                    
                    */

                });

            }  ,'vehicle_record' , 100 );


/*

//关联插入
postgresql.select( 'resource_crossing_lane_info' ,[
    'c_crossing_index_code',
    'i_lane_number',
    'i_id',
    'c_name',
    ], null , null , null ,function(err, result){

        // 查出所有值 随机选中 ，保证插入数据关系准确性
        var rows = result.rows;
        var len = rows.length;


        postgresql.insertByBatchCustome( 100 ,function(){

                return createNew_vehicle_record(function(params){

                    var item = rows[randomTools.getRandom(len - 1)];
                        
                    //------------------
                    params.c_cross_index_code = item.c_crossing_index_code;
                    params.i_lane_id = item.i_lane_number;

                    //---------------
                    params.c_camera_index_code = '90305225';

                    var crossArr = [
                        "001098",
                        "001083",
                        "001084",
                        "001085",
                        "001086",
                        "001097",
                        "001094",
                        "001095",
                        "001096",
                        "001093"
                    ];

                    params.c_cross_index_code = crossArr[randomTools.getRandom(crossArr.length - 1)];

                });

            }  ,'vehicle_record' , 1000 );


    });

*/


}
recordData();





// 违法过车记录
function illegalRecordData(){

var pageSize = 100;
for ( var i = 2 ; i < 200 ; i ++) {
    var limit = 'limit   ';
    limit += pageSize;
    limit += ' offset ';
    limit += (i+1);
    limit += '  ';

    //关联插入

    var hasSet = {};


    postgresql.select( 'vehicle_record' , null , null ,'  order by "i_id" desc  ' , limit  ,function(err, result){

            // 查出所有值 随机选中 ，保证插入数据关系准确性
            var rows = result.rows;
            var len = rows.length;
            // console.log('rows : '+ JSON.stringify(rows));


            var array = [];
            var start_index = randomTools.getRandom(len - 1);
            var end_index = randomTools.getRandom(len - 1);

            var start = 0 ;
            var end = 0;
           while (start_index == end_index) {
                start_index = randomTools.getRandom(len - 1);
                end_index = randomTools.getRandom(len - 1);
            }

            if (start_index < end_index) {
                start = start_index ;
                end = end_index;
            } else {
                start = end_index ;
                end = start_index;
            }


            for (var j = start ; j < end ; j ++ ) {

                var item = rows[j];
                item.i_id = "nextval('s_vehicle_illegal_record')";

                delete item.i_cross_status;
                delete item.i_cross_status;

                item.i_illegal_type =  randomTools.getRandomBetweenNumbers(1,2);
                if (item.i_illegal_type == 2) {
                    item.i_roster_desc = '我是布控原因/' + j;

                }
                array.push(item);
            }

            postgresql.insertByBatch( 'vehicle_illegal_record'  ,array  ,function(err, result){
                console.log(' insertByBatch : .......');
            });



        });

}







}
// illegalRecordData();




//插入测试
function test(){

//批量插入
// for (var i = 0 ; i  < 1 ; i++) {

//     // var insertParams = postgresql.insert('vehicle_roster' , createNew_vehicle_roster());
//     // console.log('sql : '+ insertParams['sql']);    //output: 1
//     // console.log('params : '+ JSON.stringify(insertParams['params']));    //output: 1



//     var paramsArray = [];
//     //批量插入300条
//     var valueCount = 10;
//     for (var sqlCount = 0 ; sqlCount < valueCount ; sqlCount++ ) {
//         paramsArray.push(createNew_vehicle_roster());
//     }

//     var insertParams = postgresql.insertByBatch('vehicle_roster' , paramsArray);
//     console.log('sql : '+ insertParams['sql']);    //output: 1
//     console.log('params : '+ JSON.stringify(insertParams['params']));    //output: 1

//     var temp = i;
//     postgresql.query(insertParams['sql'] , insertParams['params'] , function( err, result) {
//         console.log('result : '+ JSON.stringify(result));    //output: 1
//     });

// }
}



function createNew_vehicle_roster(callback){

    var params = {};
    params.c_plate_no = randomTools.getRandomCarCode();

    params.i_id = "nextval('s_vehicle_roster')";
    params.c_vehicle_type = randomTools.getRandomBetweenNumbers(1,10);
    params.c_vehicle_color = randomTools.getRandomBetweenNumbers(1,10);
    params.c_plate_color = randomTools.getRandomBetweenNumbers(1,10);
    params.i_plate_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_type = randomTools.getRandomBetweenNumbers(1,2);
    if (callback) {
        callback(params);
    }
    return params;
}




function createNew_resource_crossing_info(callback){

    var params = {};
    params.i_id = "nextval('s_resource_crossing_info')";
    params.i_org_id = randomTools.getRandomBetweenNumbers(1,10);
    params.i_crossing_mode = randomTools.getRandomBetweenNumbers(1,10);
    params.i_front_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_intercity = randomTools.getRandomBetweenNumbers(1,10);
    params.i_lane_num = randomTools.getRandomBetweenNumbers(1,10);
    params.c_longitude = randomTools.getRandomBetweenNumbers(1,10);
    params.c_latitude = randomTools.getRandomBetweenNumbers(1,10);
    params.c_create_time =  randomTools.getRandomTime();
    params.c_update_time =  randomTools.getRandomTime();
    params.i_status = randomTools.getRandomBetweenNumbers(1,10);
    params.i_res_type = randomTools.getRandomBetweenNumbers(1,10);
    params.c_ip = randomTools.getRandomBetweenNumbers(1,10);
    params.i_port = randomTools.getRandomBetweenNumbers(1,10);
    params.i_manufacturer = randomTools.getRandomBetweenNumbers(1,10);
    params.i_device_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_device_detail_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_crossing_type = randomTools.getRandomBetweenNumbers(1,10);


// INSERT INTO "public"."resource_crossing_info" ("i_id", "c_index_code", "c_name", "i_org_id", "i_crossing_mode", "i_front_type", "i_intercity", "i_lane_num", "c_longitude", "c_latitude", "c_create_time", "c_update_time", "c_camera_name", "c_camera_path", "c_tda_index_code", "i_status", "i_res_type", "c_ip", "i_port", "i_manufacturer", "i_device_type", "i_device_detail_type", "i_crossing_type") VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


    if (callback) {
        callback(params);
    }
    return params;
}









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




function createNew_vehicle_record(callback){

    var params = {};
    params.i_id = "nextval('s_vehicle_record')";




    params.c_camera_index_code = randomTools.getRandomBetweenNumbers(1,10);


    params.c_cross_index_code = randomTools.getRandomBetweenNumbers(1,10);
    


    params.i_lane_id = randomTools.getRandomBetweenNumbers(1,10);
    params.i_plate_type = randomTools.getRandomBetweenNumbers(1,10);
    params.i_vehicle_speed = randomTools.getRandomBetweenNumbers(1,50);

    params.i_vehicle_type = randomTools.getRandomBetweenNumbers(1,13);

    params.c_pass_time =  randomTools.getRandomTime();
    params.c_update_time =  randomTools.getRandomTime();

    params.i_vehicle_color_depth = randomTools.getRandomBetweenNumbers(1,10);

    params.i_vehicle_color = randomTools.getRandomBetweenNumbers(1,12);

         //图像
       var plateImgArr = [
               "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=ff75a3837788464a929bab9e6462d4cd" ,
       ];

    params.c_pic_plate = plateImgArr[randomTools.getRandom(plateImgArr.length - 1)];

        //图像

        /*
        var imgArr = [
                "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2951562466,592966863&fm=23&gp=0.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546488&di=bd1504c5ee693f8127e3dec6e507c1e9&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%253D580%2Fsign%3Dee2c747cf7246b607b0eb27cdbf81a35%2F2a1fbe096b63f6243b45132c8644ebf81a4ca381.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546487&di=9f5e81c909433ff62d1d2e25a05d4d8e&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20160929%2F6aad665f0ecc475082418e6551c9f098_th.png" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546487&di=c6aee8ec8f4512e19fb4bde42fdbb096&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%253D580%2Fsign%3D4f0aaf7bc2fdfc03e578e3b0e43d87a9%2F5aafa40f4bfbfbed2c926ffa79f0f736aec31f6f.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546487&di=2139305b737150398725f7886a65a0fa&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%253D580%2Fsign%3D718e82a5f2deb48ffb69a1d6c01e3aef%2F70dbfaedab64034ff484dac2aec379310b551d4c.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546487&di=0f84ab7b0c512c6c03a05fdff19d36a5&imgtype=0&src=http%3A%2F%2Fimg1.qq.com%2Fxian%2Fpics%2F11075%2F11075383.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546487&di=4c5e2d50717624ea28e9feef9f84841a&imgtype=0&src=http%3A%2F%2Fnews.hainan.net%2FEditor%2FUploadFile%2F2007w1r3f%2F20071383055667.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546486&di=28ab92aaedf3c216daf25cc414e90021&imgtype=0&src=http%3A%2F%2Fimages.ccoo.cn%2Fbbs%2F201097%2F2010970460918.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546486&di=46e1601c1e982605e8439c878f0edeec&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fzhangbai%2Fpic%2Fitem%2F7dd98d1001e93901ec31179b7bec54e736d19660.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546485&di=0b5b07239e007cd6b1cd3e761d2d4be0&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3D48af721ab51bb0518f24b320067bda77%2Fa18d08fa513d2697b836766553fbb2fb4216d886.jpg" ,
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493895546483&di=35c9ff84a160ad4664c63c311c460bc2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3D358eff96cc3d70cf4cfaaa05c8ddd1ba%2F7aacd488d43f8794ee72e581d71b0ef419d53afd.jpg" 
                ];
    */
         var imgArr = [
                "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=809052af7767463ea4dadc4ba3bb32a6" ,
                "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=5c59a8c4fc924eeda5026a4a4b00e2f8" ,
                "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=da5e5e5a63e04ab3bbf57f45148090b8" ,
                "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=36e027dac5944d3ba1370cf0d165ef2c" ,
                "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=be79f6991d86497dad42c2705db39b0d" ,
                "http://10.33.30.216:8989/kms/services/rest/dataInfoService/downloadFile?id=94dec684e3954d62a6058477d0d86b97" 
        ];



    params.c_pic_vehicle = imgArr[randomTools.getRandom(imgArr.length - 1)];


    params.i_vehicle_state = randomTools.getRandomBetweenNumbers(1,10);
    params.i_vehicle_logo = randomTools.getRandomBetweenNumbers(1,10);
    params.i_vehicle_sublogo = randomTools.getRandomBetweenNumbers(1,10);
    params.i_vehicle_model = randomTools.getRandomBetweenNumbers(1,10);
    params.i_vehicle_sunvisor = randomTools.getRandomBetweenNumbers(1,10);
    params.c_device_ip = randomTools.getRandomBetweenNumbers(1,10);
    params.i_limit_speed = randomTools.getRandomBetweenNumbers(20,30);


    var eventArray = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        24,
        101,
        102,
        103,
        104,
        105,
        106,
        107
    ];

    params.i_cross_event_type =eventArray[randomTools.getRandom(eventArray.length - 1)] ;

    params.c_log_txt = randomTools.getRandomBetweenNumbers(1,10);
    
    params.i_plate_color = randomTools.getRandomBetweenNumbers(1,6);

    //过车状态
    params.i_cross_status = randomTools.getRandomBetweenNumbers(0,2); 
    if (params.i_cross_status != 2) {
        params.c_plate_info = randomTools.getRandomCarCode();    
    } else {
        params.c_plate_info = null;   
    }     
    


/*



INSERT INTO "public"."vehicle_record" ("i_id", "c_camera_index_code", "c_cross_index_code", "c_plate_info", "i_lane_id", "i_plate_type", "c_pass_time", "i_vehicle_speed", "i_vehicle_type", "i_vehicle_color_depth", "i_vehicle_color", "c_pic_plate", "c_pic_vehicle", "i_vehicle_state", "i_vehicle_logo", "i_vehicle_sublogo", "i_vehicle_model", "i_vehicle_sunvisor", "c_device_ip", "i_limit_speed", "i_cross_event_type", "c_update_time", "c_log_txt", "i_cross_status", "i_plate_color") VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


*/
    if (callback) {
        callback(params);
    }
    return params;
}




function update_vehicle_record(){
    var plate_images = [];
    for (var i = 0 ; i < 9 ; i ++) {
        plate_images.push('http://127.0.0.1:8080/vvbs/static/plateImages/plate_pic'+ (i+1) +'.png');
    }

    for (var i = 1 ;  i < 28 ; i ++) {
         var whereObject = {};
        // whereObject.i_id = randomTools.getRandomBetweenNumbers(1,411996);
        whereObject.i_id = i+1;

        var updateParams = {};
        updateParams.c_pic_plate =plate_images[randomTools.getRandom(plate_images.length - 1)];

        var insertParams = postgresql.update('vehicle_illegal_record' , updateParams , whereObject , function(err, result){
            console.log(' update : .......');
        });
    }
    




}
//update操作事例
// update_vehicle_record();