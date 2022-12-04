dbClientApiPage = require('./../js/dbclient.js');
JSONEditorApiPage = require("./../js/jsoneditor.min.js");

tableApiCounter = 3;
tableApiArr = ['#locator-table', '#data-table', '#api-header-table'];
exportApiButtonArr = ['#locator-export-btn', '#data-export-btn', '#api-header-export-btn'];
tableAddApiRowButtonArr = ['.locator-table-add', '.data-table-add', '.api-header-table-add'];
tableRemoveApiRowButtonArr = ['.locator-table-remove', '.data-table-remove', '.api-header-table-remove'];
createApiProjectButton = '#create-project-button';
editorApiArr = ['#locatorEditor', '#dataEditor', '#apiEditor'];

container = document.getElementById('requestBody');

for (let index = 0; index < tableApiCounter; index++) {
    $(tableAddApiRowButtonArr[index]).click(function () {
        var $clone = $(tableApiArr[index]).find('tr.hide').clone(true).removeClass('hide table-line');
        $(tableApiArr[index]).find('table').append($clone.prop("hidden", false));
        $(exportApiButtonArr[index]).prop("disabled", false);
        $(createApiProjectButton).prop("disabled", true);
    });

    $(tableRemoveApiRowButtonArr[index]).click(function () {
        $(this).parents('tr').detach();
        $(exportApiButtonArr[index]).prop("disabled", false);
        $(createApiProjectButton).prop("disabled", true);
    });

    $(tableApiArr[index]).on("click", 'tr td', function () {
        $(exportApiButtonArr[index]).prop("disabled", false);
        $(createApiProjectButton).prop("disabled", true);
    });

    // A few jQuery helpers for exporting only
    jQuery.fn.pop = [].pop;
    jQuery.fn.shift = [].shift;

    $(exportApiButtonArr[index]).click(function () {
        console.log('tableArr[index] : ' + tableApiArr[index])
        var $rows = $(tableApiArr[index]).find("tr:not(:hidden)");
        var headers = [];
        var data = [];

        // Get the headers (add special header logic here)
        $($rows.shift()).find('th:not(:empty)').each(function () {
            headers.push($(this).text().toLowerCase());
        });

        // Turn all existing rows into a loopable array
        $rows.each(function () {
            var $td = $(this).find('td');
            var h = {};

            // Use the headers from earlier to name our hash keys
            headers.forEach(function (header, i) {
                h[header] = $td.eq(i).text();
            });
            console.log('val : ' + JSON.stringify(h))
            data.push(h);
        });

        // Output the result
        var flag = true;
        for (let member in data) {
            for (let field in data[member]) {
                if (data[member][field] == '') {
                    flag = false;
                    break;
                }
                if (!flag) {
                    break;
                }
            }
            if (!flag) {
                break;
            }
        }
        if (flag) {
            //console.log(JSON.stringify(data));
            $(editorApiArr[index]).val(JSON.stringify(data));
            $(exportApiButtonArr[index]).prop("disabled", true);
            $(createApiProjectButton).prop("disabled", false);
        }
        else {
            showAlert('alertbar', 'danger', 'can not save empty row')
            $(createApiProjectButton).prop("disabled", true)
        }
        flag = true;
    });

    $(createApiProjectButton).on('click', function () {
        if ($(exportApiButtonArr[0]).attr('disabled') == 'disabled') {
            $(createApiProjectButton).prop('disabled', false);
        }
        else {
            showAlert('alertbar', 'danger', 'Please save headers first ...')
            $(createApiProjectButton).prop('disabled', true);
        }
    });
}

function getSelected(nameSelect) {
    if (nameSelect) {
        let getOptionValue = document.getElementById("getOption").value;
        if (getOptionValue == nameSelect.value) {
            document.getElementById("notGetDivCheck").style.display = "none";
        }
        else {
            document.getElementById("notGetDivCheck").style.display = "block";
        }
    }
    else {
        document.getElementById("notGetDivCheck").style.display = "block";
    }
}

apiEditorOptions = {
    mode: 'code',
    modes: ['code', 'text'], // allowed modes
    onError: function (err) {
        alert(err.toString());
    },
    onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
    }
};
apiJson = '';
postApiEditor = new JSONEditorApiPage(container, apiEditorOptions, apiJson);

getAllApiHistoryRows()

function callApi() {
    console.log('post body : ' + postApiEditor.getText());
    let validation = validateInputNotEmpty('uri', 'alertbar', 'URL can not be empty.');
    if (validation) {
        saveRequest()
        var container = document.getElementById("responseBody");
        container.innerHTML = '';
        $('#api-processing').addClass('fa fa-spinner fa-spin');
        $('#responseCode').html('Status');
        let request = {
            httpMethod: $('#httpMethod').val(),
            uri: $('#uri').val(),
            requestBody: postApiEditor.getText(),
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
        requestBody: postApiEditor.getText(),
        acceptAllSslCert: $('#acceptAllSslCert').val(),
        headers: $('#apiEditor').val(),
        contentType: $('#contentType').val(),
        followRedirect: $('#followRedirect').val()
    }

    if (request.httpMethod == 'GET') {
        request.requestBody = '';
    }

    let time = new Date().getTime();
    dbClientApiPage.insertApiHistoryRow('history', time, request.httpMethod, request.uri, request.requestBody, request.acceptAllSslCert, request.headers, request.contentType, request.followRedirect);
}

function getAllApiHistoryRows() {
    $('#history').html('');
    dbClientApiPage.getAllData('apihistory', function (historyRows) {
        //console.log('got rows : '+ JSON.stringify(historyRows))
        historyRows.forEach(function (data) {
            let insertData = `
            <div class="list-item-content">
            <div class="list-item-title" style="word-break:break-all;">
            ${data.httpMethod} ${data.uri}
            </div>
            <div class="list-item-description content is-small"> 
            ${(new Date(data.date)).toLocaleString()}
            </div>
            </div>

            <div class="list-item-controls">
            <div class="buttons is-right">
        
            <button class="button">
            <span class="icon is-small">
            <i class="fa fa-arrow-right"></i>
            </span>
            </button>
            </div>
            </div>
            `;
            addHistoryRow(data.date, insertData);
        })
    });
}

function clearHistory() {
    dbClientApiPage.deleteAll('apihistory');
    getAllApiHistoryRows();
}

function setApiRequest(date) {
    $('#responseCode').html('Response will come here');
    $("#responseBody").html('');
    dbClientApiPage.getRows('apihistory', { 'date': date }, function (result) {
        let data = result[0];
        $('#httpMethod').val(data.httpMethod)
        if (data.httpMethod == 'GET') {
            document.getElementById("notGetDivCheck").style.display = "none";
            postApiEditor.setText('')
        }
        else {
            document.getElementById("notGetDivCheck").style.display = "block";
            postApiEditor.setText(data.requestBody)
        }
        $('#uri').val(data.uri)
        $('#acceptAllSslCert').val(data.acceptAllSslCert)
        $("#apiEditor").val(data.headers);
        if (data.headers != undefined && data.headers != "") {
            setTableData('#api-header-table', ['header key', 'header value'], JSON.parse(data.headers));
        } else {
            setTableData('#api-header-table', ['header key', 'header value'], []);
        }
        $('#contentType').val(data.contentType)
        $('#followRedirect').val(data.followRedirect)
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
            const formattedData = JSON.parse(data);
            const height = (data.split('\n').length * 16) + 32;
            console.log(`setting editor height as ${height}px`);
            var editor = new JSONEditorApiPage(container, options);
            editor.set(formattedData);
            $("#response-header").html("<code>" + headers + "</code>")
            container.style.height = "500px";
            container.style.display = "block";
        }
        else {
            container.innerHTML = `<iframe id="responseFrame" style="width: 100%; height:100%; border:none;"></iframe>`;
            document.getElementById("responseFrame").srcdoc = data;
            $("#response-header").html("<code>" + headers + "</code>")
            container.style.height = "500px";
            container.style.display = "block";
        }
        container.scrollIntoView({block: 'center'});
    }
    $('#api-processing').removeClass('fa fa-spinner fa-spin');
}