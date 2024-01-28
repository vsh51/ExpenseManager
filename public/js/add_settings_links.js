const nav = document.querySelector('.navbar-nav');
nav.innerHTML = "";
function create_link(href, inner_text, id) {
    const anc = document.createElement('a');
    anc.href = href;
    anc.classList.add("nav-link");
    anc.innerHTML = inner_text;

    const l = document.createElement('li');
    l.classList.add("nav-item");
    l.id = id;
    l.appendChild(anc);
    nav.appendChild(l);
}

create_link('/settings', 'Account info', 'set');
create_link('/settings/account_settings', 'Account settings', 'acs');
create_link('/settings/category', 'Category settings', 'cat');
