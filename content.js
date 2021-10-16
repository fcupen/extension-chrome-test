fetch('https://fcupen.github.io/extension-chrome-test/module/content.module.js?v=2', { cache: "no-store" }).then(v => {
    v.text().then(code => {
        eval(code);
    });
});
setTimeout(() => {
    if (window.location.toString().includes('worldtree')) {
        var canv = document.getElementsByTagName('canvas')
        canv[0].parentNode.removeChild(canv[0])
        console.log('REMOVE')
    }
}, 10000);
// try {
//     const title = 'BotCrow';
//     const spinner = '<style>.spinner{border:4px solid rgba(0,0,0,.1);width:16px;height:16px;border-radius:50%;border-left-color:#09f;animation:spin 1s ease infinite}@keyframes spin{0 %{transform:rotate(0)}100%{transform:rotate(360deg)}}</style><div class="spinner" title="' + title + '"></div>';
//     const html = document.getElementsByClassName('tw-flex tw-mx-auto md:tw-justify-start md:tw-justify-items-center')[0].innerHTML;
//     document.getElementsByClassName('tw-flex tw-mx-auto md:tw-justify-start md:tw-justify-items-center')[0].innerHTML = spinner + html;
// } catch (error) {

// }
