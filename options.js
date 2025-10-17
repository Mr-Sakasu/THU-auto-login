function getEl(id) { return document.getElementById(id); }


async function restore() {
    const { thuLogin } = await chrome.storage.sync.get('thuLogin');
    const cfg = Object.assign({ username: '', password: '', autoSubmit: true, delayMs: 400 }, thuLogin || {});
    getEl('username').value = cfg.username;
    getEl('password').value = cfg.password;
    getEl('autoSubmit').checked = !!cfg.autoSubmit;
    getEl('delayMs').value = cfg.delayMs;
}


async function save(e) {
    e.preventDefault();
    const data = {
        username: getEl('username').value.trim(),
        password: getEl('password').value,
        autoSubmit: getEl('autoSubmit').checked,
        delayMs: Math.max(0, Number(getEl('delayMs').value || 0))
    };
    await chrome.storage.sync.set({ thuLogin: data });
    alert('Saved.');
}


async function clearAll() {
    await chrome.storage.sync.remove('thuLogin');
    await restore();
    alert('Cleared.');
}


document.addEventListener('DOMContentLoaded', restore);
getEl('form').addEventListener('submit', save);
getEl('clear').addEventListener('click', clearAll);