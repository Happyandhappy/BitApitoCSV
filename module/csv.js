/*created by travis on 1/18/2018*/
//initializing 
var config = require('./config');
var request = require('request');
var stringify = require('csv-stringify');
var fs = require('fs');

exports.saveApitoCSV = function(url,apiKind){
    var api_data = "";

    if (apiKind == 1){
        var folderRoot = config.getFolderName() + '/FirstApi';                           //get the folder name for first api from config.txt
        
    } else {
        var folderRoot = config.getFolderName() + '/SecondApi';                          //get the folder name for second api from config.txt
    }

    if (!fs.existsSync(folderRoot)){ fs.mkdirSync(folderRoot);}                          // if the folder doesn't exist, create it
    var fileLoc = folderRoot + '/' + config.csvFileName() + '.csv';                      // create filename and its location

    var apiUrl = url + config.getFrequency() + "?fsym=" + config.getFromSymbol() + "&tsym=" + config.getToSymbol() +
                 "&limit=" + config.getLimit() + "&aggregate=" + config.getAggregate() + 
                 "&e=" + config.getNameofExchange();
    

    request( apiUrl, function (error, response, body) {                                  // send request of api
        api_data = JSON.parse(body);                                                     // Json parse
        
        if (apiKind ===1){
            //Process in first Api                                                                  
            if (api_data.Response ==="Error") return;                                       
            //initialize of csv header 
            var content = [["TradingPair","Date","Time","Frequency","Close","High","Low","Open","VolumnFrom","VolumnTo"]];
            
            //Generate the content array of csv from json data
            for (var index = 0; index < api_data.Data.length; index++){
                content = content.concat(
                    [[
                         config.getFromSymbol() + "-" + config.getToSymbol(),
                         config.getDateFromSecond(api_data.Data[index].time),
                         config.getTimeFromSecond(api_data.Data[index].time),
                         config.getFrequency(),
                         api_data.Data[index].close,
                         api_data.Data[index].high,
                         api_data.Data[index].low,
                         api_data.Data[index].open,
                         api_data.Data[index].volumefrom,
                         api_data.Data[index].volumeto
                    ]]
                );
            }
            // add extra data to csv content    
            var extra_data = [   
                                 ["Api Url",apiUrl],
                                 ["FromSymbol","ToSymbol","Frequency","Limit","Aggregate","NameofExchange(e)","TimeFrom","TimeTo"],
                                 [   config.getFromSymbol() ,
                                        config.getToSymbol(), 
                                        config.getFrequency(),
                                        config.getLimit(),
                                        config.getAggregate(),
                                        config.getNameofExchange(),
                                        config.getDateFromSecond(api_data.TimeFrom) + " " + config.getTimeFromSecond(api_data.TimeFrom),
                                        config.getDateFromSecond(api_data.TimeTo) + " " + config.getTimeFromSecond(api_data.TimeFrom)
                                 ],
                                 [""]
                            ];
            content = extra_data.concat(content);                                        
        }
        else {
                //Generate csv content array from second api
                var content = [
                    ["",],
                    ["ApiUrl",apiUrl],
                    [""],
                    ["Date", "Bpi"]
                ];                                                                       // set header content

                var keys = Object.keys(api_data.bpi);                                    // get the key array of json

                for (var index = 0; index < keys.length; index++){
                    content=content.concat([
                                                [
                                                    keys[index],
                                                    api_data.bpi[keys[index]] 
                                                ]
                                           ]);                                           // key:value pair to content
                }

                content = content.concat(                                                // add extra data to content
                    [["disclaimer",api_data.disclaimer]],       
                    [["updated Time",api_data.time.updated]],
                    [["updatedISO Time",api_data.time.updatedISO]]
                );
        }
            // console.log(content);
            writeToFile(fileLoc,content);                                                //write the content to csv file    
    }); 
}

function writeToFile(filename,content){
    stringify(content, function(err, output) {
            fs.writeFile(filename , output, 'utf8', function(err) {
                if (err) {                                                              //if error occurs, print error
                        console.log('Some error occured in ' + filename +
                         ' - file either not saved or corrupted file saved.');
                } else {
                    console.log('It\'s saved in ' + filename );
                }
            });
    });
}