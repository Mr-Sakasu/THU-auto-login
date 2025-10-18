// Minimal auto-fill + optional submit.
// Assumes fields are present at load; no observers, no delays.
(() => {
    chrome.storage.sync.get('thuLogin').then(({ thuLogin }) => {
        if (!thuLogin) return;
        const { username = '', password = '', autoSubmit = true } = thuLogin;
        if (!username || !password) return;


        // Very small set of selectors — tweak for THU DOM if needed
        const user = document.querySelector('#username, input[name="username"], input[id*="user" i]');
        const pass = document.querySelector('input[type="password"], input[name="password"], input[id*="pass" i]');
        if (!user || !pass) return;


        user.value = username;
        pass.value = password;


        // Light event dispatch so frameworks notice
        user.dispatchEvent(new Event('input', { bubbles: true }));
        pass.dispatchEvent(new Event('input', { bubbles: true }));


        if (autoSubmit) {
            const form = pass.form || user.form || document.querySelector('form');
            const btn = form?.querySelector('button[type="submit"], input[type="submit"]');
            if (btn) btn.click();
            else form?.submit?.();
        }
    });
})();