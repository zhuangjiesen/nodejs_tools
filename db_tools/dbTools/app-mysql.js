var mysql=require("mysql");  

//
// pool.getConnection(function(err, connection) {
//   // Use the connection
//   connection.query( 'SELECT * FROM goods where goods_name = ? ', [ '抢购商品1' ] , function(err, rows) {
//     // And done with the connection.

//     console.log('rows : '+ JSON.stringify(rows));

//     //不能用end方法 ， 用 release 方法放回连接池
//     connection.release();

//     // Don't use the connection here, it has been returned to the pool.
//   });
// });


//封装查询

/*

mysql 查询是 ? 代表 参数
connection.query( 'SELECT * FROM goods where goods_name = ? ', [ '抢购商品1' ] 

*/

var pool = null;
exports.initMysqlConnectPool = function(){
    
  pool = mysql.createPool({  
      host: 'localhost',  
      user: 'root',  
      password: '123456',  
      database: 'dragsun_db', 
      connectionLimit : 300, 
      port: 3306  
  });  
}



/*
 sql 中 占位符用的是 ? ，参数用数组
 如
  sql : select * from table1 where field1 = ?
  paramsArray : [ 'field1_value' ]

*/
exports.query = function(sql , paramsArray , callback){
  if (!pool) {
    console.error('数据库未初始化', err);
  }

  pool.getConnection(function(err, connection) {


    // Use the connection
    connection.query( sql , paramsArray , function(err, result) {
      // And done with the connection.
      if (err) {
        console.log('sql : '+ sql , err);
      }

      console.log('result : '+ JSON.stringify(result));

      //不能用end方法 ， 用 release 方法放回连接池
      connection.release();

      if (callback) {
        callback(err, result);  
      }
      
      // Don't use the connection here, it has been returned to the pool.
    });
  });


}


/*
  查询方法：
  例子
  mysql.select('goods' ,
        //select 后 选择取出的字段名 null 默认 * 全部取出 
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


   var sql = ' select ${selectItem} from ${tableName}  ${orderBy}  ${limit} ';
    if (whereParams) {
        sql +=' where 1=1 ${whereParams}';
    }
    sql = sql.replace('${tableName}' , tableName);


    var selectItemClause = '';
    var whereParamsClause = '';

    var whereValues = [];


    var len = 0;
    if (selectArray) {
        for (var i = 0 ; i < selectArray.length ; i++) {
            selectItemClause += '`';
            selectItemClause += selectArray[i]
            selectItemClause += '` ,';
        }
        if ((len = selectItemClause.length) > 0) {
            selectItemClause = selectItemClause.substring(0 , len - 1);
        }
    } else {
        selectItemClause = ' * ';
    }

    sql = sql.replace('${selectItem}' , selectItemClause);

    if (whereParams) {

        for (key in whereParams) {
            whereParamsClause += ' AND (`';
            whereParamsClause += key;
            whereParamsClause += '` = ? ';
            whereParamsClause += '),';
            whereValues.push(whereParams[key]);

        }
        if ((len = whereParamsClause.length) > 0) {
            whereParamsClause = whereParamsClause.substring(0 , len - 1);
        }

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




  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('数据库连接出错', err);
    }

    // Use the connection
    connection.query( sql , whereValues , function(err, result) {
      // And done with the connection.
      if (err) {
        console.error('sql : '+ sql , err);
      }


      //不能用end方法 ， 用 release 方法放回连接池
      connection.release();
      if (callback) {
        callback(err, result);  
      }
      

      // Don't use the connection here, it has been returned to the pool.
    });
  });


}

exports.getInsertSqlParams = function(tableName , paramsObject , callback){
  var sql = ' INSERT INTO ${tableName}  ${fields}  VALUES ${values} ' ;

  sql = sql.replace('${tableName}' , tableName);
  var fields = '';
  var values = '';

  var len = 0;

  var paramsArray = [];
  if (paramsObject) {
    fields += ' ( ';
    values += ' ( ';

    for (key in paramsObject) {

      fields += ' `';
      fields += key;
      fields += '` ,';


      var value = paramsObject[key];
      if (value) {
          values += ' ?';
          paramsArray.push(value); 
      } else {
          values += ' null ';
      }
      values += ' ,';



    }
    fields = substringLastChar(fields);

    values = substringLastChar(values);


    values += ' ) ';
    fields += ' ) ';
  }


  sql = sql.replace('${fields}' , fields);
  sql = sql.replace('${values}' , values);
  var insertObject = {};
  insertObject['sql'] = sql;
  insertObject['params'] = paramsArray;
  return insertObject;

}


exports.getInsertByBatchSqlParams = function(tableName , paramsArray , callback){


  var sql = ' INSERT INTO ${tableName}  ${fields}  VALUES ${values} ' ;

  sql = sql.replace('${tableName}' , tableName);
  var fields = '';
  var values = '';

  var len = 0;

  var valuesArray = [];

  if (paramsArray && (len = paramsArray.length) > 0) {
    var first = paramsArray[0];

    fields += ' ( ';
    for (key in first) {

      fields += ' `';
      fields += key;
      fields += '` ,';

    }
    fields = substringLastChar(fields);

    fields += ' ) ';


    
    len = paramsArray.length;
    for (var i = 0 ; i < len ; i++) {
      values += ' ( ';
      var item = paramsArray[i];
      for (key in item) {
        values += ' ? ,';
        var value = item[key];
        valuesArray.push(value);
      }
      values = substringLastChar(values);

      values += ' ) ,';
    }
    values = substringLastChar(values);


  }



  sql = sql.replace('${fields}' , fields);
  sql = sql.replace('${values}' , values);
  var insertObject = {};
  insertObject['sql'] = sql;
  insertObject['params'] = valuesArray;
  return insertObject;



}





exports.getUpdateSqlParams = function(tableName , updateParams ,whereParams , callback){
  var sql = ' UPDATE  ${tableName} SET ${set}  where 1=1  ${whereClause} ' ;
  sql = sql.replace('${tableName}' , tableName);

  var setClause = '';
  var whereClause ='';



  var valuesArray = [];

  if (updateParams) {


    for (key in updateParams) {
      setClause += ' `';
      setClause += key;
      setClause += '` ';
      setClause += ' = ? ';

      valuesArray.push(updateParams[key]);

      setClause += ' ,';
    }
    setClause = substringLastChar(setClause);

  } else {
    return null;
  }

  if (whereParams) {


    for (key in whereParams) {
      whereClause += ' AND `';
      whereClause += key ;
      whereClause += '` = ';
      whereClause += '? ';
      valuesArray.push(whereParams[key]);
    }
  } else {
    return null;
  }

  sql = sql.replace('${set}' , setClause);
  sql = sql.replace('${whereClause}' , whereClause);

  console.log('sql : '+sql);

console.log('valuesArray : '+JSON.stringify(valuesArray));

  var insertObject = {};
  insertObject['sql'] = sql;
  insertObject['params'] = valuesArray;
  return insertObject;
}

exports.insert = function ( tableName  ,paramsObject  ,callback){

    var insertParams = this.getInsertSqlParams( tableName , paramsObject);


    var sql = insertParams['sql'] ;
    var paramsArray = insertParams['params'] ;

    this.query(sql , paramsArray , callback);
}


exports.insertByBatch = function ( tableName  ,paramsArray  ,callback){

    var insertParams = this.getInsertByBatchSqlParams(tableName, paramsArray);

    var sql = insertParams['sql'] ;
    var array = insertParams['params'] ;
    this.query(sql , array , callback); 
}

exports.update = function (tableName , updateParams ,whereParams , callback){

    var insertParams = this.getUpdateSqlParams( tableName , updateParams , whereParams);
    var sql = insertParams['sql'] ;
    var paramsArray = insertParams['params'] ;


    this.query(sql , paramsArray , callback);

}



/*
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
