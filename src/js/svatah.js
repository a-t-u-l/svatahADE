let dbClient = require('./../js/dbclient.js');

let choosenTheme;

function validateInputNotEmpty(inputId, divContainerId, alertMsg) {
  let validation = true;
  if ($('#' + inputId).val().length == 0) {
    validation = false;
    //$('#'+inputId).focus();
    $('#' + divContainerId).html(`<div id="alertrow" class="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>Error! </strong> `+ alertMsg + `
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>`);
  }
  return validation;
}

function showAlert(divContainerId, alertType, alertMsg) {
  $('#' + divContainerId).html(`<div id="alertrow" class="alert alert-` + alertType + ` alert-dismissible fade show" role="alert">
                                        <strong>`+ alertType + `! </strong> ` + alertMsg + `
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>`);

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

$(function () {
  // const customTitlebar = require('custom-electron-titlebar');
  // let titlebar = new customTitlebar.Titlebar({
  //   backgroundColor: customTitlebar.Color.fromHex('#444')
  // });
  // titlebar.updateTitle('Svatah IDE');
  // titlebar.updateIcon('./src/icon.ico');

  dbClient.getRows('settings', { 'uid': 1 }, function (userSetting) {
    console.log('got theme : ' + userSetting[0].darkmode)
    choosenTheme = userSetting[0].darkmode;
    if (choosenTheme == 'dark') {
      $('#bod').removeClass('white-content')
      $('#flowEditorContainer').addClass('trumbowyg-dark')
    }
    else {
      $('#bod').addClass('white-content')
      $('#flowEditorContainer').removeClass('trumbowyg-dark')
    }
  });
});

$(function () {
  if ($('#bod').hasClass('white-content')) {
    $('#bod').removeClass('white-color-text')
    $('#darkmodeicon').html('toggle_off');
  } else {
    $('#bod').addClass('white-color-text')
    $('#darkmodeicon').html('toggle_on');
  }
  $('.theme').on('click', function (event) {
    event.preventDefault();
    $(this).toggleClass('active');
    $('#bod').toggleClass('white-content')
    $('#bod').toggleClass('white-color-text')
    $('#flowEditorContainer').toggleClass('trumbowyg-dark')
    if ($('#bod').hasClass('white-content')) {
      choosenTheme = 'light';
      $('#darkmodeicon').html('toggle_off');
    } else {
      choosenTheme = 'dark';
      $('#darkmodeicon').html('toggle_on');
    }
    dbClient.searchData('settings', 'uid', 1, function (result) {
      if (result != null) {
        dbClient.updateRow('settings', { 'uid': 1 }, { 'darkmode': choosenTheme })
      }
      else {
        dbClient.insertSettingsRow(1, choosenTheme, false);
      }
    })
    $('#darkmode').removeClass('active');
    //console.log('choosen theme : ' + choosenTheme);
  });
});

$(function () {
  $("#sidebar").hover(function () {
    $(this).addClass("sidebar-hover");
  }, function () {
    $(this).removeClass("sidebar-hover");
  });
})

function addResultToTable(resultObj) {

}