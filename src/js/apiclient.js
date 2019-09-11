if (dbClient == undefined) {
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
        console.log('setting timeout : ' + Number($('#timeout').val()) * 1000)

        $.ajax({
            type: "POST",
            url: 'http://localhost:8095/apiclient',
            data: JSON.stringify(request),
            contentType: "application/json;charset=utf-8",
            success: function (gotResponse, status, jqXHR) {
                setResponse(gotResponse.status, gotResponse.body, jqXHR.getAllResponseHeaders());
            },
            error: function (gotResponse) {
                setResponse(gotResponse.status, gotResponse.responseText, gotResponse.getAllResponseHeaders());
            },
            dataType: 'json',
            timeout: Number($('#timeout').val()) * 1000
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

    if (request.httpMethod == 'GET') {
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
            let insertData = '<code>' + (new Date(data.date)).toLocaleString() + '<br/><span style="color:#92ca59;">' + data.httpMethod
                + '</span><br/><span style="color:#17a2b8;">' + data.uri + '</span></code>'
            addHistoryRow(data.date, insertData);
        })
    });
}

function clearHistory() {
    dbClient.deleteAll('apihistory');
    getAllApiHistoryRows();
}

function setApiRequest(date) {
    $('#responseCode').html('Response will come here');
    $("#responseBody").html('');
    dbClient.getRows('apihistory', { 'date': date }, function (result) {
        let data = result[0];
        setApiRequestFromJsonObject(data)
    });
}

function setResponse(status, data) {
    setResponse(status, data, "")
}

function setResponse(status, data, headers) {
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
    headers = headers.replace(/(?:\r\n|\r|\n)/g, '<br>')
    if (typeof data == 'string') {
        if (!data.startsWith('<')) {
            var editor = new JSONEditor(container, options);
            editor.setText(data);
            $("#response-header").html("<code>" + headers + "</code>")
            container.style.display = "block";
        }
        else {
            container.innerHTML = '<iframe id="responseFrame" style="width: 100%; height:100%; border:none;"></iframe>'
            document.getElementById("responseFrame").srcdoc = data
            $("#response-header").html("<code>" + headers + "</code>")
            container.style.display = "block";
        }
    }
    $('#buttonLoader').removeClass('fa fa-spinner fa-spin');
}