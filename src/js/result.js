let resultId = null;

$(function () {
    let id = getUrlParameter('id');
    console.log('got view id : ' + id)
    setResultView(Number(id))
    resultId = id;
    $('#resultsList').DataTable();
});

function setResultView(id) {
    let uid;
    let dbClient = require('./../js/dbclient.js');
    dbClient.getRows('results', { 'id': id }, function (resultRow) {
        console.log('resultRow data : ' + JSON.stringify(resultRow))
        let result = resultRow.pop()
        $('#configName').html(result.configName)
        $('#browser').html(result.browser)
        $('#url').html(result.url)
        $('#projectName').html(result.projectName)
        $('#timeTaken').html(result.timeTaken)
        $('#passed').html(result.passed)
        $('#failed').html(result.failed)
        $('#skipped').html(result.skipped)
        uid = result.uid
    })
    setResultsView(uid)
}

function setResultsView(uid) {
    let dbClient = require('./../js/dbclient.js');
    dbClient.getRows('result', { "uid": uid }, function (results) {
        //console.log('got results details : '+ JSON.stringify(results));
        let htmlData = getResultsView(results);
        console.log('html data setup : ' + htmlData.join(''));
        if (htmlData != undefined && htmlData != []) {
            console.log('page set up for element : ' + $('#resultsView').html())
            $('#resultsView').append(htmlData.join(''));
            console.log('page set up for element : ' + $('#resultsView').html())
        }
    });
}

function getResultsView(results) {
    let resultsViewNode = [];
    if (results != undefined) {
        console.log('results view : ' + JSON.stringify(results));
        let imgHandler = require('./../js/core/imgHandler.js');
        results.forEach(row => {
            console.log('setting up view with row data : ' + JSON.stringify(row));
            if (row.screenShot == "true") {
                imgHandler.get(row.flowFileName, row.scenarioName, row.stepNumber, function (imgResult) {
                    let imgData = imgResult[0].imgString;
                    console.log("got img : " + imgData)
                    resultsViewNode = resultsViewNode.concat(getResultRow(row, imgData));
                });
            }
            else {
                console.log("got no img")
                resultsViewNode = resultsViewNode.concat(getResultRow(row));
            }
            //console.log('temp proj view : '+JSON.stringify(projectViewNode))
        });
    }
    //console.log('got html data : ' + projectViewNode)
    return resultsViewNode;
}

function getResultRow(result, screenshotData) {
    let nodes = [];
    let stat, msg
    if (result.status == true) {
        stat = '<span style="color : #006400">passed</span>'
        msg = '-'
    }
    else if (result.status == failed && result.failureMessage == null) {
        stat = '<span style="color : #925b12">skipped</span>'
        msg = '-'
    }
    else {
        stat = '<span style="color : #640f00">failed</span>'
        msg = result.failureMessage
    }

    nodes.push(`<tr>`)
    nodes.push(`<td>` + result.flowFileName.replace(/\d+/g, '') + `</td>`)
    nodes.push(`<td>` + result.scenarioName + `</td>`)
    nodes.push(`<td>` + result.stepNumber + `</td>`)
    nodes.push(`<td><code style="color: #925b12; font-size: 100%;">` + result.step + `</code></td>`)
    nodes.push(`<td>` + stat + `</td>`)
    nodes.push(`<td>` + msg + `</td>`)
    if (screenshotData)
        nodes.push(`<td><img src="` + screenshotData + `" alt="image"/></td>`)
    else 
        nodes.push(`<td>-</td>`)
    nodes.push(`</tr>`)
    //console.count(JSON.stringify(nodes))
    return nodes;
}