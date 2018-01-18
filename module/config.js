/*created by travis on 1/18/2018*/

//return  csv file name generated from current Date
exports.csvFileName = function(){
    var curDate =new Date();     
    var name = curDate.getUTCFullYear().toString();
    if (curDate.getUTCMonth()<10) name = name + '0';
        name += curDate.getUTCMonth().toString();
    if (curDate.getUTCDate()<10)  name += '0';
        name += curDate.getUTCDate().toString();
    if (curDate.getHours()<10)  name += '0';
        name += curDate.getHours().toString();
    if (curDate.getMinutes()<10)  name += '0';
        name += curDate.getMinutes().toString();
        // console.log(name);
    return name;
};

// Read the data of config.txt file
var configData = function(){
    var fs = require('fs');
    var configDt = [];

    require('fs').readFileSync('./config.txt').toString().split(/\s*\n\s*/).forEach(function (line) {
        var linedt = line.split(/\s*;\s*/);
        configDt.push(linedt[1]);
        // console.log(linedt[1]); 
    });

    configDt[5] = configDt[5].replace('"','');   //remove the " symbol from file location
    configDt[5] = configDt[5].replace('"','');   //remove the " symbol from file location
    return configDt;
};

// return the value of fsym from config.txt
exports.getFromSymbol = function(){
    return configData()[0];
};

// return the value of tsym from config.txt
exports.getToSymbol = function(){
    return configData()[1];
};

// return the value of limit from config.txt
exports.getLimit = function(){
    return configData()[2];
};

// return the value of aggregate from config.txt
exports.getAggregate = function(){
    return configData()[3];
}

// return the value of NameofExchange from config.txt
exports.getNameofExchange = function(){
    return configData()[4];
}

// return the folder name to store csv files from config.txt
exports.getFolderName = function(){
    return configData()[5];
};

//return Frequency from config.txt
exports.getFrequency = function(){
    return configData()[6];
}


// return Date from seconds
exports.getDateFromSecond = function(input){
       var epoch = new Date(0);
       epoch.setSeconds(parseInt(input));

        var yyyy = epoch.getFullYear().toString();
        var mm = (epoch.getMonth()+1).toString();
        var dd  = epoch.getDate().toString();

        var mmChars = mm.split('');
        var ddChars = dd.split('');
        // console.log(yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]));
        return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

};
// return Time from seconds
exports.getTimeFromSecond = function(input){
     var epoch = new Date(0);
       epoch.setSeconds(parseInt(input));
       var date = epoch.toISOString();
       date = date.replace('T', ' ');
       return date.split(' ')[1].replace(".000Z",'');
}


exports.getMode = function(){
    return configData()[7];
}