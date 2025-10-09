// js/sidebar.js
(() => {
  const SIDEBAR_ROOT_ID = "sidebar-root";
  const STORAGE_KEY = "felixent:sidebarCollapsed";

  function baseHref() {
    const b = document.querySelector('base')?.href;
    if (b) return b;
    return window.location.origin + window.location.pathname;
  }

  const template = `
  <aside id="felixent-sidebar" class="sidebar-transition w-64 bg-white border-r shadow-sm min-h-screen flex flex-col" role="complementary" aria-label="Main navigation">
    <div class="p-4 flex items-center justify-between border-b">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 bg-indigo-600 text-white rounded flex items-center justify-center font-semibold">F</div>
        <div><div class="text-sm font-semibold">Felixent</div><div class="text-xs text-gray-500">Asset Management</div></div>
      </div>
      <button id="felixent-collapse-btn" aria-expanded="true" class="p-1 rounded hover:bg-gray-100" title="Toggle sidebar"><svg id="felixent-collapse-icon" class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg></button>
    </div>
    <nav id="felixent-nav" class="p-3 flex-1 overflow-y-auto" role="navigation" aria-label="Main menu">
      <ul id="felixent-nav-list" class="space-y-1" role="menu"></ul>
    </nav>
    <div class="mt-auto p-3 border-t">
      <div class="text-xs text-gray-500">Signed in as</div>
      <div class="text-sm font-semibold" id="felixent-user-name">James</div>
      <div class="text-xs text-gray-400" id="felixent-user-org">Felixent</div>
    </div>
  </aside>`;

  function makeItem(href, label, icon, view) {
    return `<li role="none"><a role="menuitem" tabindex="0" data-view="${view||''}" class="felixent-nav-link flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100" href="${href}"><span class="felixent-icon">${icon}</span><span class="felixent-label">${label}</span></a></li>`;
  }

  function inject() {
    const root = document.getElementById(SIDEBAR_ROOT_ID);
    if (!root) return;
    root.innerHTML = template;
    const navList = document.getElementById('felixent-nav-list');
    const base = baseHref();
    const items = [
      { p: 'index.html', l: 'Dashboard', i: '📊', v: 'dashboard' },
      { p: 'items.html', l: 'Items List', i: '📦', v: 'items' },
      { p: 'users.html', l: 'Users', i: '👥', v: 'users' },
      { p: 'locations.html', l: 'Office Locations', i: '📍', v: 'locations' },
      { sep: true },
      { p: 'suppliers.html', l: 'Suppliers', i: '🧾', v: 'suppliers' },
      { p: 'movement.html', l: 'Asset Movement', i: '🔄', v: 'movement' },
      { p: 'reports.html', l: 'Reports', i: '📑', v: 'reports' }
    ];
    navList.innerHTML = items.map(it => it.sep ? '<li role="separator"><hr class="my-2"/></li>' : makeItem(new URL(it.p, base).href, it.l, it.i, it.v)).join('');
    attachBehavior();
    restoreCollapsedState();
  }

  function saveCollapsedState(collapsed) { localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0"); }
  function restoreCollapsedState() { setCollapsed(localStorage.getItem(STORAGE_KEY) === "1", false); }

  function setCollapsed(collapsed, persist = true) {
    const sidebar = document.getElementById("felixent-sidebar");
    if (!sidebar) return;
    const labels = sidebar.querySelectorAll(".felixent-label");
    const icon = document.getElementById("felixent-collapse-icon");
    const btn = document.getElementById("felixent-collapse-btn");
    if (collapsed) { sidebar.style.width = "72px"; labels.forEach(n => n.classList.add("hidden")); btn.setAttribute("aria-expanded", "false"); icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />'; }
    else { sidebar.style.width = "16rem"; labels.forEach(n => n.classList.remove("hidden")); btn.setAttribute("aria-expanded", "true"); icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />'; }
    if (persist) saveCollapsedState(collapsed);
  }

  function attachBehavior() {
    const collapseBtn = document.getElementById("felixent-collapse-btn");
    collapseBtn.addEventListener("click", () => {
      const expanded = collapseBtn.getAttribute("aria-expanded") === "true";
      setCollapsed(expanded, true);
    });
    const menu = document.getElementById("felixent-nav-list");
    menu.addEventListener("keydown", (e) => {
      const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(idx+1)%items.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); items[(idx-1+items.length)%items.length].focus(); }
      if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
      if (e.key === "End") { e.preventDefault(); items[items.length-1].focus(); }
      if (e.key === "Enter" || e.key === " ") { document.activeElement.click(); }
    });
    menu.querySelectorAll('[role="menuitem"]').forEach(el => {
      el.addEventListener('click', (ev) => {
        const view = el.dataset.view;
        if (view && window.sidebarAPI && window.sidebarAPI.spaActive) { ev.preventDefault(); window.sidebarAPI.showView(view); }
      });
    });
    window.sidebarAPI = window.sidebarAPI || {};
    window.sidebarAPI.toggle = () => setCollapsed(document.getElementById("felixent-collapse-btn").getAttribute("aria-expanded") === "true");
    window.sidebarAPI.setUser = ({ name, org }) => { const n = document.getElementById("felixent-user-name"); const o = document.getElementById("felixent-user-org"); if (n && name) n.textContent = name; if (o && org) o.textContent = org; };
  }

  document.addEventListener('DOMContentLoaded', inject);
  window.felixentSidebar = { inject, setCollapsed, saveCollapsedState };
})();
