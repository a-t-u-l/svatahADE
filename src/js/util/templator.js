const fragments = require('./fragmentEnums');

module.exports = {

    block: (tag, html) => {
        document.getElementById(tag).innerHTML = html;
    },

    sidebar: (pageIconType, replacementType = null) => {
        if (!replacementType || replacementType == null)
            replacementType = pageIconType
        document.getElementById("sidebar").innerHTML = `<div class="section" style="padding: 32px;">
        <div class="menu">
            <ul id="menu" class="menu-list no-hover">
                <li class="logo">
                    <a href="./viewManager.html" class="simple-text logo-mini"
                        style="padding: 0px 0px 30px 0px; color: white; font-size:26px">
                        S
                    </a>
                </li>
                <li class="api-client">
                    <a id="load-api-view" href="#" onclick="getView('api-client')" title="api-client"
                        style="padding: 15px 0px 15px 0px; color: white; font-size:26px">
                        <i id="api-client-icon" class="fa fa-send-o"></i>
                    </a>
                </li>
                <li class="project">
                    <a href="./project.html" title="project"
                        style="padding: 15px 0px 15px 0px; color: white; font-size:26px">
                        <i class="fa fa-folder-o"></i>
                    </a>
                </li>

                <li class="newuiproject">
                    <a href="./newproject.html" title="newproject"
                        style="padding: 15px 0px 15px 0px; color: white; font-size:26px">
                        <i class="fa fa-plus-square-o"></i>
                    </a>
                </li>

                <li class="results">
                    <a href="./results.html" title="results"
                        style="padding: 15px 0px 15px 0px; color: white; font-size:26px">
                        <i class="fa fa-file-text-o"></i>
                    </a>
                </li>

                <li class="dark-mode-toggle">
                    <a id="toggle-dark-mode" class="dark-mode-on" href="#" onclick="toggleDarkMode()"
                        title="dark-mode" style="padding: 15px 0px 15px 0px; color: white; font-size:20px">
                        <i id="dark-mode-icon" class="fa fa-toggle-on"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>`.replace(`class="fa ` + pageIconType + `-o"`, `class="fa ` + replacementType + `"`);
    },

    scriptLoader: (scriptPath, id) => {
        var script = document.createElement("script");
        script.setAttribute("src", scriptPath);
        script.setAttribute("type", "text/javascript");
        script.setAttribute("async", false);
        document.body.append(script);
        // error event
        script.addEventListener("error", (ev) => {
            console.log("Error on loading file", ev);
        });
    },

    scriptUnloader: (filename, filetype) => {
        var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
        var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
                allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
        }
    },

    scriptEval: (type) => {
        switch (type) {
            case "project":
                return `$('#projectList').DataTable();`
            default:
                break;
        }
    },

    clearPage: () => {
        let part1 = document.getElementById("col-part-1");
        part1.className = '';
        part1.style = '';
        part1.innerHTML = ``;

        let part2 = document.getElementById("col-part-2");
        part2.className = '';
        part2.style = '';
        part2.innerHTML = ``;

        document.getElementById("modal-body").innerHTML = ``;
    },

    welcomePage: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-11 scrollable';
        part2.innerHTML = fragments.welcomeFragment();
    },

    projectPage: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-11 scrollable';
        part2.innerHTML = fragments.projectFragment();
    },

    viewProjectPagePart1: () => {
        let part1 = document.getElementById("col-part-1");
        part1.className = 'column is-3 scrollable';
        part1.style = "min-height: 100vh;";
        part1.innerHTML = fragments.viewProjectCol2Fragment();
    },

    viewProjectPagePart2: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-8 scrollable';
        part2.innerHTML = fragments.viewProjectCol9Fragment();
    },

    viewProjectPageModals: () => {
        document.getElementById("modal-body").innerHTML = fragments.viewProjectModalsFragment();
    },

    newProjectPart1: () => {
        let part1 = document.getElementById("col-part-1");
        part1.className = 'column is-3 scrollable';
        part1.style = "min-height: 100vh;";
        part1.innerHTML = ``;
    },

    newProjectPart2: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-8 scrollable';
        part2.innerHTML = ``;
    },

    resultsPage: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-11 scrollable';
        part2.innerHTML = fragments.resultsFragment();
    },

    resultPagePart1: () => {
        let part1 = document.getElementById("col-part-1");
        part1.className = 'column is-3 scrollable';
        part1.style = "min-height: 100vh;";
        part1.innerHTML = fragments.resultCol2Fragment();
    },

    resultPagePart2: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-8 scrollable';
        part2.innerHTML = fragments.resultCol9Fragment();
    },

    apiClientPagePart1: () => {
        let part1 = document.getElementById("col-part-1");
        part1.className = 'column is-3 scrollable';
        part1.style = "min-height: 100vh; max-width: 25vw;";
        part1.innerHTML = fragments.apiClientCol2Fragment();
    },

    apiClientPagePart2: () => {
        let part2 = document.getElementById("col-part-2");
        part2.className = 'column is-8 scrollable';
        part2.style = "max-width: 66.67vw;";
        part2.innerHTML = fragments.apiClientCol9Fragment();
    },

    pageFooter: () => {
        document.getElementById("main-footer").innerHTML = fragments.footerFragment();
    }
}