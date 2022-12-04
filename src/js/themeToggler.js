dbClient = require('./../js/dbclient.js');

$(function () {
    dbClient.getRows('settings', { 'uid': 1 }, function (userSetting) {
      console.log('got theme : ' + userSetting[0].darkmode)
      let choosenTheme = userSetting[0].darkmode;

      if (choosenTheme == 'dark') {
        $('body').removeClass('light');
        $("body").addClass("dark");

        $('#flowEditorContainer').addClass('trumbowyg-dark');

        $('#toggle-dark-mode').removeClass('dark-mode-off')
        $('#toggle-dark-mode').addClass('dark-mode-on')
        $('#dark-mode-icon').removeClass('fa-toggle-off')
        $('#dark-mode-icon').addClass('fa-toggle-on')

        let darkLink = document.getElementById('dark-theme');
        if (!darkLink) {
          darkLink = document.createElement('link');
          darkLink.rel = 'stylesheet';
          darkLink.id = 'dark-theme';
          darkLink.href = './../css/bulma-dark.css'
          document.head.appendChild(darkLink);
        }
      }
      else {
        $("body").removeClass("dark")
        $("body").addClass("light")
        $('#flowEditorContainer').removeClass('trumbowyg-dark');

        $('#toggle-dark-mode').removeClass('dark-mode-on')
        $('#toggle-dark-mode').addClass('dark-mode-off')
        $('#dark-mode-icon').removeClass('fa-toggle-on')
        $('#dark-mode-icon').addClass('fa-toggle-off')

        let darkLink = document.getElementById('dark-theme');
        if (darkLink) {
          darkLink.remove();
        }
      }
    });
  });

  function toggleDarkMode() {
    let choosenTheme;
    if ($('#toggle-dark-mode').hasClass('dark-mode-off')) {
      choosenTheme = 'dark';
      $('#flowEditorContainer').addClass('trumbowyg-dark')
      $('#toggle-dark-mode').removeClass('dark-mode-off')
      $('#toggle-dark-mode').addClass('dark-mode-on')
      $('#dark-mode-icon').removeClass('fa-toggle-off')
      $('#dark-mode-icon').addClass('fa-toggle-on')
      $("body").removeClass("light")
      $("body").addClass("dark")
      let darkLink = document.getElementById('dark-theme');
      if (!darkLink) {
        darkLink = document.createElement('link');
        darkLink.rel = 'stylesheet';
        darkLink.id = 'dark-theme';
        darkLink.href = './../css/bulma-dark.css'
        document.head.appendChild(darkLink);
      }
    } else if ($('#toggle-dark-mode').hasClass('dark-mode-on')) {
      choosenTheme = 'light';
      $('#flowEditorContainer').removeClass('trumbowyg-dark')
      $('#toggle-dark-mode').removeClass('dark-mode-on')
      $('#toggle-dark-mode').addClass('dark-mode-off')
      $('#dark-mode-icon').removeClass('fa-toggle-on')
      $('#dark-mode-icon').addClass('fa-toggle-off')
      $("body").removeClass("dark")
      $("body").addClass("light")
      let darkLink = document.getElementById('dark-theme');
      if (darkLink) {
        darkLink.remove();
      }
    }
    dbClient.searchData('settings', 'uid', 1, function (result) {
      if (result != null) {
        dbClient.updateRow('settings', { 'uid': 1 }, { 'darkmode': choosenTheme })
      }
      else {
        dbClient.insertSettingsRow(1, choosenTheme, false);
      }
    })
  }