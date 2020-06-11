let projectId = null;
let dbClient = require('./../js/dbclient.js');

$(function () {
    let id = getUrlParameter('id');
    console.log('got view id : ' + id)
    setProjectView(Number(id))
    projectId = id;
});

function setProjectView(id) {
    dbClient.getRows('project', { 'id': id }, function (projectRow) {
        //console.log('project data : ' + JSON.stringify(projectRow))
        let project = projectRow.pop()
        setConfigViewForProject(project.name)
        setLocatorTableData(project.locatorFile)
        setFlowsViewForProject(project.name)
        setApiViewForProject(project.name)
    })
}

function setConfigViewForProject(projectName) {
    dbClient.getRows('config', { 'projectName': projectName }, function (configRow) {
        let config = configRow.pop()
        $('#configName').val(config.name)
        $('#browser').val(config.browser)
        $('#threadCount').val(config.threadCount)
        $('#url').val(config.url)
        $('#name').val(projectName)
        $('#takeStepScreenshot').val(config.takeStepScreenshot)
        setDataTableData(config.dataFile)
    })
}

function setLocatorTableData(locatorData) {
    if (locatorData != undefined && locatorData != "") {
        setTableData('#locator-table', ['locator identifier', 'locator details'], JSON.parse(locatorData));
    } else {
        setTableData('#locator-table', ['locator identifier', 'locator details'], []);
    }
}

function setDataTableData(varData) {
    if (varData != undefined && varData != "") {
        setTableData('#data-table', ['variable name', 'variable value'], JSON.parse(varData));
    } else {
        setTableData('#data-table', ['variable name', 'variable value'], []);
    }
}