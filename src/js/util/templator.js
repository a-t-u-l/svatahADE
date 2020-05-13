module.exports = {
    block : (tag, html) => {
        document.getElementById(tag).innerHTML = html;
    },

    sidebar: (pageName) => {
        document.getElementById("sidebar").innerHTML = `<div class="logo">
            <a href="https://www.svatah.in" target="_blank" class="simple-text logo-mini">
                S
            </a>
            <a href="https://www.svatah.in" target="_blank" class="simple-text logo-normal">
                Svatah
            </a>
        </div>
        <div class="sidebar-wrapper">
            <ul class="nav">

                <li class="project">
                    <a href="./project.html" data-toggle="tooltip" data-placement="right" title="project">
                        <i class="material-icons">assessment</i>
                        <p>View Projects</p>
                    </a>
                </li>

                <li class="newuiproject">
                    <a href="./newproject.html" data-toggle="tooltip" data-placement="right" title="newproject">
                        <i class="material-icons">note_add</i>
                        <p>New Project</p>
                    </a>
                </li>

                <li class="api-client">
                    <a href="./apiclient.html" data-toggle="tooltip" data-placement="right" title="API client">
                        <i class="material-icons">extension</i>
                        <p>API Client</p>
                    </a>
                </li>

                <li class="results">
                    <a href="./results.html" data-toggle="tooltip" data-placement="right" title="results">
                        <i class="material-icons">receipt</i>
                        <p>Results</p>
                    </a>
                </li>

                <li id="darkmode" class="theme">
                    <a class="toggle-label toggle-label-off" data-toggle="tooltip" data-placement="right"
                        title=" toggle dark mode">
                        <i id="darkmodeicon" class="material-icons">toggle_on</i>
                        <p>darkmode</p>
                    </a>
                </li>

            </ul>
        </div>`.replace(`class="`+pageName+`"`, `class="`+pageName+` active"`);
    }
}