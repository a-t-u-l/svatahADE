let dbclient = require('./../js/dbclient.js');

let Shepherd = require('shepherd.js')
const tour = new Shepherd.Tour({
    defaultStepOptions: {
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true,
    },
    styleVariables: {
        shepherdButtonBorderRadius: '1px',
        shepherdElementBorderRadius: '1px',
        shepherdHeaderBackground: '#ffffff',
        shepherdTextBackground: '#c3c9c4',
        shepherdThemePrimary: '#0a7222',
        useDropShadow: true
    }
});

$(function () {
    dbclient.searchData('settings', 'uid', 1, function (result) {
        if (result != null) {
            let res = result.pop()
            if (res.takeTour) {
                projectTour()
                dbclient.updateRow('settings', { 'uid': 1 }, { 'takeTour': false })
            }
        }
        else {
            projectTour()
            dbclient.insertSettingsRow(1, choosenTheme, false);
        }
    })
})

function projectTour() {
    tour.addStep({
        id: 'proj-tour-step-1',
        text: 'Define your unique project name here. Once saved project name can not be changed.',
        attachTo: {
            element: '#name',
            on: 'bottom'
        },
        classes: 'example-step-extra-class',
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'proj-tour-step-2',
        text: 'Define your unique config name here. Once saved config name can not be changed.',
        attachTo: {
            element: '#configName',
            on: 'bottom'
        },
        classes: 'example-step-extra-class',
        buttons: [
            {
                text: 'Back',
                action: tour.back
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'proj-tour-step-3',
        text: 'Define project URL here. This URL is the starting point for all of the flows.',
        attachTo: {
            element: '#url',
            on: 'bottom'
        },
        classes: 'example-step-extra-class',
        buttons: [
            {
                text: 'Back',
                action: tour.back
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'proj-tour-step-4',
        text: 'Choose the browser to run the tests on.',
        attachTo: {
            element: '#browser',
            on: 'bottom'
        },
        classes: 'example-step-extra-class',
        buttons: [
            {
                text: 'Back',
                action: tour.back
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'proj-tour-step-5',
        text: 'Specify whether you want to capture screenshot at each step or not.',
        attachTo: {
            element: '#takeStepScreenshot',
            on: 'bottom'
        },
        classes: 'example-step-extra-class',
        buttons: [
            {
                text: 'Back',
                action: tour.back
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'proj-tour-step-6',
        text: 'Choose number of flows which can run in parallel.',
        attachTo: {
            element: '#threadCount',
            on: 'bottom'
        },
        classes: 'example-step-extra-class',
        buttons: [
            {
                text: 'Back',
                action: tour.back
            },
            {
                text: 'Close',
                action: tour.next
            }
        ]
    });

    tour.start();
}

function setFlowsViewForProject(projectName) {
    dbclient.getRows('flows', { 'projectName': projectName }, function (flowRows) {
        let flowViewNode = [];
        let flowNamesNode = [];

        //console.log('got rows : '+ JSON.stringify(flowRows))
        flowRows.forEach(data => {
            //console.log('got flow row : '+ JSON.stringify(data))
            flowViewNode = flowViewNode.concat(getFlowViewRow(data.flowFileName, data.flowFile, data.id));
            flowNamesNode = flowNamesNode.concat(getFlowNamesList(data.flowFileName));
        });
        //console.log('got flow html : '+ JSON.stringify(flowViewNode.join('')))
        if (flowViewNode != undefined && flowViewNode != []) {
            $('#api-repo').after(flowViewNode.join(''));
            $('#flowList').html(flowNamesNode.join(''));
        }
    });
}

function setApiViewForProject(projectName) {
    dbclient.getRows('api', { 'projectName': projectName }, function (apiRows) {
        let apiViewNode = [];
        //console.log('got rows : ' + JSON.stringify(apiRows))
        $('#apiProjectData').val(JSON.stringify(apiRows));
        apiRows.forEach(data => {
            //console.log('got api row : '+ JSON.stringify(data))
            apiViewNode = apiViewNode.concat(getApiViewRow(data.id, data.name, data.httpMethod, data.uri));
        });
        //console.log('got flow html : '+ JSON.stringify(flowViewNode.join('')))
        if (apiViewNode != undefined && apiViewNode != []) {
            $('#ApiView').html(apiViewNode.join(''));
        }
    });
}

function getApiViewRow(id, name, method, url) {
    console.log('generating api view nodes ...')
    let nodes = [];
    nodes.push(`<tr>`);
    nodes.push(`<td>` + name + `</td>`);
    nodes.push(`<td>` + method + `</td>`);
    nodes.push(`<td>` + url + `</td>`);
    nodes.push(`<td>`);
    nodes.push(`<span class="table-add" style="padding:10px;">`);
    nodes.push(`<button rel="tooltip" class="edit-btn button is-primary is-light" name="editApi" onclick="editApi(` + id + `)" data-toggle="tooltip" data-placement="top" title="edit">`);
    nodes.push(`<i class="fa fa-edit"></i>`);
    nodes.push(`</button>`);
    nodes.push(`</span>`);
    nodes.push(`<span class="table-add" style="padding:10px;">`);
    nodes.push(`<button rel="tooltip" class="remove-btn button is-danger is-light" name="deleteApi" onclick="deleteApi(` + id + `)" data-toggle="tooltip" data-placement="top" title="edit">`);
    nodes.push(`<i class="fa fa-remove"></i>`);
    nodes.push(`</button>`);
    nodes.push(`</span>`);
    nodes.push(`</td>`);
    nodes.push(`</tr>`);

    return nodes;
}

function getFlowNamesList(flowFileName) {
    let nodes = [];
    let nameWithoutSpaces = flowFileName.replace(/ /g, '');
    nodes.push(`<li class="panel-block" style="border-top: 1px dotted grey">`);
    nodes.push(`<a class="nav-link" id="` + nameWithoutSpaces + `-tab" href="#` + nameWithoutSpaces + `">` + flowFileName + `</a>`)
    nodes.push(`</li>`)
    return nodes;
}

function getFlowViewRow(flowFileName, flow, id) {
    //console.log('generating nodes ...')
    let nodes = [];
    let flowId = flowFileName.replace(/\s/g, '-');
    let nameWithoutSpaces = flowFileName.replace(/ /g, '');
    //console.log(' flow id = '+flowId)
    nodes.push(`<div class="tab-pane" id="` + nameWithoutSpaces + `">`);
    nodes.push(`<div id="` + flowId + `-flow">`);
    nodes.push(`<div style="border: 1px solid #c5c5c5; border-radius: 4px; padding: 10px;">` + flowFileToHtml(flow) + `</div>`);
    nodes.push(`</div>`);
    nodes.push(`<div style="padding-top:10px">`);
    nodes.push(`<span class="table-add">`);
    nodes.push(`<button rel="tooltip" class="edit-btn button is-info is-light" name="editFlow" onclick="editFlow(` + id + `)" title="edit">`);
    nodes.push(`<i class="fa fa-edit"></i>`);
    nodes.push(`</button>`);
    nodes.push(`</span>`);
    nodes.push(`<span class="table-add" style="padding-left: 5px;">`);
    nodes.push(`<button rel="tooltip" class="remove-btn button is-danger is-light" name="deleteFlow" onclick="deleteFlow(` + id + `)" title="edit">`);
    nodes.push(`<i class="fa fa-remove"></i>`);
    nodes.push(`</button>`);
    nodes.push(`</span>`);
    nodes.push(`</div>`);
    nodes.push(`</div>`);

    return nodes;
}

function flowFileToHtml(flow) {
    let flowFileParsed = `<table class="table is-fullwidth"><tbody><tr><td style="border-color: #fff;border-top:0px;padding: 8px 7px;">` + flow;
    flowFileParsed = flowFileParsed.replace(/scenario\s*:.*/gi, function (x) { return `<mark style="background-color:#ffeb0096; font-size : 1.1em;">` + x + `</mark>` });
    flowFileParsed = flowFileParsed.replace(/story\s*:.*/gi, function (x) { return `<mark style="background-color:#ffe7b9; font-size : 1.1em;">` + x + `</mark>` });
    flowFileParsed = flowFileParsed.replace(/compose\s*:.*/gi, function (x) { return `<mark style="background-color:#dbffb6; font-size : 1.1em;">` + x + `</mark>` });
    flowFileParsed = flowFileParsed.replace(/test\s*:.*/gi, function (x) { return `<mark style="background-color:#b4ffde; font-size : 1.1em;">` + x + `</mark>` });
    flowFileParsed = flowFileParsed.replace(/var\s*:\s*(\S+)/gi, function (x) { return `<span style="color:#82ff7c">` + x + `</span>` });
    flowFileParsed = flowFileParsed.replace(/[+](.*?)[+]/gi, function (x) { return `<span style="color:#246b1f">` + x + `</span>` });
    flowFileParsed = flowFileParsed.replace(/[*](.*?)[*]/gi, function (x) { return `<span style="color:#873c06">` + x + `</span>` });
    flowFileParsed = flowFileParsed.replace(/[~](.*?)[~]/gi, function (x) { return `<span style="color:#056d87">` + x + `</span>` });
    flowFileParsed = flowFileParsed.replace(/\n/g, `</td></tr><tr><td style="border-color: #fff;border-top:0px;padding: 8px 7px;">`);
    flowFileParsed = flowFileParsed + "</td></tr></tbody></table>";
    flowFileParsed = flowFileParsed.replace(/~/gi, "");
    flowFileParsed = flowFileParsed.replace(/\+/gi, "");
    flowFileParsed = flowFileParsed.replace(/\*/gi, "");
    return flowFileParsed;
}

function surroundWithMarkUp(flow, matchex, repex, prepend, append) {
    console.log('got flow to mod : ' + flow)
    var match = flow.match(matchex)
    console.log('got match : ' + flow)
    var res = flow.replace(match, prepend + match + append);
    console.log('got replaced : ' + flow)
    return res.replace(repex, '')
}

function runTest() {
    let validation = validateInputNotEmpty('name', 'alertbar', 'Project name can not be empty.');
    if (validation) {
        showAlert('alertbar', 'info', 'Starting project validation ...')
        let data = JSON.parse($('#dataEditor').val());
        //console.log('got data : '+ data);
        let dataMap = {};
        for (let i = 0; i < data.length; i++) {
            let varObj = data[i];
            //console.log('var obj : '+varObj);
            let varKey = varObj['variable name'];
            let varVal = varObj['variable value'];
            dataMap[varKey] = varVal;
            //console.log(varKey + ' : ' + varVal);
        }

        let locatorData = JSON.parse($('#locatorEditor').val());
        //console.log('got data : '+ data);
        let locatorMap = {};
        for (let i = 0; i < locatorData.length; i++) {
            let varObj = locatorData[i];
            //console.log('var obj : '+varObj);
            let varKey = varObj['locator identifier'];
            let varVal = varObj['locator details'];
            locatorMap[varKey] = varVal;
            //console.log(varKey + ' : ' + varVal);
        }

        let flowFlieName = $('#flowFileName').val();
        let flowFile = $('#flowEditor').html();
        //console.log('flow : ' + flowFile);
        //console.log('stripped flow : '+ flowFile.replace(/<[\/]p><p>/gi, '\n').replace(/<[^>]*>/g, ''))
        flowFile = flowFile.replace(/<[\/]p><p>/gi, '\n').replace(/<[\/]p><br><p>/gi, '\n\n').replace(/<[^>]*>/g, '');
        console.log('flow : ' + flowFile);
        let floObj = {}
        floObj[flowFlieName] = flowFile;

        let apiData = JSON.parse($('#apiProjectData').val());

        let apiObj = {}
        if (Array.isArray(apiData)) {
            apiData.forEach(api => {
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

        let request = {
            "url": $('#url').val(),
            "browser": $('#browser').val(),
            "threadCount": $('#threadCount').val(),
            "executionId": 1,
            "takeStepScreenshot": $('#takeStepScreenshot').val(),
            "variableDataMap": dataMap,
            "locatorTagAndLocatorMap": locatorMap,
            "systemPropertyMap": { "screenWidth": "1920", "screenHeight": "1080" },
            "scenarioFiles": floObj,
            "dependenceFiles": {},
            "apiRequestMap": apiObj
        }

        console.log('request : ' + JSON.stringify(request));

        $.ajax({
            type: "POST",
            url: 'http://localhost:8095/validate',
            data: JSON.stringify(request),
            contentType: "application/json;charset=utf-8",
            success: function (gotResponse) {
                console.log(gotResponse);
                if (gotResponse.length == 0)
                    showAlert('alertbar', 'success', 'The flow is valid.')
                else
                    showAlert('alertbar', 'danger', mapFlowValidationResponseToTable(JSON.stringify(gotResponse)))
            },
            error: function (gotResponse) {
                showAlert('alertbar', 'danger', gotResponse.responseJSON.body)
                console.log(gotResponse);
            },
            dataType: 'json'
        });
    }
}

function addApiToProject() {
    let validation = validateInputNotEmpty('name', 'alertbar', 'Project name can not be empty.');
    if (validation) {
        let request = {
            name: $('#apiname').val(),
            httpMethod: $('#httpMethod').val(),
            uri: $('#uri').val(),
            requestBody: posteditor.getText(),
            acceptAllSslCert: $('#acceptAllSslCert').val(),
            headers: $('#apiEditor').val(),
            contentType: $('#contentType').val(),
            followRedirect: $('#followRedirect').val()
        };
        $('#save-api-button').addClass('fa fa-spinner fa-spin');
        let dbclient = require('./../js/dbclient.js');
        dbclient.searchData('api', 'name', request.name, function (result) {
            if (result != null && result.length != 0) {
                console.log('got search result : ' + JSON.stringify(result))
                if (result[0].projectName == $('#name').val())
                    dbclient.updateRow('api', { 'id': result[0].id }, request)
                else
                    dbclient.insertApiRow(request.name, $('#name').val(), request.httpMethod, request.uri, request.requestBody, request.acceptAllSslCert, request.headers, request.contentType, request.followRedirect);
            }
            else {
                console.log('got search result : ' + JSON.stringify(result))
                dbclient.insertApiRow(request.name, $('#name').val(), request.httpMethod, request.uri, request.requestBody, request.acceptAllSslCert, request.headers, request.contentType, request.followRedirect);
            }
        })
        setApiViewForProject($('#name').val())

        $('#apiname').val('')
        $('#httpMethod').val('GET')
        $('#uri').val('')
        posteditor.setText('')
        $('#acceptAllSslCert').val('false')
        $('#contentType').val('json')
        $('#followRedirect').val('false')
        setTableData('#api-table', ['header key', 'header value'], [])

        $('#save-api-button').removeClass('fa fa-spinner fa-spin');
        hideAddApiView();
    }
}

function editApi(id) {
    $('#responseCode').html('Response will come here');
    $("#responseBody").html('');
    dbclient.getRows('api', { 'id': id }, function (result) {
        let apiRequest = result[0];
        console.log('setting api : ' + JSON.stringify(apiRequest))
        $('#httpMethod').val(apiRequest.httpMethod)
        if (apiRequest.httpMethod == 'GET') {
            document.getElementById("notGetDivCheck").style.display = "none";
            posteditor.setText('')
        }
        else {
            document.getElementById("notGetDivCheck").style.display = "block";
            posteditor.setText(apiRequest.requestBody)
        }
        $('#apiname').val(apiRequest.name),
            $('#uri').val(apiRequest.uri)
        $('#acceptAllSslCert').val(apiRequest.acceptAllSslCert)
        $("#apiEditor").val(apiRequest.headers);
        if (apiRequest.headers != undefined && apiRequest.headers != "") {
            setTableData('#api-table', ['header key', 'header value'], JSON.parse(apiRequest.headers));
        } else {
            setTableData('#api-table', ['header key', 'header value'], []);
        }
        $('#contentType').val(apiRequest.contentType)
        $('#followRedirect').val(apiRequest.followRedirect)
    });
    showAddApiView();
}

function deleteApi(id) {
    dbclient.deleteRow('api', { 'id': id })
    setApiViewForProject($('#name').val());
    showAlert('alertbar', 'success', 'successfully removed the API')

}

function addFlowToProject() {
    let validation = validateInputNotEmpty('name', 'alertbar', 'Project name can not be empty.');
    let flowNameValidation;
    if (validation) {
        flowNameValidation = validateInputNotEmpty('flowFileName', 'alertbar', 'Flow file name can not be empty.');
    }
    if (validation && flowNameValidation) {
        $('#save-flow-button').addClass('fa fa-spinner fa-spin');
        let dbclient = require('./../js/dbclient.js');
        let flowFileName = $('#flowFileName').val()
        let flowFile = $('#flowEditor').html();
        //console.log('flow : ' + flowFile);
        //console.log('stripped flow : '+ flowFile.replace(/<[\/]p><p>/gi, '\n').replace(/<[^>]*>/g, ''))
        flowFile = flowFile.replace(/<[\/]p><p>/gi, '\n').replace(/<[\/]p><br><p>/gi, '\n\n').replace(/<[^>]*>/g, '');
        console.log('flow : ' + flowFile);
        dbclient.searchData('flows', 'flowFileName', flowFileName, function (result) {
            if (result != null && result.length != 0) {
                console.log('got search result : ' + JSON.stringify(result))
                if (result[0].projectName == $('#name').val())
                    dbclient.updateRow('flows', { 'id': result[0].id }, { 'flowFile': flowFile })
                else
                    dbclient.insertFlowRow(flowFile, flowFileName, $('#name').val());
            }
            else {
                console.log('got search result : ' + JSON.stringify(result))
                dbclient.insertFlowRow(flowFile, flowFileName, $('#name').val());
            }
        })
        setFlowsViewForProject($('#name').val());
        $('#flowEditor').html('')
        $('#flowFileName').val('')
        showAlert('alertbar', 'success', 'successfully saved ' + flowFileName)
        $('#save-flow-button').removeClass('fa fa-spinner fa-spin');
    }
}

function editFlow(id) {
    dbclient.getRows('flows', { 'id': id }, function (result) {
        let flowRow = result[0];
        console.log('setting flow : ' + JSON.stringify(flowRow));
        $('#flowFileName').val(flowRow.flowFileName);
        $('#' + flowRow.flowFileName.replace(/ /g, '')).removeClass('is-active');
        let flowFile = flowRow.flowFile.replace(/\n\n/gi, '<\/p><br><p>').replace(/\n/gi, '<\/p><p>');
        console.log('flow file : ' + JSON.stringify(flowFile));
        $('#flowEditor').html(flowFile);
        $('#new-flow').addClass('is-active');
    });
}

function deleteFlow(id) {
    dbclient.deleteRow('flows', { 'id': id })
    setFlowsViewForProject($('#name').val());
    showAlert('alertbar', 'success', 'successfully removed the flow')
}

function createProject() {
    let nameVal = validateInputNotEmpty('name', 'alertbar', 'Project name can not be empty.');
    let confNameVal = validateInputNotEmpty('configName', 'alertbar', 'Config name can not be empty.');
    if (nameVal && confNameVal) {
        let request = {
            httpMethod: $('#httpMethod').val(),
            uri: $('#uri').val(),
            requestBody: posteditor.getText(),
            acceptAllSslCert: $('#acceptAllSslCert').val(),
            headers: $('#dataEditor').val(),
            contentType: $('#contentType').val(),
            followRedirect: $('#followRedirect').val()
        };

        $('#buttonLoader').addClass('fa fa-spinner fa-spin');
        let dbclient = require('./../js/dbclient.js');

        dbclient.searchData('project', 'name', $('#name').val(), function (result) {
            if (result != null && result.length != 0) {
                console.log('updating project : ' + $('#name').val())
                dbclient.updateRow('config', { 'name': result[0].configName },
                    {
                        'browser': $('#browser').val(),
                        'threadCount': $('#threadCount').val(),
                        'url': $('#url').val(),
                        'takeStepScreenshot': $('#takeStepScreenshot').val(),
                        'dataFile': $('#dataEditor').val()
                    }
                )
                dbclient.updateRow('project', { 'id': result[0].id },
                    {
                        'locatorFile': $('#locatorEditor').val()
                    }
                )
            } else {
                dbclient.insertConfigRow($('#configName').val(), $('#browser').val(), $('#threadCount').val(), $('#url').val(),
                    $('#name').val(), $('#takeStepScreenshot').val(), $('#dataEditor').val(), '1920x1080');
                dbclient.insertProjectRow($('#name').val(), $('#locatorEditor').val(), $('#configName').val());
                //dbclient.insertFlowRow($('#flowEditor').val(), $('#flowFileName').val(), $('#name').val());
            }
            $('#buttonLoader').removeClass('fa fa-spinner fa-spin');
            window.location.href = "./project.html";
        })
    }
}
