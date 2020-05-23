const os = navigator.platform;
console.log('running on platform : ' + os)
if (os.toUpperCase().indexOf('WIN') !== -1) {
  $('#bod').addClass('ps')
}

document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    let $notification = $delete.parentNode;

    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification);
    });
  });
});

function removeNotification() {
  $('.notification').remove();
}

function showAddApiView() {
  $('#apiViewSection').show();
}

function hideAddApiView() {
  $('#apiViewSection').hide();
}

function openModal(id) {
  $('#' + id).addClass('is-active');
}

function closeModal(id) {
  $('#' + id).removeClass('is-active');
}

function validateInputNotEmpty(inputId, divContainerId, alertMsg) {
  let validation = true;
  if ($('#' + inputId).val().length == 0) {
    validation = false;
    //$('#'+inputId).focus();
    $('#' + divContainerId).html(`<div id="alertrow" class="notification is-danger" role="alert">
                                        <button class="delete"  onclick="removeNotification()"></button>
                                        <strong>Error! </strong> `+ alertMsg + `
                                      </div>`);
  }
  return validation;
}

function showAlert(divContainerId, alertType, alertMsg) {
  $('#' + divContainerId).html(`<div id="alertrow" class="notification is-` + alertType + ` is-light" role="alert"><button class="delete" onclick="removeNotification()"></button>`
    + alertMsg + ` </div>`);

}

function addHistoryRow(date, data) {
  $('#history').prepend(`<li style="border-top: 1px dotted #3a3938;"><a onClick="setApiRequest(` + date + `)">` + data + `</a></li>`);
}

function setTableData(tableId, headers, data) {
  console.log('id : ' + tableId)
  console.log('headers : ' + JSON.stringify(headers))
  console.log('data : ' + JSON.stringify(data))
  jQuery.fn.shift = [].shift;
  var rows = $(tableId).find("tr:not(:hidden)");
  let headerRow
  $(rows.shift()).find('th:not(:empty)').each(function () {
    headerRow = $(this);
  });

  rows.each(function () {
    if ($(this) != headerRow)
      $(this).detach();
  });
  data.forEach(function (row) {
    var $clone = $(tableId).find('tr.hide').clone(true).removeClass('hide table-line');
    headers.forEach(function (header, i) {
      $clone.find('td').eq(i).text(row[header])
    });
    $(tableId).find('table').append($clone.prop("hidden", false));
  });
}

function getUrlParameter(sParam) {
  let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
}

// $(function () {
//   $("#sidebar").hover(function () {
//     $(this).addClass("sidebar-hover");
//   }, function () {
//     $(this).removeClass("sidebar-hover");
//   });
// })

function addResultToTable(resultObj) {

}


function setApiRequestFromJsonObject(data) {
  //console.log('setting data : '+ JSON.stringify(data))
  $('#httpMethod').val(data.httpMethod)
  if (data.httpMethod == 'GET') {
    document.getElementById("notGetDivCheck").style.display = "none";
    posteditor.setText('')
  }
  else {
    document.getElementById("notGetDivCheck").style.display = "block";
    posteditor.setText(data.requestBody)
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
}

function importLocatorsRepository() {
  try {
    let data = $('#locatorImportJson').val()
    console.log(data)
    if (data != undefined && data != "") {
      setTableData('#locator-table', ['locator identifier', 'locator details'], JSON.parse(data));
    } else {
      setTableData('#locator-table', ['locator identifier', 'locator details'], []);
    }
    $("#locatorEditor").val(data);
    closeModal('importModal');
  } catch (error) {
    showAlert('alertbar', 'danger', error)
  }
}

function exportLocatorsRepository() {
  let locatorData = JSON.parse($('#locatorEditor').val());
  $("#locatorExportJson").val(JSON.stringify(locatorData, null, 2));
  openModal('exportLocatorModal');
}

function importDataRepository() {
  try {
    let data = $('#dataImportJson').val()
    if (data != undefined && data != "") {
      setTableData('#data-table', ['variable name', 'variable value'], JSON.parse(data));
    } else {
      setTableData('#data-table', ['variable name', 'variable value'], []);
    }
    $("#dataEditor").val(data);
    closeModal('importDataModal');
  } catch (error) {
    showAlert('alertbar', 'danger', error)
  }
}

function exportDataRepository() {
  let dataMap = JSON.parse($('#dataEditor').val());
  $("#dataExportJson").val(JSON.stringify(dataMap, null, 2));
  openModal('exportDataModal');
}

function exportAPI() {
  let request = {
    httpMethod: $('#httpMethod').val(),
    uri: $('#uri').val(),
    requestBody: posteditor.getText(),
    acceptAllSslCert: $('#acceptAllSslCert').val(),
    headers: $('#apiEditor').val(),
    contentType: $('#contentType').val(),
    followRedirect: $('#followRedirect').val()
  }

  $('#apiRequestExportJson').val(JSON.stringify(request, null, 2))
}

function importAPI() {
  try {
    let request = JSON.parse($('#apiRequestImportJson').val());
    setApiRequestFromJsonObject(request);
    closeModal('importModal')
  } catch (error) {
    showAlert('alertbar', 'danger', error)
  }
}

function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function mapFlowValidationResponseToTable(flowErrorDetails) {
  console.log("error : " + flowErrorDetails.replace(/(\r\n|\n|\r)/g,""))
  console.log(typeof flowErrorDetails)
  let htmlData = `<table class="table-sm"></tr>`
  if (typeof flowErrorDetails == 'string')
    flowErrorDetails = JSON.parse(flowErrorDetails.replace(/(\r\n|\n|\r)/g,""))
  flowErrorDetails.forEach(errorRow => {
    htmlData = htmlData.concat(getErrorRows(errorRow))
  });
  htmlData = htmlData.concat("</table>")
  return htmlData
}

function getErrorRows(dataSet) {
  let rows = "";
  Object.entries(dataSet).forEach(([k, v]) => {
    rows = rows.concat("<tr>")
      .concat("<td>").concat(k).concat("</td>")
      .concat("<td>").concat(v).concat("</td>")
      .concat("</tr>")
  })
  return rows;
}