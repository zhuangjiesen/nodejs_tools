
var pg = require('pg');


// 数据库配置

/*
var config = {  
    user:"postgres",
    database:"vvbs_db",
    password:"88075998",
    port:5432,
    host:'10.11.164.18',
    // 扩展属性
    max:500, // 连接池最大连接数
    idleTimeoutMillis:3000  // 连接最大空闲时间 3s
}
*/

var config = {  
    user:"postgres",
    database:"egms_2",
    password:"postgres",
    port:5432,
    host:'127.0.0.1',
    // 扩展属性
    max:500, // 连接池最大连接数
    idleTimeoutMillis:3000  // 连接最大空闲时间 3s
}
/**/
var pool = null;
exports.initPgConnectPool = function(){
    pool = new pg.Pool(config);
}




//封装
/*
 sql 中 占位符用的是 $1 $2 ....从1开始 ，但是数据参数还是从0取的  (mysql 中是 ?  从1 开始的占位符数组是0  ) ，参数用数组
 如
  sql : select * from table1 where field1 = $1 and field2 = $2
  paramsArray : [ 'field1_value'  , 'field2_value']

  */
exports.query = function(sql , paramsArray , callback){
    if (!pool) {
        console.error('数据库未初始化', err);
    }


    // 查询
    pool.connect(function(err, client, done) {  
      if(err) {
        return console.error('数据库连接出错', err);
      }


        client.query(sql, paramsArray, function(err, result) {

            if(err) {      
                return console.error('error running query', err);
            }    
          

             // 释放连接
            client.release();


            //返回结果
            if (callback) {
                callback(err, result);    
            }
            
        });

        
    });



}

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
exports.select = function(tableName , selectArray  , whereParams , orderBy , limit  , callback){
    if (!pool) {
        console.error('数据库未初始化', err);
    }
    var sql = ' select ${selectItem} from ${tableName} ';
    if (whereParams) {
        sql +=' where 1=1 ${whereParams}';
    }
    sql += ' ${orderBy} ';
    sql += ' ${limit} ';
    sql = sql.replace('${tableName}' , tableName);


    var selectItemClause = '';
    var whereParamsClause = '';

    var whereValues = [];
    var len = 0;
    if (selectArray) {
        for (var i = 0 ; i < selectArray.length ; i++) {
            selectItemClause += '"';
            selectItemClause += selectArray[i]
            selectItemClause += '" ,';
        }
 
        selectItemClause = substringLastChar(selectItemClause);

    } else {
        selectItemClause = ' * ';
    }

    sql = sql.replace('${selectItem}' , selectItemClause);

    if (whereParams) {

        var i = 1;
        for (key in whereParams) {
            whereParamsClause += ' AND ("';
            whereParamsClause += key;
            whereParamsClause += '" = $' + i;
            whereParamsClause += '),';

            whereValues.push(whereParams[key]);
            i ++;
        }

        whereParamsClause = substringLastChar(whereParamsClause);


    }
    sql = sql.replace('${whereParams}' , whereParamsClause);


    if (!orderBy) {
        orderBy = '';
    }
    sql = sql.replace('${orderBy}' , orderBy);

    if (!limit) {
        limit = '';
    }
    sql = sql.replace('${limit}' , limit);


    console.log('sql : '+sql);



    // 查询
    pool.connect(function(err, client, done) {  
      if(err) {
        return console.error('数据库连接出错', err);
      }
        
        client.query(sql, whereValues, function(err, result) {

            if(err) {      
                return console.error('error running query', err);
            }    

             // 释放连接
            client.release();
            //返回结果
            if (callback) {
                callback(err, result);
            }

        });

        
    });



}


exports.getInsertSqlParams = function(tableName , paramsObject , callback){
    var sql = ' INSERT INTO ${tableName} ( ${fields} ) VALUES ( ${values} ) ';

    sql = sql.replace('${tableName}' , tableName);


    var fields = '';
    var length = 0;

    var valuesArray = new Array();

    var valuesClause = '';


    var i = 1 ;
    for (key in paramsObject) {
        //自增主键

        fields  += ' "';
        fields  += key;
        fields  += '" ';
        fields  += ',';
        var value = paramsObject[key];


        // 按序列递增的主键
        if (value && typeof(value) == 'string' && value.indexOf('nextval') > -1) {

            valuesClause += value;
            valuesClause += ' ,';
        } else {
            valuesClause += ' $'+i;
            valuesClause += ' ,';
            i ++;
            valuesArray.push(value);
        }

    }
    fields = substringLastChar(fields);

    sql = sql.replace('${fields}' , fields);

    valuesClause = substringLastChar(valuesClause);

    sql = sql.replace('${values}' , valuesClause);

    var insertObject = {};
    console.log('sql : ' + sql);
    insertObject['sql'] = sql;
    insertObject['params'] = valuesArray;
    return insertObject;
}






exports.getInsertByBatchSqlParams = function(tableName , paramsArray , callback){

    var sql = ' INSERT INTO ${tableName} ( ${fields} ) VALUES  ${values}  ';
    sql = sql.replace('${tableName}' , tableName);

    var fields = '';
    var length = 0;

    var valuesArray = new Array();


    if (paramsArray && paramsArray.length > 0) {
        var first = paramsArray[0];


        //获取参数
        for (key in first) {
            //自增主键

            fields  += '"';
            fields  += key;
            fields  += '"';
            fields  += ',';

        }




        var valuesClause = '';

        var itemCount = 1;
        for (var i = 0 ; i < paramsArray.length ; i++) {
            var paramsItem = paramsArray[i];


            var valuesClauseItem = '(' ;

                  //获取参数
            for (key in paramsItem) {
                //自增主键

                var value = paramsItem[key];

                if (value && typeof(value) == 'string' && value.indexOf('nextval') > -1) {
                    valuesClauseItem += ' ';
                    valuesClauseItem += value;
                    valuesClauseItem += ' ,';
                } else {
                    valuesClauseItem += ' $' +itemCount +'  ,' ;

                    valuesArray.push(value);
                    itemCount ++;
                }

            }  
            if ((length = valuesClauseItem.length) > 0) {
                valuesClauseItem = valuesClauseItem.substring(0 , length - 1);
            }

            valuesClauseItem += ')' ;
            valuesClauseItem += ' ,' ;

            valuesClause += valuesClauseItem;
        }
        if ((length = valuesClause.length) > 0) {
            valuesClause = valuesClause.substring(0 , length - 1);
        }

    }
    fields = substringLastChar(fields);


    sql = sql.replace('${fields}' , fields);
    sql = sql.replace('${values}' , valuesClause);



    

    var insertObject = {};
    insertObject['sql'] = sql;
    insertObject['params'] = valuesArray;
    return insertObject;
}






exports.getUpdateSqlParams = function(tableName , updateParams ,whereParams , callback){
    var sql = ' update ';
    sql += tableName ;

    sql += ' set ';

    var fields = '';
    var length = 0;

    var valuesArray = new Array();


    var i = 1;
    for (key in updateParams) {
        fields  += '"';
        fields  += key;
        fields  += '"';
        fields  += ' = $'+i;

        fields  += ',';
        var value = updateParams[key];
        valuesArray.push(value);
        i ++;
    }
    fields = substringLastChar(fields);
    sql += fields;



    var whereClause = '';
    if (whereParams) {
        whereClause += ' where 1=1 ';


        for (key in whereParams) {
            whereClause  += ' AND (';

            whereClause  += '"';
            whereClause  += key;
            whereClause  += '"';
            whereClause  += ' = $'+i;

            whereClause  += ' ) ';


            var value = whereParams[key];
            valuesArray.push(value);
            i ++;
        }

    }
    sql += whereClause;




    var updateObject = {};
    updateObject['sql'] = sql;
    updateObject['params'] = valuesArray;
    return updateObject;
}


exports.insertByBatch = function ( tableName  ,paramsArray  ,callback){

    var insertParams = this.getInsertByBatchSqlParams(tableName, paramsArray);

    var sql = insertParams['sql'] ;
    var array = insertParams['params'] ;
    this.query(sql , array , callback); 
}




exports.insert = function ( tableName  ,paramsObject  ,callback){

    var insertParams = this.getInsertSqlParams( tableName , paramsObject);
    var sql = insertParams['sql'] ;

    var paramsArray = insertParams['params'] ;
    this.query(sql , paramsArray , callback);
}



exports.update = function (tableName , updateParams ,whereParams , callback){

    var insertParams = this.getUpdateSqlParams( tableName , updateParams , whereParams);
    var sql = insertParams['sql'] ;
    var paramsArray = insertParams['params'] ;


    this.query(sql , paramsArray , callback);

}


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
//批量插入
//paramFactoryFun 生产的函数
exports.insertByBatchCustome = function (count , paramFactoryFun ,tableName  ,valueCount ){
     if (!paramFactoryFun) {
        console.error('生产函数未设置');
    }


    for (var i = 0 ; i  < count ; i++) {

        // var insertParams = postgresql.insert('vehicle_roster' , params);
        var paramsArray = [];
        //批量插入默认插入一万条
        if (!valueCount) {
            valueCount = 10000;
        }
        for (var sqlCount = 0 ; sqlCount < valueCount ; sqlCount++ ) {
            paramsArray.push(paramFactoryFun());
        }

        this.insertByBatch( tableName  , paramsArray );
    
        

    }
}


//去掉最后一个字符
function substringLastChar(str) {
    if ((str.length) > 0) {
      str = str.substring( 0 , str.length - 1 );
    }
    return str;
}
