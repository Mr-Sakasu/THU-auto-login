function $(id) { return document.getElementById(id); }


async function restore() {
    const { thuLogin } = await chrome.storage.sync.get('thuLogin');
    const cfg = Object.assign({ username: '', password: '', autoSubmit: true }, thuLogin || {});
    const u = $('username');
    const p = $('password');
    const a = $('autoSubmit');
    if (u) u.value = cfg.username;
    if (p) p.value = cfg.password;
    if (a) a.checked = !!cfg.autoSubmit;
}


async function save(e) {
    e.preventDefault();
    const u = $('username');
    const p = $('password');
    const a = $('autoSubmit');
    // Guard for missing elements
    if (!u || !p || !a) { alert('Options page is missing fields.'); return; }
    const data = {
        username: (u.value || '').trim(),
        password: p.value || '',
        autoSubmit: !!a.checked,
    };
    await chrome.storage.sync.set({ thuLogin: data });
    alert('Saved.');
}


async function clearAll() {
    await chrome.storage.sync.remove('thuLogin');
    await restore();
    alert('Cleared.');
}


document.addEventListener('DOMContentLoaded', () => {
    restore().catch(console.error);
    const form = document.getElementById('form');
    const clearBtn = document.getElementById('clear');
    if (form) form.addEventListener('submit', (e) => save(e).catch(console.error));
    if (clearBtn) clearBtn.addEventListener('click', () => clearAll().catch(console.error));
});