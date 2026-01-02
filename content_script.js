(() => {
    const AUTO_SUBMIT = true;

    function clickIfExists(selector, label) {
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            console.log('clicked:', label);
            return true;
        }
        console.log('not found:', label);
        return false;
    }

    function findCredFields() {
        const user = document.querySelector('#username, input[name="username"], input[id*="user" i]');
        const pass = document.querySelector('input[type="password"], input[name="password"], input[id*="pass" i]');
        return (user && pass) ? { user, pass } : null;
    }

    function fieldsFilled({ user, pass }) {
        return Boolean(user.value && pass.value);
    }

    function fingerprintReady() {
        const fp = document.getElementById('fingerPrint');
        return !fp || Boolean(fp.value);
    }

    function trySubmit({ user, pass }) {
        if (!fieldsFilled({ user, pass })) return false;
        if (!fingerprintReady()) return false;

        // Prefer doLogin buttons/anchors if present
        const doLoginBtn = document.querySelector(
            'a[onclick*="doLogin"], button[onclick*="doLogin"], input[onclick*="doLogin"]'
        );
        if (doLoginBtn) {
            doLoginBtn.click();
            console.log('clicked doLogin element');
            return true;
        }

        // Fallback to normal submit
        const form = pass.form || user.form || document.querySelector('form');
        const submitBtn = form?.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            submitBtn.click();
            console.log('clicked submit button');
            return true;
        }
        if (form?.submit) {
            form.submit();
            console.log('submitted form');
            return true;
        }
        return false;
    }

    // --- route handling ---
    const path = location.pathname;

    if (path.startsWith('/f/login')) {
        console.log('on /f/login');
        clickIfExists('#loginButtonId', 'loginButtonId');
        return;
    }

    if (path.startsWith('/f/wlxt/index/course/student')) {
        console.log('on /wlxt student');
        clickIfExists('a.chongxin', 'relogin link');
        return;
    }

    if (path.startsWith('/do/off/ui/auth/login/form/')) {
        console.log('on tsinghua id login form');

        if (!AUTO_SUBMIT) return;

        const fields = findCredFields();
        if (fields && trySubmit(fields)) return;

        // Watch for autofill / fingerprint becoming ready
        let attempts = 50; // 10s (50 * 200ms)
        const timer = setInterval(() => {
            const f = findCredFields();
            if (f && trySubmit(f)) clearInterval(timer);
            else if (--attempts <= 0) clearInterval(timer);
        }, 200);

        const obs = new MutationObserver(() => {
            const f = findCredFields();
            if (f && trySubmit(f)) {
                clearInterval(timer);
                obs.disconnect();
            }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });

        return;
    }
})();
