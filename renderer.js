// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// A little helper tool to wrap your functions if you want to build same app on web and electron.
// Use this function to use electron apis only when running inside electron.
// const isRunningInElectron = () => {
//   const userAgent = navigator.userAgent.toLowerCase();
//   return userAgent.indexOf(" electron/") > -1;
// };

window.addEventListener("DOMContentLoaded", () => {
    // const menuButton = document.getElementById("menu-btn");
    // const minimizeButton = document.getElementById("minimize-btn");
    // const maxUnmaxButton = document.getElementById("max-unmax-btn");
    // const closeButton = document.getElementById("close-btn");
  
    // menuButton.addEventListener("click", e => {
    //   window.openMenu(e.x, e.y);
    // });
  
    // minimizeButton.addEventListener("click", e => {
    //   window.minimizeWindow();
    // });
  
    // maxUnmaxButton.addEventListener("click", e => {
    //   const icon = maxUnmaxButton.querySelector("i.far");
  
    //   window.maxUnmaxWindow();
    //   if (window.isWindowMaximized()) {
    //     icon.classList.remove("fa-window-maximize-thin");
    //     icon.classList.remove("fa-2x")
    //     icon.classList.add("fa-clone");
    //     maxUnmaxButton.style="padding-top: 17px";
    //   } else {
    //     icon.classList.add("fa-window-maximize-thin");
    //     icon.classList.add("fa-2x");
    //     icon.classList.remove("fa-clone");
    //     maxUnmaxButton.style="padding-top: 7px";
    //   }
    // });

    // closeButton.addEventListener("click", e => {
    //   window.closeWindow();
    // });
  });