const imgUtil = require('base64-img');
const dbclient = require('../dbclient');

module.exports = {
    store: (resultId, flowName, scenarioName, stepNumber, path) => {
        let data;
        try {
            data = imgUtil.base64Sync(path);
        } catch (err) {
            console.log("unable to convert image to base64 : " + err)
        }
        if (data)
            dbclient.insertImagesRow(resultId, flowName, scenarioName, stepNumber, data);
    },

    storeAll: async (resultId, flowName, scenarioName, stepNumber, pathArr = []) => {
        pathArr.forEach(path => {
            let data = imgUtil.base64Sync(path);
            dbclient.insertImagesRow(resultId, flowName, scenarioName, stepNumber, data);
        });
    },

    get: (flowName, scenarioName, stepNumber, callback) => {
        dbclient.getRows('images', { 'flowName': flowName, 'scenarioName': scenarioName, 'stepNumber': stepNumber }, function (result) {
            callback(result);
        });
    },

    getAllWithResultId: (resultId, callback) => {
        dbclient.getRows('images', { 'resultId': resultId }, function (result) {
            callback(result);
        });
    }
}