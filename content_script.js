// Minimal auto-fill + optional submit.
// Assumes fields are present at load; no observers, no delays.
(() => {
    if (location.pathname.startsWith("/f/login")){
        const a = "load successfully";
        console.log(a);
        const clickLogin = () => {
            const btn = document.getElementById("loginButtonId");
            if (btn) {
                btn.click();
                console.log("click login button");
            } else {
                console.log("login button not found");  
            }
        }
        clickLogin();
    }
    if (location.pathname.startsWith('/f/wlxt/index/course/student')) {
        const clickRelogin = () => {
            const relogin = document.querySelector('a.chongxin');
            if (relogin) relogin.click();
        };
        clickRelogin();
    }
    if (location.pathname.startsWith('/do/off/ui/auth/login/form/')){
        chrome.storage.sync.get('thuLogin').then(({ thuLogin }) => {
            if (!thuLogin) return false;
            const { username = '', password = '', autoSubmit = true } = thuLogin;
            if (!username || !password) return false;
            const user = document.querySelector('#username, input[name="username"], input[id*="user" i]');
            const pass = document.querySelector('input[type="password"], input[name="password"], input[id*="pass" i]');
            if (!user || !pass) return false;
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

    }
})();
