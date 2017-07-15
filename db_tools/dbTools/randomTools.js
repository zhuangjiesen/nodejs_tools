
    //获取[m,n]之间的随机数（0<=m<=n）

exports.getRandomBetweenNumbers = function(start , end ){
	var Range = end - start;   
	var Rand = Math.random();   
	return(start + Math.round(Rand * Range));   
}


exports.getRandomTelephoneNumber = function(){
    var prefix = [  13 , 18 , 15 , 17 ];
    var tel = '';
    tel += this.getRandomByArray(prefix);
    for (var i = 0 ; i < 9 ; i ++) {
        tel += this.getRandomBetweenNumbers(0 , 9);
    }
    return tel;
}


exports.getRandomTime = function(){
	var startYear = 2015 ;
	var endYear =  2017;

	var startMonth = 1;
	var endMonth = 12;

	var startDate = 1;
	var endDate = 28;


	var time = '';

	time += this.getRandomBetweenNumbers(startYear , endYear);
	time += '-';

    var month = this.getRandomBetweenNumbers(startMonth, endMonth);
    if (month < 10) {
    	time += '0';
    }
    time += month;
	time += '-';

	var date = this.getRandomBetweenNumbers(startDate, endDate);
    if (date < 10) {
    	time += '0';
    }
    time += date;
	time += ' ';


    var  hour = this.getRandomBetweenNumbers( 0 , 23);
    if (hour < 10) {
    	time += '0';
    }
    time += hour;
	time += ':';

    var minute = this.getRandomBetweenNumbers( 0 , 59);
    if (minute < 10) {
    	time += '0';
    }
    time += minute;
	time += ':';

    var second = this.getRandomBetweenNumbers( 0 , 59);
    if (second < 10) {
    	time += '0';
    }
    time += second;

	return time;
}



exports.getLimitRandomTime = function(){
    var startYear = 2017 ;
    var endYear =  2017;

    var startMonth = 5;
    var endMonth = 8;

    var startDate = 1;
    var endDate = 28;


    var time = '';

    time += this.getRandomBetweenNumbers(startYear , endYear);
    time += '-';

    var month = this.getRandomBetweenNumbers(startMonth, endMonth);
    if (month < 10) {
        time += '0';
    }
    time += month;
    time += '-';

    var date = this.getRandomBetweenNumbers(startDate, endDate);
    if (date < 10) {
        time += '0';
    }
    time += date;
    time += ' ';


    var  hour = this.getRandomBetweenNumbers( 0 , 23);
    if (hour < 10) {
        time += '0';
    }
    time += hour;
    time += ':';

    var minute = this.getRandomBetweenNumbers( 0 , 59);
    if (minute < 10) {
        time += '0';
    }
    time += minute;
    time += ':';

    var second = this.getRandomBetweenNumbers( 0 , 59);
    if (second < 10) {
        time += '0';
    }
    time += second;

    return time;
}




//获取 从0 开始的随机数
exports.getRandom = function( end ){
	var Range = end - 0;   
	var Rand = Math.random();   
	return(0 + Math.round(Rand * Range));   
}




// 随机车牌号
exports.getRandomCarCode = function(){

    var cityCodeArr = ["浙" , "冀" ,"新" ,"京" ,"天" ,"闽" ,"黔" ,"云" ,"海"];
    var cityCodeArrLen = cityCodeArr.length;

    var codeArr = [ "1" ,"2" ,"3" ,"4" ,"5" ,"6" ,"7" ,"8" ,"9" ,"0" , "A" ,"B" ,"C" ,"D" ,"E" ,"F"  ];
    var codeArrLen = codeArr.length;

    //城市代码
    var cityCode = cityCodeArr[this.getRandom(cityCodeArrLen - 1)];
    var code = codeArr[this.getRandom(codeArrLen - 1)];

    var carCode = '';

	carCode += cityCode;
	carCode += code;
	carCode += this.getRandom(9);
	carCode += this.getRandom(9);
	carCode += this.getRandom(9);
	carCode += this.getRandom(9);
	return carCode;   
}


//随机获取数组数据
exports.getRandomByArray = function(array){
	var len = array.length;

    var item = array[this.getRandom(len - 1)];
    return item;
}






