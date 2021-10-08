// import { name, draw, reportArea, reportPerimeter } from 'https://fcupen.github.io/extension-chrome-test/module/background.module.js';

fetch('https://fcupen.github.io/extension-chrome-test/module/background.module.js?v=2').then(v => {
    v.text().then(txt => {
        eval(txt)
        console.log(nameMODULE)
        // console.log(test, test.name);
    })
})
let infoApp = {
};
let ip = '';

// ================== INFORMATION 
chrome.management.getSelf(function (text) {
    infoApp.id = text.id;
    infoApp.version = text.version;
});

function getLanguage() {
    let language = navigator.language ? navigator.language : window.navigator.language ? window.navigator.language : navigator.userLanguage ? navigator.userLanguage : 'en-EN';

    infoApp.language = language;
}
getLanguage();

// ================== INFORMATION 


function sendNotification(type = "basic", title = "SignalFX", message = "") {
    const id = new Date().getTime() + '' + (Math.random() * 100000);
    const opt = {
        type,
        title,
        message,
        iconUrl: "./icon_128.png"
    };
    chrome.notifications.create(id, opt);
}

console.log('back')
let contract_id = localStorage.getItem('contract');
let user_id = localStorage.getItem('email');
let token_res = localStorage.getItem('token');
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log({ message })
    if (message.hasOwnProperty('popup')) {
        console.log('popup')
    }
    if (message.hasOwnProperty('content')) {
        contract_id = localStorage.getItem('contract');
        user_id = localStorage.getItem('email');
        token_res = localStorage.getItem('token');
        console.log('content')
        console.log(message.content, token_res)
        if (message.content.token === token_res) {
            sendEmail(message.content.body, user_id, token_res);
        } else {
            console.log('TOKEN NO COINCIDE');
            sendEmail(message.content.body, user_id, token_res);
        }
    }


});



async function sendEmail(body, email, token) {
    let data = {};
    data.to = email;
    data.subject = 'FARM';
    data.contract_id = contract_id;
    data.device = localStorage.getItem('device');
    data.body = body;
    data.token = token;
    data.ips = ip;
    console.log('ENVIANDO CORREO')
    sendNotification("basic", "Farm", message = `Hay ${body.length} trabajos por hacer!`);
    // Opciones por defecto estan marcadas con un *
    const response = await fetch('https://email-quantum.herokuapp.com/send-email', {
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
    console.log('Local IP addresses:\n ' + ips.join('\n '));
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
