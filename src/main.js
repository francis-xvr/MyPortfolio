import { initHomeMainApp } from './components/homepageapp/homecontroller'; 

const initHome = function(){
    const app = initHomeMainApp();
    app.mount('#homeapp');
}
function displayLandscapeWarning(){
    const container = document.createElement("div");
    container.setAttribute("id", "landscapeStopperDiv");
    container.innerHTML = '<h1>Please turn back to potrail mode for better experience</h1>';
    document.body.appendChild(container);
}

function removeLandscapeWarning(){
    const container = document.getElementById("landscapeStopperDiv");
    if(container !=null){
        document.body.removeChild(container);
    }
}
function orientationManager(type){
    if(mobileDevice && (type == 'landscape-primary' || type == 'landscape-secondary')){
        displayLandscapeWarning();
    }else{
        removeLandscapeWarning();
    }
}
let mobileDevice = false;
if(screen.height > screen.width){
    mobileDevice = true;
}
orientationManager(screen.orientation.type);

screen.orientation.addEventListener("change", (event) => {
    orientationManager(event.target.type);
});

window.onload = function() {
    initHome();
};
history.scrollRestoration = "manual";