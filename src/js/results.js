function viewResult(id) {
    window.location.href = "./result.html?id=" + id;
}

function setResultsView() {
    let dbClient = require('./../js/dbclient.js');
    dbClient.getAllData('results', function (results) {
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
        console.log('results view : ' + JSON.stringify(results))
        results.forEach(row => {
            console.log('setting up view with row data : ' + JSON.stringify(row))
            resultsViewNode = resultsViewNode.concat(getResultRow(row));
            //console.log('temp proj view : '+JSON.stringify(projectViewNode))
        });
    }
    //console.log('got html data : ' + projectViewNode)
    return resultsViewNode;
}

function getResultRow(result) {
    let nodes = [];

    nodes.push(`<tr>`)
    nodes.push(`<td><a href="" onclick='viewResult(` + result.id + `)'>` + result.projectName + `</a></td>`)
    nodes.push(`<td>` + result.url + `</td>`)
    nodes.push(`<td>` + result.startTime + `</td>`)
    nodes.push(`<td>` + result.endTime + `</td>`)
    nodes.push(`<td>` + result.passed + `</td>`)
    nodes.push(`<td>` + result.failed + `</td>`)
    nodes.push(`<td>` + result.skipped + `</td>`)
    nodes.push(`</tr>`)
    //console.count(JSON.stringify(nodes))
    return nodes;
}