let dbClient = require('./../js/dbclient.js');

let choosenTheme;

$(function () {
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