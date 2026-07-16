import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRequest, getStatusMeta, getPriorityMeta } from "./store";

const Row = ({ label, children }) => (
  <div className="p-2 col-12 col-md-6">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{children || "—"}</div>
  </div>
);

const Details = () => {
  const { id } = useParams();
  const [rec, setRec] = useState(null);
  useEffect(() => { setRec(getRequest(id)); }, [id]);

  if (!rec) {
    return (
      <div className="lv-card p-5 text-center">
        <div className="mb-3">الطلب غير موجود</div>
        <Link to="/modifications" className="btn btn-primary">رجوع للقائمة</Link>
      </div>
    );
  }
  const sm = getStatusMeta(rec.Status);

  return (
    <>
      <div className="lv-card">
        <div className="lv-card-header d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <h3 className="m-0">{rec.RequestNo}</h3>
            <span style={{ background: sm.bg, color: sm.color, padding: "4px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{sm.label}</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => window.print()}>
              <i className="bi bi-printer"></i> طباعة
            </button>
            <Link to={`/modifications/edit/${rec.RequestNo}`} className="btn btn-primary">
              <i className="bi bi-pencil-square"></i> تعديل
            </Link>
            <Link to="/modifications" className="btn btn-secondary">رجوع</Link>
          </div>
        </div>

        <div className="p-4">
          <h5>البيانات الأساسية</h5>
          <div className="d-flex flex-wrap">
            <Row label="تاريخ الطلب">{rec.RequestDate}</Row>
            <Row label="الشركة">{rec.CustomerName}</Row>
            <Row label="جهة الاتصال">{rec.ContactPerson}</Row>
            <Row label="مهندس الدعم">{rec.StaffName}</Row>
          </div>
        </div>

        <div className="p-4 pt-0">
          <h5>تفاصيل التعديلات</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>الوصف</th>
                  <th>القائمة</th>
                  <th>الأولوية</th>
                  <th>الساعات المقدرة</th>
                  <th>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {(rec.Items || []).map((it, i) => {
                  const p = getPriorityMeta(it.Priority);
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{it.Description || "—"}</td>
                      <td>{it.ModuleName || "—"}</td>
                      <td><span style={{ background: p.bg, color: p.color, padding: "3px 9px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{p.label}</span></td>
                      <td>{it.EstimatedHours || "—"}</td>
                      <td>{it.Notes || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 pt-0">
          <h5>معلومات التنفيذ</h5>
          <div className="d-flex flex-wrap">
            <Row label="المطور">{rec.DeveloperName}</Row>
            <Row label="تاريخ البدء">{rec.StartDate}</Row>
            <Row label="تاريخ التسليم">{rec.DeliveryDate}</Row>
            <Row label="الساعات الفعلية">{rec.ActualHours}</Row>
            <Row label="التكلفة">{rec.Cost}</Row>
            <Row label="رد التطوير">{rec.DevResponse}</Row>
            <Row label="ملاحظات الإنجاز">{rec.CompletionNotes}</Row>
            <Row label="سبب الرفض/التأخير">{rec.RejectReason}</Row>
          </div>
        </div>

        <div className="p-4 pt-0">
          <h5>سجل الأحداث</h5>
          <ul className="list-group">
            {(rec.Timeline || []).map((t, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <div>
                  <div className="fw-semibold">{t.label || t.action}</div>
                  <div className="text-muted small">{t.user}</div>
                </div>
                <div className="text-muted small">{new Date(t.at).toLocaleString()}</div>
              </li>
            ))}
            {(!rec.Timeline || !rec.Timeline.length) && <li className="list-group-item text-muted">لا يوجد</li>}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Details;
