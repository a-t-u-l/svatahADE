if(dbClient == undefined){
    dbClient = require('./../js/dbclient.js');
}

getAllApiHistoryRows()

function callApi() {
    console.log('post body : ' + posteditor.getText());
    let validation = validateInputNotEmpty('uri', 'alertbar', 'URL can not be empty.');
    if (validation) {
        saveRequest()
        var container = document.getElementById("responseBody");
        container.innerHTML = '';
        $('#buttonLoader').addClass('fa fa-spinner fa-spin');
        $('#responseCode').html('Status');
        let request = {
            httpMethod: $('#httpMethod').val(),
            uri: $('#uri').val(),
            requestBody: posteditor.getText(),
            acceptAllSslCert: $('#acceptAllSslCert').val(),
            headers: $('#apiEditor').val(),
            contentType: $('#contentType').val(),
            followRedirect: $('#followRedirect').val()
        };

        console.log('request : ' + JSON.stringify(request))

        $.ajax({
            type: "POST",
            url: 'http://localhost:8095/apiclient',
            data: JSON.stringify(request),
            contentType: "application/json;charset=utf-8",
            success: function (gotResponse) {
                setResponse(gotResponse.status, gotResponse.body);
            },
            error: function (gotResponse) {
                setResponse(gotResponse.status, gotResponse.responseText);
            },
            dataType: 'json'
        });
        getAllApiHistoryRows()
    }
}

function saveRequest() {
    let request = {
        httpMethod: $('#httpMethod').val(),
        uri: $('#uri').val(),
        requestBody: posteditor.getText(),
        acceptAllSslCert: $('#acceptAllSslCert').val(),
        headers: $('#apiEditor').val(),
        contentType: $('#contentType').val(),
        followRedirect: $('#followRedirect').val()
    }

    if(request.httpMethod == 'GET'){
        request.requestBody = '';
    }

    let time = new Date().getTime();
    dbClient.insertApiHistoryRow('history', time, request.httpMethod, request.uri, request.requestBody, request.acceptAllSslCert, request.headers, request.contentType, request.followRedirect);
}

function getAllApiHistoryRows() {
    $('#history').html('');
    dbClient.getAllData('apihistory', function (historyRows) {
        //console.log('got rows : '+ JSON.stringify(historyRows))
        historyRows.forEach(function (data) {
            let insertData = '' + (new Date(data.date)).toLocaleString() + '<br/>' + data.httpMethod + '<br/>' + data.uri
            addHistoryRow(data.date, insertData);
        })
    });
}

function clearHistory(){
    dbClient.deleteAll('apihistory');
    getAllApiHistoryRows();
}

function setApiRequest(date) {
    $('#responseCode').html('Response will come here');
    $("#responseBody").html('');
    dbClient.getRows('apihistory', { 'date': date }, function (result) {
        let data = result[0];
        //console.log('setting data : '+ JSON.stringify(data))
        $('#httpMethod').val(data.httpMethod)
        if(data.httpMethod=='GET'){
            document.getElementById("notGetDivCheck").style.display = "none";
            posteditor.setText('')
        }
        else{
            document.getElementById("notGetDivCheck").style.display = "block";
            posteditor.setText(data.requestBody)
        }
        $('#uri').val(data.uri)
        $('#acceptAllSslCert').val(data.acceptAllSslCert)
        $("#apiEditor").val(data.headers);
        if(data.headers != undefined && data.headers != ""){
            setTableData('#api-header-table', ['header key', 'header value'], JSON.parse(data.headers));
        } else{
            setTableData('#api-header-table', ['header key', 'header value'], []);
        }
        $('#contentType').val(data.contentType)
        $('#followRedirect').val(data.followRedirect)
    });
}

function setResponse(status, data) {
    $('#responseCode').html('Status : ' + status);
    var container = document.getElementById("responseBody");
    container.style.display = "none";
    var options = {
        mode: 'code',
        modes: ['text', 'code'], // allowed modes
        onError: function (err) {

        },
        onModeChange: function (newMode, oldMode) {
        }
    };
    // get json
    if (typeof data == 'string') {
        if (!data.startsWith('<')) {
            var editor = new JSONEditor(container, options);
            editor.setText(data);
            container.style.display = "block";
        }
        else {
            var editor = new JSONEditor(container, options);
            editor.setText('{"message":"got html block in response. Response must be a JSON string."}');
            container.style.display = "block";
        }
    }
    $('#buttonLoader').removeClass('fa fa-spinner fa-spin');
}