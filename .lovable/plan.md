# Visual Refactor Plan

Goal: give the existing CRA-style admin app (Bootstrap RTL + custom CSS) a modern look — dark navy sidebar, blue gradient accents, card-based content, and a polished data table — without changing any business logic, routes, or API calls. Also: add a generic "search any column" text input on every list page.

## Scope (visual + table search only)

- Sidebar (`src/components/Layout.js`)
- Global theme tokens (`src/style.css`, `src/dashboard.rtl.css`)
- Reusable Table (`src/components/Table.js`)
- Action buttons (`EditAction.js`, `DeleteAction.js`, `DoneAction.js`, `IsRealVisit.js`, `IsReviewed.js`, `SendMail.js`, `SendAlert.js`)
- Signin page (`src/pages/login/Signin.js`) — light polish to match palette
- No changes to routes, auth flow, API endpoints, validations, or data shapes

## Design Direction

- Palette (CSS variables in `src/style.css`):
  - `--navy-900: #0b1220` (sidebar bg)
  - `--navy-800: #111a2e` (sidebar hover/active)
  - `--blue-500: #3b82f6`, `--blue-400: #60a5fa` (accents)
  - `--gradient-primary: linear-gradient(135deg, #3b82f6, #6366f1)`
  - `--bg: #f4f6fb` (page bg), `--card: #ffffff`, `--border: #e6e9f2`
  - `--text: #0f172a`, `--muted: #64748b`
  - `--shadow-card: 0 6px 24px -12px rgba(15,23,42,.18)`
- Typography: keep Bootstrap defaults but bump headings weight (700) and use letter-spacing on table headers.
- Radius: `--radius: 14px` for cards, `10px` for inputs/buttons, pill (`999px`) for chips.

## Sidebar (dark navy)

- `header` + `nav.navbar_dashboard` get dark navy background, white text, subtle blue left-border on active item.
- Section headings ("التقرير") in muted slate.
- Active/hover rows: `background: rgba(59,130,246,.12)`, `color: var(--blue-400)`, icon inherits.
- Logo block sits on `--navy-800` with bottom divider.
- Mobile slide-over keeps existing toggle behavior; only colors change.
- Top header bar (right side) becomes white card with soft shadow; avatar + name + logout button restyled (logout becomes ghost button with blue hover).

## Card-based content

- `main` content gets `padding` + `background: var(--bg)`.
- Each list page already renders through `<Table />`; the Table outer wrapper becomes the card:
  - Replace `bg-white border rounded-4` with `.lv-card` (white, `--radius`, `--shadow-card`, no border).
- Add/Edit forms: wrap existing forms with `.lv-card` via small CSS rule on `main > form, main > .form-container` (non-invasive — no JSX changes needed for form pages).

## Data Table refactor (`Table.js`)

Visual + one functional addition (global search). Logic preserved.

- Header row of card:
  - Left: `<h3>` title + small muted record count.
  - Right: primary "+ Add" button using gradient (`background: var(--gradient-primary)`, white text, rounded 10px, soft shadow).
- New: **global search input** always visible (icon + input, ~280px), filters across all string-castable fields in `data`. Existing per-column search (click header) is kept as a secondary filter.
  - Implementation: add `globalQuery` state; when set, filter `myData` by `Object.values(record).some(v => String(v).match(regex))`. When empty, fall back to current behavior. No prop changes needed; works for every page that uses `<Table />`.
- Table styling:
  - `thead` background `#f8fafc`, uppercase 12px, muted color, sticky on scroll.
  - Row hover: `background: rgba(59,130,246,.06)`.
  - Cell padding 14px 16px; bottom border `1px solid var(--border)`.
- **Chips** for status-like fields (auto-detected by field name):
  - `IsStaffType` / role text → blue pill
  - `IsReal`, `IsReviewed`, `IsDone` truthy → green pill ("تم"), falsy → amber pill ("معلق")
  - Date fields → neutral slate pill with calendar icon
  - Implementation: small `renderCell(field, value)` helper inside Table; falls back to plain text. Heading config can opt-in via `head.chip: true|"status"|"date"` (optional, backwards compatible).
- **Action buttons** (Edit/Delete/Done/etc.):
  - Restyle to 32x32 icon buttons inside a flex `gap-1` container.
  - Edit: outlined blue (`border: 1px solid var(--blue-500)`, blue icon, hover fills gradient).
  - Delete: outlined red, hover fills red.
  - Done/IsReal/IsReviewed: ghost with green check when true, muted circle when false.
  - SendMail/SendAlert: ghost blue with hover lift.
  - Done by editing each action component's className/markup only — same props, same handlers, same modals.
- Pagination: replace the two arrow buttons with a compact pill group ("السابق · 1 / N · التالي") styled in blue; keep existing handlers.
- Empty state: when `spliceData.length === 0`, show centered illustration text "لا توجد بيانات".

## Signin page polish

- Centered card on `--bg`, gradient accent strip on top of the card, primary button uses `--gradient-primary`. No logic change.

## Files to edit

- `src/style.css` — add CSS variables, `.lv-card`, `.lv-btn-primary`, `.lv-chip-*`, table overrides, sidebar overrides.
- `src/dashboard.rtl.css` — override `.sidebar` colors and nav-link states.
- `src/components/Layout.js` — class additions only (no structural change) for navy theme + active link handling via `react-router-dom`'s `useLocation`.
- `src/components/Table.js` — add global search, chip rendering, restyled header/pagination/empty state.
- `src/components/EditAction.js`, `DeleteAction.js`, `DoneAction.js`, `IsRealVisit.js`, `IsReviewed.js`, `SendMail.js`, `SendAlert.js` — className updates.
- `src/pages/login/Signin.js` — wrapper card + button styling.

## Out of scope

- No changes to API URLs, auth, routing, role logic, validations, modal behavior.
- No new dependencies (stay on Bootstrap RTL + bootstrap-icons already present).
- No data model changes; chip detection is purely presentational.

## Acceptance

- Sidebar renders dark navy with blue active states; collapsible mobile drawer still works.
- All list pages (Agents, Clients, Modules, Staff, Appointments, Visits, Contracts, VisitsClients, TotalClientsTraffic, alerts) show a card-wrapped table with a top-right "Add" gradient button and a global search box that filters rows live.
- Action buttons render as compact icon buttons; status fields render as colored chips.
- Build (`bunx vite build --mode development`) succeeds; no console errors on `/clients`, `/agents`, `/visits`.
