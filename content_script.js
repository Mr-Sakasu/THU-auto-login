// content_script.js
(() => {
    // STEP 1 — press "登录" on Web Learning page
    if (location.href.startsWith("https://learn.tsinghua.edu.cn/f/login")) {
        const press = () => {
            const btn = document.getElementById("loginButtonId");
            if (btn) { btn.click(); return true; }
            // Fallback: same target as the button's onclick
            location.href = "https://id.tsinghua.edu.cn/do/off/ui/auth/login/form/bb5df85216504820be7bba2b0ae1535b/0";
            return true;
        };

        if (!press()) {
            let elapsed = 0;
            const iv = setInterval(() => {
                if (press() || (elapsed += 100) > 3000) clearInterval(iv);
            }, 100);
        }
        return;
    }

    // STEP 2 — fill SSO (id.tsinghua.edu.cn) with #i_user / #i_pass and submit
    if (location.hostname === "id.tsinghua.edu.cn") {
        chrome.storage.sync.get("thuLogin").then(({ thuLogin }) => {
            if (!thuLogin) return;
            const { username = "", password = "", autoSubmit = true } = thuLogin;
            if (!username || !password) return;

            const user = document.getElementById("i_user");
            const pass = document.getElementById("i_pass");
            if (!user || !pass) return;

            // Fill
            user.value = username;
            pass.value = password;

            // Let any JS listeners know
            user.dispatchEvent(new Event("input", { bubbles: true }));
            pass.dispatchEvent(new Event("input", { bubbles: true }));
            user.dispatchEvent(new Event("change", { bubbles: true }));
            pass.dispatchEvent(new Event("change", { bubbles: true }));

            if (autoSubmit) {
                // Prefer clicking a visible login-like control
                const candidates = Array.from(document.querySelectorAll(
                    'button, input[type="submit"], input[type="button"], a, [role="button"]'
                ));
                const loginBtn = candidates.find(el =>
                    /登录|登陆|sign\s*in|log\s*in/i.test((el.textContent || el.value || "").trim())
                );

                if (loginBtn) {
                    loginBtn.click();
                } else {
                    // fallback to form submit
                    const form = pass.form || user.form || document.querySelector("form");
                    form?.submit?.();
                }
            }
        });
    }
})();
