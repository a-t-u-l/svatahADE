templator = require('./../js/util/templator.js');

let isProjectJsLoaded, isViewProjectJsLoaded,
    isNewProjectJsLoaded, isResultsJsLoaded,
    isResultJsLoaded, isApiClientJsLoaded;

loadedScripts = {
    viewType: '',
    scripts: []
};

$(document).ready(function () {
    setScriptLoaderVariableAsFalse();
    templator.clearPage();
    templator.welcomePage();
    templator.pageFooter();
    loadedScripts.viewType = 'welcome';
})

function getView(viewType, id) {
    switch (viewType) {
        case "project":
            if (loadedScripts.viewType !== 'project') {
                loadedScripts.scripts.forEach(script => {
                    templator.scriptUnloader(script, 'js');
                })
                loadedScripts.scripts = [];
            }
            if (!isProjectJsLoaded) {
                setScriptLoaderVariableAsFalse();
                templator.clearPage();
                templator.projectPage();
                templator.pageFooter();
                templator.scriptLoader("./../js/project.js");
                loadedScripts.viewType = 'project';
                loadedScripts.scripts.push('project.js');
            }
            isProjectJsLoaded = true;
            $('#api-client-icon').attr('class', 'fa fa-send-o');
            $('#project-icon').attr('class', 'fa fa-folder');
            $('#new-project-icon').attr('class', 'fa fa-plus-square-o');
            $('#result-icon').attr('class', 'fa fa-file-o');
            $('#results-icon').attr('class', 'fa fa-file-text-o');
            break;
        case "view-project":
            if (loadedScripts.viewType !== 'view-project') {
                loadedScripts.scripts.forEach(script => {
                    templator.scriptUnloader(script, 'js');
                })
            }
            if (!isViewProjectJsLoaded) {
                setScriptLoaderVariableAsFalse();
                templator.clearPage();
                templator.viewProjectPagePart1();
                templator.viewProjectPagePart2();
                templator.viewProjectPageModals();
                templator.scriptLoader("./../js/newproject.js");
                templator.scriptLoader("./../js/viewproject.js?id=" + id);
                loadedScripts.viewType = 'view-project';
                loadedScripts.scripts.push('newproject.js');
                loadedScripts.scripts.push('viewproject.js');
            }
            $('#name').attr('disabled', true);
            $('#configName').attr('disabled', true);
            $('#project-icon').attr('class', 'fa fa-folder-open');
            $('#api-client-icon').attr('class', 'fa fa-send-o');
            $('#new-project-icon').attr('class', 'fa fa-plus-square-o');
            $('#results-icon').attr('class', 'fa fa-file-text-o');
            isViewProjectJsLoaded = true;
            break;
        case "new-project":
            if (loadedScripts.viewType !== 'new-project') {
                loadedScripts.scripts.forEach(script => {
                    templator.scriptUnloader(script, 'js');
                })
            }
            if (!isNewProjectJsLoaded) {
                setScriptLoaderVariableAsFalse();
                templator.clearPage();
                templator.viewProjectPagePart1();
                templator.viewProjectPagePart2();
                templator.viewProjectPageModals();
                templator.scriptLoader("./../js/newproject.js");
                templator.scriptLoader("./../js/viewproject.js");
                loadedScripts.viewType = 'new-project';
                loadedScripts.scripts.push('newproject.js');
                loadedScripts.scripts.push('viewproject.js');
            }
            $('#api-client-icon').attr('class', 'fa fa-send-o');
            $('#new-project-icon').attr('class', 'fa fa-plus-square');
            $('#project-icon').attr('class', 'fa fa-folder-o');
            $('#results-icon').attr('class', 'fa fa-file-text-o');
            isNewProjectJsLoaded = true;
            break;
        case "results":
            if (loadedScripts.viewType !== 'results') {
                loadedScripts.scripts.forEach(script => {
                    templator.scriptUnloader(script, 'js');
                })
            }
            if (!isResultsJsLoaded) {
                setScriptLoaderVariableAsFalse();
                templator.clearPage();
                templator.resultsPage();
                templator.pageFooter();
                templator.scriptLoader("./../js/results.js");
                loadedScripts.viewType = 'results';
                loadedScripts.scripts.push('results.js');
            }
            $('#api-client-icon').attr('class', 'fa fa-send-o');
            $('#new-project-icon').attr('class', 'fa fa-plus-square-o');
            $('#project-icon').attr('class', 'fa fa-folder-o');
            $('#results-icon').attr('class', 'fa fa-file-text');
            isResultsJsLoaded = true;
            break;
        case "result":
            if (loadedScripts.viewType !== 'result') {
                loadedScripts.scripts.forEach(script => {
                    templator.scriptUnloader(script, 'js');
                })
            }
            if (!isResultJsLoaded) {
                setScriptLoaderVariableAsFalse();
                templator.clearPage();
                templator.resultPagePart1();
                templator.resultPagePart2();
                templator.scriptLoader("./../js/result.js?id=" + id);
                loadedScripts.viewType = 'result';
                loadedScripts.scripts.push('result.js');
            }
            $('#api-client-icon').attr('class', 'fa fa-send-o');
            $('#new-project-icon').attr('class', 'fa fa-plus-square-o');
            $('#project-icon').attr('class', 'fa fa-folder-o');
            $('#results-icon').attr('class', 'fa fa-file');
            isResultJsLoaded = true;
            break;
        case "api-client":
            if (loadedScripts.viewType !== 'api-client') {
                loadedScripts.scripts.forEach(script => {
                    templator.scriptUnloader(script, 'js');
                })
            }
            if (!isApiClientJsLoaded) {
                setScriptLoaderVariableAsFalse();
                templator.clearPage();
                templator.apiClientPagePart1();
                templator.apiClientPagePart2();
                templator.scriptLoader("./../js/modalHandler.js");
                templator.scriptLoader("./../js/apiclient.js");
                templator.scriptLoader("./../js/jsoneditor.min.js");
                loadedScripts.viewType = 'api-client';
                loadedScripts.scripts.push('modalHandler.js');
                loadedScripts.scripts.push('apiclient.js');
                loadedScripts.scripts.push('jsoneditor.min.js');
            }
            $('#project-icon').attr('class', 'fa fa-folder-o');
            $('#new-project-icon').attr('class', 'fa fa-plus-square-o');
            $('#results-icon').attr('class', 'fa fa-file-text-o');
            $('#api-client-icon').attr('class', 'fa fa-send');
            isApiClientJsLoaded = true;
            break;
        default:
            setScriptLoaderVariableAsFalse();
            templator.clearPage();
            templator.welcomePage();
            loadedScripts.viewType = 'welcome';
            break;
    }
}

function setScriptLoaderVariableAsFalse() {
    isProjectJsLoaded = false
    isViewProjectJsLoaded = false
    isNewProjectJsLoaded = false
    isResultsJsLoaded = false
    isResultJsLoaded = false
    isApiClientJsLoaded = false;
}