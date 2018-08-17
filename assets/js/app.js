const GOOGLE_MAPS_API_KEY = "";
let appAlias = "";
if (location.port === "200") {
  appAlias = "mws-restaurant-stage-1";
}

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }
  return idb.open("rreviews-db", 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore("rreviews", {
      keyPath: "id"
    });
    store.createIndex("by-date", "time");
  });
}
function isBrowserCompatiblewithServiceWorkers() {
  //registering the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {

        if(reg.waiting) {
            updateReady(reg.waiting);
            return;
        }

        if(reg.installing) {
            console.log('Service worker installing')
            reg.installing.addEventListener('statechange', () => {
                if(this.state == 'installed'){
                    updateReady(this);
                    return;
                }
            });
        }

        reg.addEventListener('updatefound', () => {
            reg.installing.addEventListener('statechange', function(){
                if(this.state == 'installed'){
                    updateReady(this);
                    return;
                }
            });
        })


    }).catch((error) =>  {
        // registration failed
        console.log('Registration failed with ' + error);
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

function updateReady(worker){

    DBHelper.showUpdateUI('New version available');

    const updateMessage = document.querySelector('#update-message');

    updateMessage.addEventListener('click', (e) => {
        if(e.target && e.target.id== 'brn-refresh'){

            worker.postMessage({action: 'skipWaiting'});


        }else if(e.target && e.target.id== 'brn-cancel'){
            setTimeout(() => {
                document.querySelector('#update-message div').remove();
            }, 1000);
        }

    })
}

  return true;
}
function registerServiceWorker() {
  if (!isBrowserCompatiblewithServiceWorkers()) {
    return;
  }
  console.log("ServiceWorker is compatible with this browser!");
  navigator.serviceWorker.register("sw.js").then(
    function(registration) {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    },
    function(err) {
      console.log("ServiceWorker registration failed: ", err);
    }
  );
}

function checkServiceWorkerController() {
  if (!isBrowserCompatiblewithServiceWorkers()) {
    return;
  }
  if (navigator.serviceWorker.controller) {
    console.log(
      "This page is currently controlled by:",
      navigator.serviceWorker.controller
    );
  } else {
    console.log(
      "This page is not currently controlled " + "by a service worker."
    );
  }
}
window.addEventListener("load", function() {
  //openDatabase();
  registerServiceWorker();
  checkServiceWorkerController();
  let homeLinks = document.querySelectorAll(".jsHomeLink");
  for (const link of homeLinks) {
    link.href = `./`;
  }
  this.fetch("assets/offline.html").catch(response => {
    if (response.name === "TypeError") {
      //Show the placeholder and hide the map element
      let mapOfflineMsgBlock = document.querySelector(
        ".map-offline-placeholder"
      );
      let mapBlock = document.querySelector("#map");
      if (mapOfflineMsgBlock != null && mapBlock != null) {
        mapBlock.style.display = "none";
        mapOfflineMsgBlock.style.display = "block";
      }
    }
  });
});
//Pop up image on click 
  
      let  img_modal    =   document.querySelector("#image_modal"),
       img    =     document.querySelector(".img"),
       body         =   document.querySelector("body"),
       click        =   "click",
       closer       =   document.querySelector('.layer');


function showImage(elements) {     
     document.getElementById("img01").src = elements.src;
     img_modal.style.display = "block";
     closer.style.display='block';
     body.style.overflow="hidden";
  const captionText = document.getElementById("caption");
  captionText.innerHTML = elements.alt;
}
  closer.addEventListener(click,function(){
     img_modal.style.display='none';
       closer.style.display="none";
       body.style.overflowY="scroll";
  });
