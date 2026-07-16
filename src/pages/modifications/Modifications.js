import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listRequests, deleteRequest, getStatusMeta, getPriorityMeta, STATUSES, PRIORITIES } from "./store";

const StatusBadge = ({ value }) => {
  const m = getStatusMeta(value);
  return (
    <span style={{
      background: m.bg, color: m.color, padding: "4px 10px",
      borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
    }}>{m.label}</span>
  );
};

const PriorityBadge = ({ value }) => {
  if (!value) return <span className="text-muted">—</span>;
  const m = getPriorityMeta(value);
  return (
    <span style={{
      background: m.bg, color: m.color, padding: "3px 9px",
      borderRadius: 6, fontSize: 12, fontWeight: 600
    }}>{m.label}</span>
  );
};

const Modifications = () => {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => { setRows(listRequests()); }, []);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (status && r.Status !== status) return false;
      if (priority && r.TopPriority !== priority) return false;
      if (dateFrom && r.RequestDate < dateFrom) return false;
      if (dateTo && r.RequestDate > dateTo) return false;
      if (q.trim()) {
        const s = q.trim().toLowerCase();
        const hay = [
          r.RequestNo, r.CustomerName, r.ContactPerson,
          ...(r.Items || []).map(i => i.Description || "")
        ].join(" ").toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [rows, q, status, priority, dateFrom, dateTo]);

  const handleDelete = (no) => {
    if (!window.confirm("تأكيد حذف الطلب؟")) return;
    deleteRequest(no);
    setRows(listRequests());
  };

  return (
    <div className="lv-card">
      <div className="lv-card-header">
        <div className="d-flex align-items-center">
          <h3>طلبات التعديل</h3>
          <span className="lv-count">{filtered.length}</span>
        </div>
        <div className="lv-search">
          <i className="bi bi-search"></i>
          <input
            type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder="بحث برقم / شركة / جهة اتصال / وصف..."
          />
        </div>
        <Link to="/modifications/add" className="lv-btn-primary">
          <i className="bi bi-plus-lg"></i><span>طلب تعديل جديد</span>
        </Link>
      </div>

      <div className="p-3 d-flex flex-wrap gap-2 border-bottom">
        <select className="form-select" style={{ maxWidth: 200 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">كل الحالات</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 180 }} value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">كل الأولويات</option>
          {PRIORITIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input type="date" className="form-control" style={{ maxWidth: 180 }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="من تاريخ" />
        <input type="date" className="form-control" style={{ maxWidth: 180 }} value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="إلى تاريخ" />
        {(status || priority || dateFrom || dateTo) &&
          <button className="btn btn-outline-secondary btn-sm" onClick={() => { setStatus(""); setPriority(""); setDateFrom(""); setDateTo(""); }}>
            <i className="bi bi-x-lg"></i> مسح الفلاتر
          </button>}
      </div>

      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>التاريخ</th>
              <th>الشركة</th>
              <th>جهة الاتصال</th>
              <th>مهندس الدعم</th>
              <th>المطور</th>
              <th>الأولوية</th>
              <th>الحالة</th>
              <th>تاريخ التسليم</th>
              <th>الساعات</th>
              <th>التكلفة</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.RequestNo}>
                <td><strong>{r.RequestNo}</strong></td>
                <td>{r.RequestDate}</td>
                <td>{r.CustomerName || "—"}</td>
                <td>{r.ContactPerson || "—"}</td>
                <td>{r.StaffName || "—"}</td>
                <td>{r.DeveloperName || "—"}</td>
                <td><PriorityBadge value={r.TopPriority} /></td>
                <td><StatusBadge value={r.Status} /></td>
                <td>{r.DeliveryDate || "—"}</td>
                <td>{r.ActualHours || "—"}</td>
                <td>{r.Cost || "—"}</td>
                <td>
                  <div className="lv-actions">
                    <Link to={`/modifications/details/${r.RequestNo}`} className="lv-icon-btn" title="عرض">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link to={`/modifications/edit/${r.RequestNo}`} className="lv-icon-btn lv-edit" title="تعديل">
                      <i className="bi bi-pencil-square"></i>
                    </Link>
                    <button className="lv-icon-btn lv-delete" title="حذف" onClick={() => handleDelete(r.RequestNo)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 &&
        <div className="lv-empty">
          <i className="bi bi-inbox"></i>
          <div>لا توجد طلبات تعديل</div>
        </div>
      }
    </div>
  );
};

export default Modifications;
