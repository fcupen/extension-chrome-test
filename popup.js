function enc(myString) {
    var encrypted = CryptoJS.AES.encrypt(myString, 'farm');
    return encrypted.toString();
}

async function login(data) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch('https://e236e17a-cd39-4896-b485-b209bc670df2.mock.pstmn.io/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        chrome.runtime.sendMessage({ popup: { localStorage } });
    }, 500);
    checkStatus();
    let signinEl = document.getElementById('signin');
    signinEl.addEventListener('click', () => {
        localStorage.clear();
        const email = document.getElementById('email').value;
        const contract = document.getElementById('contract').value;
        login({ email, contract }).then((response) => {
            localStorage.setItem('email', email);
            localStorage.setItem('contract', contract);
            localStorage.setItem('token', contract.token);
            chrome.runtime.sendMessage({ popup: { email, contract, response } });
            checkStatus();
        }).catch(() => {
            checkStatus();
        });

    });

    var logoutEl = document.getElementById('logout');
    logoutEl.addEventListener('click', function () {
        localStorage.clear();
        chrome.runtime.sendMessage({ popup: { email: '', contract: '', response: { token: '' } } });
        setTimeout(() => {
            checkStatus();
        }, 500);
    });
});

function checkStatus() {

    if (localStorage.getItem('email') && localStorage.getItem('contract')) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('status-form').style.display = 'block';
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('status-form').style.display = 'none';
    }
}
