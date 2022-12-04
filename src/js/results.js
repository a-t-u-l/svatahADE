dbClientResults = require('./../js/dbclient.js');

$(document).ready(function () {
    setResultsView();
});

function viewResult(id) {
    //window.location.href = "./result.html?id=" + id;
    getView('result', id);
}

function setResultsView() {
    console.log("setting up result")
    dbClientResults.getAllData('results', function (results) {
        console.log('got results details : ' + JSON.stringify(results));
        let resultsData = getResultsView(results);
        console.log('html data setup : ' + resultsData);
        if (resultsData != undefined && resultsData != []) {
            $('#resultsList').DataTable({
                data: resultsData,
                order: [[0, 'asc']],
                columns: [
                    { title: "Sl" },
                    { title: "Project Name" },
                    { title: "URL" },
                    { title: "Start Time" },
                    { title: "End Time" },
                    { title: "Passed" },
                    { title: "Failed" },
                    { title: "Skipped" }
                ]
            });
            document.getElementById('resultsList').style = "";
            //console.log('page set up for element : ' + $('#resultsView').html())
        }
    });
}

function getResultsView(results) {
    let resultsViewNode = [];
    if (results != undefined) {
        //console.log('results view : ' + JSON.stringify(results))
        let rowNum = results.length;
        results.forEach(row => {
            //console.log('setting up view with row data : ' + JSON.stringify(row))
            resultsViewNode.push(getResultRow(rowNum, row));
            //console.log('temp proj view : '+JSON.stringify(projectViewNode))
            rowNum--;
        });
    }
    //console.log('got html data : ' + projectViewNode)
    return resultsViewNode;
}

function getResultRow(rowNum, result) {
    let nodes = [];

    nodes.push(rowNum)
    nodes.push(`<button class="button is-text is-fullwidth" onclick="viewResult(` + result.id + `)">` + result.projectName + `</button>`)
    nodes.push(result.url)
    nodes.push(result.startTime)
    nodes.push(result.endTime)
    nodes.push(result.passed)
    nodes.push(result.failed)
    nodes.push(result.skipped)
    //console.count(JSON.stringify(nodes))
    return nodes;
}