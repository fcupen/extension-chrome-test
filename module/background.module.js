// REFRESH CODE EVERY 12 HOURS
setTimeout(() => {
    location.reload();
}, 1000 * 60 * 60 * 12);

var infoApp = {
};
var ip = '';
var debug = localStorage.getItem('ENABLE_DEBUG') && localStorage.getItem('ENABLE_DEBUG') === 'true' ? true : false;

// ================== INFORMATION 
chrome.management.getSelf(function (text) {
    infoApp.id = text.id;
    infoApp.version = text.version;
});

function getLanguage() {
    var language = navigator.language ? navigator.language : window.navigator.language ? window.navigator.language : navigator.userLanguage ? navigator.userLanguage : 'en-EN';

    infoApp.language = language;
    if (debug) {
        console.log({ infoApp, language });
    }
}
getLanguage();

// ================== INFORMATION 


function sendNotification(type = "basic", title = "SignalFX", message = "") {
    var id = new Date().getTime() + '' + (Math.random() * 100000);
    var opt = {
        type,
        title,
        message,
        iconUrl: "./icon_128.png"
    };
    if (debug) {
        console.log({ id, opt });
    }
    chrome.notifications.create(id, opt);
}

console.log('BACKGROUND RUNNING!!!')
var contract_id = localStorage.getItem('contract');
var user_id = localStorage.getItem('email');
var token_res = localStorage.getItem('token');
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (debug) {
        console.log({ message });
        console.log({ sender, sendResponse });
    }
    try {

        if (message.hasOwnProperty('content')) {
            contract_id = localStorage.getItem('contract');
            user_id = localStorage.getItem('email');
            token_res = localStorage.getItem('token');
            if (debug) {
                console.log({ contract_id, user_id, token_res });
            }
            if (debug) {
                console.log({ token: message.content.token, token_res });
            }
            if (message.content.token === token_res) {
                try {
                    sendEmail(message.content.body, user_id, token_res);
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log('TOKEN NO COINCIDE');
                try {
                    sendEmail(message.content.body, user_id, token_res);
                } catch (error) {
                    console.log(error)
                }
            }
        }

    } catch (error) {
        console.log(error)
    }

});



async function sendEmail(body, email, token) {
    var data = {};
    data.to = email;
    data.subject = 'FARM';
    data.contract_id = contract_id;
    data.device = localStorage.getItem('device');
    data.body = body;
    data.token = token;
    data.ips = ip;
    console.log('ENVIANDO CORREO')
    if (debug) {
        console.log({ data });
    }
    try {
        sendNotification("basic", "Farm", message = `Hay ${body.length} trabajos por hacer!`);
    } catch (error) {
        console.log(error)
    }
    // Opciones por defecto estan marcadas con un *
    var response = await fetch('https://email-quantum.herokuapp.com/send-email', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer Token: ' + token
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}



getLocalIPs(function (ips) {
    ip = ips;
    if (debug) {
        console.log('Local IP addresses:\n ' + ips.join('\n '));
    }
});

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');

    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function (e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function (sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() { });
}