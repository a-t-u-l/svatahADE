const db = require('electron-db');
const electron = require('electron');
const location = (electron.app || electron.remote.app).getPath('userData');
console.log(location);

module.exports = {
    initDB: () => {
        console.log('in db client')

        db.createTable('settings', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('project', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('executionHistory', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('results', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('result', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('api', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('apihistory', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('config', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

        db.createTable('flows', location, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
        console.log('init db done ...')
    },

    insertRow: (tableName, obj) => {
        db.insertTableContent(tableName, location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    },

    insertConfigRow: (name, browser, threadCount, url, projectName, takeStepScreenshot, dataFile, screenDimension) => {
        let obj = new Object();
        obj.name = name;
        obj.browser = browser;
        obj.threadCount = threadCount;
        obj.url = url;
        obj.projectName = projectName;
        obj.takeStepScreenshot = takeStepScreenshot;
        obj.dataFile = dataFile;
        obj.screenDimension = screenDimension;

        console.log('got obj : ' + JSON.stringify(obj));
        db.insertTableContent('config', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

    },

    insertProjectRow: (name, locatorFile, configName) => {
        let obj = new Object();
        obj.name = name;
        obj.locatorFile = locatorFile;
        obj.configName = configName;

        db.insertTableContent('project', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    },

    insertResultsRow: (uid, projectName, configName, url, browser, startTime, endTime, timeTaken, passed, failed, skipped) => {
        let obj = new Object();
        obj.uid = uid;
        obj.projectName = projectName;
        obj.configName = configName;
        obj.url = url;
        obj.browser = browser;
        obj.startTime = startTime;
        obj.endTime = endTime;
        obj.timeTaken = timeTaken;
        obj.passed = passed;
        obj.failed = failed;
        obj.skipped = skipped;

        db.insertTableContent('results', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    },

    insertApiRow: (name, projectName, httpMethod, uri, requestBody, acceptAllSslCert, headers, contentType, followRedirect) => {
        let obj = new Object();
        obj.name = name
        obj.projectName = projectName
        obj.httpMethod = httpMethod
        obj.uri = uri
        obj.requestBody = requestBody
        obj.acceptAllSslCert = acceptAllSslCert
        obj.headers = headers
        obj.contentType = contentType
        obj.followRedirect = followRedirect

        db.insertTableContent('api', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    },

    insertApiHistoryRow: (section, date, httpMethod, uri, requestBody, acceptAllSslCert, headers, contentType, followRedirect) => {
        let obj = new Object();
        obj.section = section
        obj.date = date
        obj.httpMethod = httpMethod
        obj.uri = uri
        obj.requestBody = requestBody
        obj.acceptAllSslCert = acceptAllSslCert
        obj.headers = headers
        obj.contentType = contentType
        obj.followRedirect = followRedirect

        db.insertTableContent('apihistory', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    },

    insertFlowRow: (flowFile, flowFileName, projectName) => {
        let obj = new Object();
        obj.flowFile = flowFile;
        obj.flowFileName = flowFileName;
        obj.projectName = projectName;

        db.insertTableContent('flows', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })

    },

    insertSettingsRow: (uid, darkmode, takeTour) => {
        let obj = new Object();
        obj.uid = uid;
        obj.darkmode = darkmode;
        obj.takeTour = takeTour;

        db.insertTableContent('settings', location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        })
    },

    getAllData: (tableName, callback) => {
        db.getAll(tableName, location, (succ, data) => {
            console.log("Success all data : " + succ);
            //console.log("Data result : " + JSON.stringify(data));
            callback(data);
        });
    },

    deleteRow: (tableName, where) => {
        db.deleteRow(tableName, location, where, (succ, msg) => {
            console.log('delete success :' + succ);
            console.log(msg);
        });
    },

    deleteAll: (tableName) => {
        db.clearTable(tableName, location, (succ, msg) => {
            console.log(msg);
        });
    },

    updateRow: (tableName, where, set) => {
        db.updateRow(tableName, location, where, set, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        });
    },

    getRows: (tableName, where, callback) => {
        db.getRows(tableName, location, where, (succ, result) => {
            // succ - boolean, tells if the call is successful
            console.log('for ' + tableName + ' where ' + JSON.stringify(where))
            console.log("Successful for row : " + succ);
            //console.log("Successfully got rows : " + JSON.stringify(result));
            if (succ)
                callback(result);
        })
    },

    getRowsWithCallbackArg: (tableName, where, arg, callback) => {
        db.getRows(tableName, location, where, (succ, result) => {
            // succ - boolean, tells if the call is successful
            console.log('for ' + tableName + ' where ' + JSON.stringify(where) + ". Successful for row : " + succ)
            console.log("Successfully got rows : " + JSON.stringify(result));
            if (succ)
                callback(result, arg);
            else
                console.log('not found.');

        })
    },

    searchData: (tableName, field, term, callback) => {
        db.search(tableName, location, field, term, (succ, data) => {
            if (succ) {
                console.log(data);
                callback(data);
            }
            else {
                console.log('not found.');
                callback(null);
            }
        });
    }
}