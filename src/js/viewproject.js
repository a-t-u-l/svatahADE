require("./../js/trumbowyg.js");
dbClientViewProj = require('./../js/dbclient.js');

projectId = null;

JSONEditorViewProj = require("./../js/jsoneditor.min.js");

scriptSourceViewProj = (function(scripts) {
    var scripts = document.getElementsByTagName('script'),
           script = scripts[scripts.length - 1];
   if (script.getAttribute.length !== undefined) {
      return script.src
   }
   return script.getAttribute('src', -1)
}());

console.log("scr source : "+ scriptSourceViewProj);

$(function () {
    let id = getParameterByName("id", scriptSourceViewProj)
    console.log('got view id : ' + id)
    setProjectView(Number(id))
    projectId = id;
});

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$('#apiname').on('focus', function (event) {
    event.preventDefault();
    $('#save-api-button').attr('disabled', false);
});

$('#flowEditor').trumbowyg({
    resetCss: false,
    autogrowOnEnter: false,
    svgPath: './../css/img/trumbowyg-icons.svg',
    hideButtonTexts: true,
    btns: [
        ['fullscreen']
    ]
});

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

options = {
    mode: 'code',
    modes: ['code', 'text'], // allowed modes
    onError: function (err) {
        alert(err.toString());
    },
    onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
    }
};
json = '';
posteditor = new JSONEditorViewProj(document.getElementById('requestBody'), options, json);

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
        let $rows = $(tableApiArr[index]).find("tr:not(:hidden)");
        let headers = [];
        let data = [];

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
        let flag = true;
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
            console.log(JSON.stringify(data));
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
        if ($(exportApiButtonArr[0]).attr('disabled') == 'disabled' &&
            $(exportApiButtonArr[1]).attr('disabled') == 'disabled' &&
            $(exportApiButtonArr[2]).attr('disabled') == 'disabled' &&
            $('#save-api-button').attr('disabled') == 'disabled') {
            $(createApiProjectButton).prop('disabled', false);
        }
        else if($(createApiProjectButton).attr('disabled') != 'disabled') {
            
        }
        else {
            showAlert('alertbar', 'danger', 'Please save repositories first ...')
            $(createApiProjectButton).prop('disabled', true);
        }
    });
}

$(document).ready(function () {
    {
        let locatorRows = $('#locator-table').find('tr:not(:empty)');
        let dataRows = $('#data-table').find('tr:not(:empty)');
        $("#locatorEditor").val(JSON.stringify(getFieldVal(locatorRows)));
        $("#dataEditor").val(JSON.stringify(getFieldVal(dataRows)));
    }
});

function getFieldVal($rows) {
    var headers = [];
    var data = [];
    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
    });
    //console.log('headers : '+ JSON.stringify(headers));
    // Turn all existing rows into a loopable array
    $rows.each(function () {
        var $td = $(this).find('td');
        var h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach(function (header, i) {
            if ($td.eq(i).text() != "")
                h[header] = $td.eq(i).text();
        });
        if (!$.isEmptyObject(h))
            data.push(h);
    });
    return data;
}

$('#flowEditor').textcomplete([
    { // actions
        id: 'intent',
        words: ["open", "opens", "navigate", "navigates", "forward", "go forward", "clicks on forward button",
            "back", "go back", "clicks on back button", "refresh", "refreshes", "reload", "reloads",
            "switch to new window", "switches to new window", "switch to new tab", "switches to new tab",
            "switch to frame", "switches to frame", "close other windows", "closes other windows",
            "clicks and holds", "click and hold", "context click", "context clicks", "double click", "double clicks",
            "key up", "keys up", "key down", "keys down", "release", "releases",
            "validate title", "validates title", "verifyTitle", "verify title",
            "move to element", "moves to element", "move over element", "moves over element", "move to element center", "moves to element center",
            "move to element and click", "moves to element and click", "move over element and click", "moves over element and click",
            "switch to main window", "switches to main window", "switch to main tab", "switches to main tab",
            'clicks', 'click', 'clears', 'clear', 'get text', 'copy text', 'save text', 'getText', 'types', 'type',
            'submits', 'click enter', 'submit', 'dismiss alert', 'dismisses alert', 'dismissAlert', 'accept alert',
            'accepts alert', 'acceptAlert', 'waits', 'sleep', 'sleeps', 'waiting', 'wait', 'assert selected', 'check selected', 'is selected',
            'assertSelected', 'assert not selected', 'is not selected', 'assertNotSelected', 'assert displayed', 'isDisplayed',
            'is displayed', 'assertDisplayed', 'assert not displayed', 'is not displayed', 'assertNotDisplayed', 'assert enabled',
            'is enabled', 'is not disabled', 'assertEnabled', 'assert disabled', 'is disabled', 'is not enabled', 'assertDisabled',
            'assert element present', 'is element present', 'assertElementPresent', 'assert alert present', 'is alert present', 'assertAlertPresent',
            'assert alert not present', 'is alert not present', 'assertAlertNotPresent', 'validate text', 'validates text', 'verifyText',
            'verify text', 'validateText', 'contains text', 'validate contains text', 'verify contains text', 'verifyContainsText',
            'validateContainsText', 'validate tag name', 'verifyTagName', 'verify tag name', 'validateTagName', 'validate attribute value',
            'verifyAttributeValue', 'verify attribute value', 'validateAttributeValue', 'validate location', 'verifyLocation', 'verify location',
            'validateLocation', 'validate dimension', 'verifyDimension', 'verify dimension', 'validateDimension', 'validate rectangle', 'verifyRectangle',
            'verify rectangle', 'validateRectangle', 'accept the alert and validate alert text', 'accept the alert and validate displayed text',
            'acceptAndValidateAlertText', 'reject the alert and validate alert text', 'reject the alert and validate displayed text',
            'rejectAndValidateAlertText', 'invoke', 'call', 'hit', 'invoke without cookies', 'call without cookies', 'hit without cookies',
            'selectByVisibleText', 'select by visible text', 'select by shown text', 'select', 'selectByIndex', 'select by index',
            'selectByValue', 'select by value', 'select by sent value', 'deselectAll', 'deselect all', 'remove all selections',
            'deselectByVisibleText', 'deselect by visible text', 'deselect by shown text', 'deselect', 'deselectByIndex', 'deselect by index',
            'deselectByValue', 'deselect by value', 'deselect by sent value', 'assertMultipleSelectionSupported',
            'assert multiple selection is supported', 'validate multiple selection is supported', 'assertMultipleSelectionNotSupported',
            'assert multiple selection is not supported', 'validate multiple selection is not supported', 'scrollIntoView', 'scroll into view',
            'scroll to view', 'scrollToBottom', 'scroll to bottom', 'scroll to page bottom', 'scroll to bottom of the page', 'scrollToTop',
            'scroll to top', 'scroll to page top', 'scroll to top of the page', 'explicitWaitForElementPresence', 'wait for the presence', "waits for the presence",
            'explicitWaitForElementVisibility', 'wait for the visibility', "waits for the visibility"],
        match: /\+\b(\w{1,})$/,
        search: function (term, callback) {
            callback($.map(this.words, function (word) {
                return word.indexOf(term) === 0 ? word : null;
            }));
        },
        index: 1,
        replace: function (word) {
            return '+' + word + '+ ';
        }
    },

    { // actions
        id: 'identity',
        words: function () {
            let wordArr = [];
            let locatorString = $("#locatorEditor").val();
            //console.log('locator : '+ locatorString);
            if (locatorString != null && locatorString != '') {
                let locators = JSON.parse(locatorString);
                if (Array.isArray(locators)) {
                    locators.forEach(function (item, index) {
                        wordArr.push(item['locator identifier']);
                    });
                }
                else {
                    console.log('locator set not defined');
                }
            }
            return wordArr;
        },
        match: /\~\b(\w{1,})$/,
        search: function (term, callback) {
            callback($.map(this.words(), function (word) {
                return word.indexOf(term) === 0 ? word : null;
            }));
        },
        index: 1,
        replace: function (word) {
            return '~' + word + '~ ';
        }
    },

    { // actions
        id: 'input',
        words: function () {
            let wordArr = [];
            let dataString = $("#dataEditor").val();
            //console.log('data : '+ dataString);
            if (dataString != null && dataString != '') {
                let data = JSON.parse(dataString);
                if (Array.isArray(data)) {
                    data.forEach(function (item, index) {
                        wordArr.push(item['variable name']);
                    });
                }
                else {
                    console.log('dataset not defined');
                }
            }
            return wordArr;
        },
        match: /\*\b(\w{1,})$/,
        search: function (term, callback) {
            callback($.map(this.words(), function (word) {
                return word.indexOf(term) === 0 ? word : null;
            }));
        },
        index: 1,
        replace: function (word) {
            return '*$' + word + '* ';
        }
    }

], {
    onKeydown: function (e, commands) {
        if (e.ctrlKey && e.keyCode === 74) { // CTRL-J
            return commands.KEY_ENTER;
        }
    }
});

function setProjectView(id) {
    dbClientViewProj.getRows('project', { 'id': id }, function (projectRow) {
        //console.log('project data : ' + JSON.stringify(projectRow))
        let project = projectRow.pop()
        setConfigViewForProject(project.name)
        setLocatorTableData(project.locatorFile)
        setFlowsViewForProject(project.name)
        setApiViewForProject(project.name)
    })
}

function setConfigViewForProject(projectName) {
    dbClientViewProj.getRows('config', { 'projectName': projectName }, function (configRow) {
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