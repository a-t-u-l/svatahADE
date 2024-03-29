dbClient = require('./../js/dbclient.js');

$(document).ready(function () {
    setProjectView();
});

function setProjectView() {
    dbClient.getAllData('project', function (projects) {
        let projectData = [];
        let projDataArr = [];
        projects.forEach(row => {
            let projRow = {
                project: '',
                config: ''
            }
            projRow.project = row;
            console.log('got proj row name : ' + row.name)
            dbClient.getRows('config', { 'projectName': row.name }, function (config) {
                projRow.config = config
            })
            projectData.push(projRow)
        });
        projDataArr = getProjectViewArr(projectData);
        $('#projectList').DataTable({
            data: projDataArr,
            columns: [
                { title: "View" },
                { title: "Name" },
                { title: "URL" },
                { title: "Config" },
                { title: "Browser" },
                { title: "Execute" },
                { title: "Remove" }
            ]
        });
        document.getElementById('projectList').style = "";
    });
}

function getProjectViewArr(projects) {
    let projectViewNode = new Array();
    console.log(Array.isArray(projectViewNode))
    if (projects != undefined) {
        //console.log('proj view : '+JSON.stringify(projects))
        projects.forEach(row => {
            //console.log('setting up view with row data : ' + JSON.stringify(row.config[0]))
            projectViewNode.push(getProjectRowArr(row.project, row.config[0]));
            //console.log('temp proj view : '+JSON.stringify(projectViewNode))
        });
    }
    console.log('got Arr data : ' + projectViewNode)
    console.log(Array.isArray(projectViewNode))
    return projectViewNode;
}

function getProjectRowArr(project, config) {
    let nodes = [];

    nodes.push(`<button class="button is-info is-light" onclick="viewProject(` + project.id + `)"><i class="fa fa-eye"></i></button>`)
    nodes.push(project.name)
    nodes.push(config.url)
    nodes.push(config.name)
    nodes.push(config.browser)
    nodes.push(`<button rel="tooltip" title="execute" onclick="executeProject(` + project.id + `)" class="button is-primary is-light"><i class="fa fa-play"></i></button>`)
    nodes.push(`<button class="button is-danger is-light"  onclick="deleteProject(` + project.id + `)"><i class="fa fa-remove"></i></button>`)
    //console.count(JSON.stringify(nodes))
    return nodes;
}

function executeProject(id) {

    dbClient.searchData('project', 'id', id, function (result) {
        let project = result.pop()
        showAlert('alertbar', 'info', 'Starting project validation and execution ...')
        dbClient.getRowsWithCallbackArg('config', { 'projectName': project.name }, project, function (confResult, project) {
            if (Array.isArray(confResult))
                project['config'] = confResult.pop()
            dbClient.getRowsWithCallbackArg('api', { 'projectName': project.name }, project, function (apiResult, project) {
                project['api'] = apiResult
                dbClient.getRowsWithCallbackArg('flows', { 'projectName': project.name }, project, function (flowsResult, project) {
                    project['flows'] = flowsResult
                    executeProj(project)
                })
            })
        })
    });
}

function executeProj(project) {
    console.log('executing project : ' + JSON.stringify(project))
    let data = JSON.parse(project.config.dataFile);
    let dataMap = {};
    for (let i = 0; i < data.length; i++) {
        let dataObj = data[i];
        //console.log('var obj : '+varObj);
        let varKey = dataObj['variable name'];
        let varVal = dataObj['variable value'];
        dataMap[varKey] = varVal;
        //console.log(varKey + ' : ' + varVal);
    }

    let locatorData = JSON.parse(project.locatorFile)
    //console.log('got data : '+ data);
    let locatorMap = {};
    for (let i = 0; i < locatorData.length; i++) {
        let locObj = locatorData[i];
        //console.log('var obj : '+varObj);
        let varKey = locObj['locator identifier'];
        let varVal = locObj['locator details'];
        locatorMap[varKey] = varVal;
        //console.log(varKey + ' : ' + varVal);
    }

    let floObj = {}
    if (Array.isArray(project.flows)) {
        project.flows.forEach(flow => {
            //console.log('flow obj : ' + JSON.stringify(flow))
            let varKey = flow['flowFileName'];
            let varVal = flow['flowFile'];
            floObj[varKey] = varVal;
        }
        )
    }

    let apiObj = {}
    if (Array.isArray(project.api)) {
        project.api.forEach(api => {
            let apiRequest = {
                "httpMethod": api.httpMethod,
                "uri": api.uri,
                "requestBody": api.requestBody,
                "acceptAllSslCert": api.acceptAllSslCert,
                "headers": api.headers,
                "contentType": api.contentType,
                "followRedirect": api.followRedirect
            };
            apiObj[api.name] = apiRequest;
        })
    }

    try {
        let request = {
            "projectName": project.name,
            "configName": project.configName,
            "url": project.config.url,
            "browser": project.config.browser,
            "threadCount": project.config.threadCount,
            "executionId": getRandomNumber(),
            "takeStepScreenshot": project.config.takeStepScreenshot,
            "variableDataMap": dataMap,
            "apiRequestMap": apiObj,
            "locatorTagAndLocatorMap": locatorMap,
            "systemPropertyMap": { "screenWidth": "1920", "screenHeight": "1080" },
            "scenarioFiles": floObj,
            "dependenceFiles": {}
        };

        console.log('request : ' + JSON.stringify(request));
        runProject(request)
    }
    catch (err) {
        console.log(err.message)
    }
}

function getRandomNumber() {
    let min = 1;
    let max = 50000;
    let random = Math.floor(Math.random() * (+max - +min)) + +min
    return random;
}

function runProject(request) {
    let startTime = new Date()
    $.ajax({
        type: "POST",
        url: 'http://localhost:8095/execute',
        data: JSON.stringify(request),
        contentType: "application/json;charset=utf-8",
        success: function (gotResponse) {
            console.log(gotResponse);
            if (Number(gotResponse.status) == 200) {
                let exeId = gotResponse.additionalInfo.split(':').pop();
                let uid = request.projectName + '-' + exeId
                console.log('execution id : ' + exeId)
                request.executionId = exeId
                request.startTime = startTime
                dbClient.insertRow('executionHistory', request)
                $.ajax({
                    type: "GET",
                    url: 'http://localhost:8095/result?executionId=' + Number(exeId),
                    success: function (res) {
                        console.log('result : ' + JSON.stringify(res))
                        let passed = 0, failed = 0, skipped = 0
                        res.forEach(row => {
                            if (row.status == true)
                                passed++
                            else if (row.status == false && row.failureMessage != null)
                                failed++
                            else
                                skipped++

                            let result = {
                                uid: uid,
                                projectName: request.projectName,
                                configName: request.configName,
                                status: row.status,
                                flowFileName: row.flowFileName,
                                scenarioName: row.scenarioName,
                                step: row.step,
                                stepNumber: row.stepNumber,
                                failureMessage: row.failureMessage,
                                screenShot: request.takeStepScreenshot,
                                failureStackTrace: row.failureStackTrace,
                            }
                            let imgHandler = require('./../js/core/imgHandler.js');
                            console.log("got screenshot path : " + row.screenShot);
                            if (typeof row.screenShot === 'string')
                                imgHandler.store(uid, row.flowFileName, row.scenarioName, row.stepNumber, row.screenShot);
                            dbClient.insertRow('result', result);
                        })
                        let endTime = new Date()
                        const diffTime = Math.abs(startTime.getTime() - endTime.getTime());
                        const timeTaken = Math.ceil(diffTime / (1000));
                        dbClient.insertResultsRow(uid, request.projectName, request.configName, request.url, request.browser, startTime.toLocaleString(), endTime.toLocaleString(), timeTaken, passed, failed, skipped);
                    },
                    error: function (res) {
                        console.log('error while fetching result : ' + res);
                    },
                    dataType: 'json'
                })
            }
            showAlert('alertbar', 'success', 'check results section.')
        },
        error: function (gotResponse) {
            showAlert('alertbar', 'danger', mapFlowValidationResponseToTable(gotResponse.responseJSON.body))
            console.log(gotResponse);
        },
        dataType: 'json'
    });
}

function viewProject(id) {
    //window.location.href = "./viewproject.html?id=" + id;
    getView('view-project', id);
}

function deleteProject(id) {
    dbClient.searchData('project', 'id', id, function (result) {
        let project = result[0]
        dbClient.deleteRow('project', { 'id': project.id })
        dbClient.deleteRow('config', { 'projectName': project.name })
        dbClient.deleteRow('api', { 'projectName': project.name })
        dbClient.deleteRow('flows', { 'projectName': project.name })
    })
    document.getElementById('col-part-2').className = '';
    document.getElementById('col-part-2').innerHTML = '';
    templator.projectPage();
    setProjectView();
    showAlert('alertbar', 'success', 'successfully deleted the project.');
}