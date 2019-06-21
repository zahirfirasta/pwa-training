// add service worker 
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () { console.log('Service Worker Registered'); });
}
//--------------

// add to home screen
let deferredPrompt, btnInstall = document.querySelector("#btnInstall");

window.addEventListener('beforeinstallprompt', (e) => {
    console.log("beforeinstallprompt");
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    btnInstall.removeAttribute("hidden");
});
btnInstall.addEventListener("click", function () {
    btnInstall.setAttribute("hidden", ""),
        deferredPrompt.prompt(),
        deferredPrompt.userChoice.then(function (t) {
            if ("accepted" === t.outcome) {
                console.log("User accepted the A2HS prompt")
            } else {
                console.log("User dismissed the A2HS prompt")
            }
            deferredPrompt = null
        });
});
//--------------