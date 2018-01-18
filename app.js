/*created by travis on 1/18/2018*/
'use strict';
    function generateCSV(){
        var apitocsv = require('./module/csv');
        var url = "https://min-api.cryptocompare.com/data/histo";
        apitocsv.saveApitoCSV(url,1);
        url = "https://api.coindesk.com/v1/bpi/historical/close.json";
        apitocsv.saveApitoCSV(url,2);    
    }

    var config = require("./module/config");
    // var count = 0
    if (config.getMode() === "continuous"){
        var interval  = 60000;
        switch(config.getFrequency()) {
            case "day":
                interval = 86400000;
                break;
            case "hour":
                interval = 3600000;
                break;
            default:
                var interval  = 60000;
        }
        generateCSV();
        setInterval( function() { generateCSV();}, interval);

    }else if (config.getMode() === "onceoff"){
        generateCSV();
    }
    
