import { useState, useMemo } from "react";
import "./easysoft.css";

const TRANSLATIONS = {
  en: {
    dir: "ltr",
    brand: "EasySoft",
    tagline: "Accounting & Integrated Solutions",
    nav: { section: "Main Menu", dashboard: "Dashboard", invoices: "Sales Invoices", clients: "Clients & Vendors", inventory: "Inventory", reports: "Financial Reports", users: "Users" },
    search: "Search invoices, clients, or products…",
    logout: "Sign Out",
    role: "System Administrator",
    user: "Abdullah Al-Mansour",
    pageTitle: "Sales Invoices Management",
    pageSub: "View and manage all sales invoices issued to your clients.",
    addNew: "+ New Invoice",
    tableSearch: "Search by client name or invoice number…",
    count: (n,t) => `${n} of ${t} invoices`,
    cols: { date: "Date", client: "Client", id: "Invoice #", items: "Items", actions: "Actions" },
    items: (n) => `${n} item${n===1?"":"s"}`,
    help: { title: "Need help?", body: "Reach our support team 24/7." },
    langLabel: "العربية",
  },
  ar: {
    dir: "rtl",
    brand: "إيزي سوفت",
    tagline: "برامج محاسبة وحلول متكاملة",
    nav: { section: "القائمة الرئيسية", dashboard: "الرئيسية", invoices: "فواتير المبيعات", clients: "العملاء والموردون", inventory: "المخزون", reports: "التقارير المالية", users: "المستخدمون" },
    search: "ابحث عن فاتورة أو عميل أو منتج…",
    logout: "تسجيل الخروج",
    role: "مدير النظام",
    user: "عبدالله المنصور",
    pageTitle: "إدارة فواتير المبيعات",
    pageSub: "عرض وإدارة جميع فواتير المبيعات الصادرة لعملائك.",
    addNew: "+ إضافة فاتورة جديدة",
    tableSearch: "ابحث باسم العميل أو رقم الفاتورة…",
    count: (n,t) => `${n} من ${t} فاتورة`,
    cols: { date: "التاريخ", client: "العميل", id: "رقم الفاتورة", items: "البنود", actions: "الإجراءات" },
    items: (n) => `${n} بند`,
    help: { title: "بحاجة إلى مساعدة؟", body: "تواصل مع الدعم الفني على مدار الساعة." },
    langLabel: "English",
  },
};

const ROWS = [
  { date: "2026-05-08", client: "Bright Future Trading Co.", clientAr: "شركة المستقبل المشرق", id: "INV-1023456", items: 12 },
  { date: "2026-05-05", client: "Gulf Logistics Ltd.", clientAr: "الخليج للخدمات اللوجستية", id: "INV-1098765", items: 5 },
  { date: "2026-05-02", client: "Al-Fahad Office Supplies", clientAr: "مكتب الفهد للتجارة", id: "INV-1076543", items: 3 },
  { date: "2026-04-29", client: "Riyadh Heavy Industries", clientAr: "الرياض للصناعات الثقيلة", id: "INV-1011223", items: 20 },
  { date: "2026-04-22", client: "Silver Supply Group", clientAr: "الإمداد الفضي", id: "INV-1055667", items: 7 },
];

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICONS = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.7 21a2 2 0 0 1-3.4 0",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  box: "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10",
  chart: "M3 3v18h18M7 15l4-4 4 4 5-6",
};

export default function App() {
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("invoices");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROWS;
    return ROWS.filter(r =>
      r.client.toLowerCase().includes(q) || r.clientAr.includes(q) || r.id.toLowerCase().includes(q)
    );
  }, [query]);

  const navItems = [
    { key: "dashboard", label: t.nav.dashboard, icon: ICONS.grid },
    { key: "invoices", label: t.nav.invoices, icon: ICONS.cart },
    { key: "clients", label: t.nav.clients, icon: ICONS.users },
    { key: "inventory", label: t.nav.inventory, icon: ICONS.box },
    { key: "reports", label: t.nav.reports, icon: ICONS.chart },
    { key: "users", label: t.nav.users, icon: ICONS.users },
  ];

  return (
    <div className="es-app" dir={t.dir} lang={lang}>
      <aside className="es-sidebar" aria-label={t.nav.section}>
        <div className="es-brand">
          <div className="es-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32"><path d="M16 3l11 6v14l-11 6L5 23V9z" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="16" cy="16" r="3.5" fill="currentColor"/></svg>
          </div>
          <div>
            <h1 className="es-brand-name">{t.brand}</h1>
            <p className="es-brand-tag">{t.tagline}</p>
          </div>
        </div>

        <nav className="es-nav" aria-label="Primary">
          <p className="es-nav-section">{t.nav.section}</p>
          <ul>
            {navItems.map(n => (
              <li key={n.key}>
                <button
                  type="button"
                  className={`es-nav-link ${active === n.key ? "is-active" : ""}`}
                  onClick={() => setActive(n.key)}
                  aria-current={active === n.key ? "page" : undefined}
                >
                  <Icon d={n.icon} />
                  <span>{n.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="es-help">
          <h3>{t.help.title}</h3>
          <p>{t.help.body}</p>
        </div>
      </aside>

      <div className="es-main">
        <header className="es-topbar" role="banner">
          <div className="es-search">
            <Icon d={ICONS.search} />
            <input type="search" placeholder={t.search} aria-label={t.search} />
          </div>
          <button className="es-icon-btn" aria-label="Notifications">
            <Icon d={ICONS.bell} />
            <span className="es-dot" />
          </button>
          <div className="es-user">
            <div className="es-avatar" aria-hidden="true">{lang === "ar" ? "ع" : "A"}</div>
            <div className="es-user-meta">
              <strong>{t.user}</strong>
              <span>{t.role}</span>
            </div>
          </div>
          <button className="es-logout" type="button">
            <Icon d={ICONS.logout} />
            <span>{t.logout}</span>
          </button>
          <button
            className="es-lang"
            type="button"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            aria-label="Switch language"
          >
            {t.langLabel}
          </button>
        </header>

        <main className="es-content">
          <section className="es-page-head">
            <div className="es-page-head-icon" aria-hidden="true"><Icon d={ICONS.cart} /></div>
            <div className="es-page-head-text">
              <h2>{t.pageTitle}</h2>
              <p>{t.pageSub}</p>
            </div>
            <button className="es-primary-btn" type="button">{t.addNew}</button>
          </section>

          <section className="es-card">
            <div className="es-card-head">
              <div className="es-search es-search--inline">
                <Icon d={ICONS.search} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.tableSearch}
                  aria-label={t.tableSearch}
                />
              </div>
              <span className="es-count">{t.count(filtered.length, ROWS.length)}</span>
            </div>

            <div className="es-table-wrap">
              <table className="es-table">
                <thead>
                  <tr>
                    <th>{t.cols.date}</th>
                    <th>{t.cols.client}</th>
                    <th>{t.cols.id}</th>
                    <th>{t.cols.items}</th>
                    <th>{t.cols.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td className="es-mono">{r.date}</td>
                      <td>{lang === "ar" ? r.clientAr : r.client}</td>
                      <td className="es-mono">{r.id}</td>
                      <td><span className="es-chip">{t.items(r.items)}</span></td>
                      <td>
                        <div className="es-actions">
                          <button className="es-act es-act--edit" aria-label="Edit"><Icon d={ICONS.edit} /></button>
                          <button className="es-act es-act--del" aria-label="Delete"><Icon d={ICONS.trash} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
