import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeRequestApi } from "../../../rest_api";
import {
  createRequest, updateRequest, getRequest,
  previewNextRequestNo, STATUSES, PRIORITIES,
} from "../store";

const emptyItem = () => ({
  Description: "", ModuleName: "", Priority: "Medium",
  EstimatedHours: "", Notes: "",
});

const AddEditModification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);

  const [form, setForm] = useState({
    RequestNo: "",
    RequestDate: new Date().toISOString().split("T")[0],
    CustomerID: "", CustomerName: "",
    ContactPerson: "",
    StaffId: "", StaffName: "",
    Status: "New",
    Items: [emptyItem()],
    DeveloperId: "", DeveloperName: "",
    StartDate: "", DeliveryDate: "",
    ActualHours: "", Cost: "",
    DevResponse: "", CompletionNotes: "", RejectReason: "",
  });

  useEffect(() => {
    makeRequestApi("http://localhost:1150/api/Codes/Customers", "GET")
      .then(r => setClients(r.data || [])).catch(() => {});
    makeRequestApi("http://localhost:1150/api/Codes/Staffs", "GET")
      .then(r => setStaff(r.data || [])).catch(() => {});

    if (isEdit) {
      const rec = getRequest(id);
      if (rec) setForm({ ...form, ...rec, Items: rec.Items?.length ? rec.Items : [emptyItem()] });
    } else {
      setForm(f => ({ ...f, RequestNo: previewNextRequestNo() }));
    }
    // eslint-disable-next-line
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setItem = (idx, k, v) => setForm(f => ({
    ...f, Items: f.Items.map((it, i) => i === idx ? { ...it, [k]: v } : it)
  }));

  const addRow = () => setForm(f => ({ ...f, Items: [...f.Items, emptyItem()] }));
  const removeRow = (idx) => setForm(f => ({
    ...f, Items: f.Items.length > 1 ? f.Items.filter((_, i) => i !== idx) : f.Items
  }));

  const handleCustomer = (val) => {
    const c = clients.find(x => String(x.CustomerID) === String(val) || x.CustomerName === val);
    setForm(f => ({ ...f, CustomerID: c?.CustomerID || val, CustomerName: c?.CustomerName || val }));
  };
  const handleStaff = (val) => {
    const s = staff.find(x => String(x.StaffId) === String(val));
    setForm(f => ({ ...f, StaffId: val, StaffName: s?.StaffName || "" }));
  };
  const handleDev = (val) => {
    const s = staff.find(x => String(x.StaffId) === String(val));
    setForm(f => ({ ...f, DeveloperId: val, DeveloperName: s?.StaffName || "" }));
  };

  const priorityRank = { High: 3, Medium: 2, Low: 1 };
  const computeTopPriority = (items) => {
    const found = (items || []).map(i => i.Priority).filter(Boolean);
    if (!found.length) return "";
    return found.sort((a, b) => (priorityRank[b] || 0) - (priorityRank[a] || 0))[0];
  };

  const handleSubmit = () => {
    if (!form.CustomerName || !form.StaffId) {
      window.alert("يجب اختيار الشركة ومهندس الدعم");
      return;
    }
    const payload = { ...form, TopPriority: computeTopPriority(form.Items) };
    if (isEdit) {
      updateRequest(id, payload);
    } else {
      createRequest(payload);
    }
    navigate("/modifications");
  };

  return (
    <div className="d-flex justify-content-center align-items-center col-12">
      <div className="col-12 d-flex flex-wrap border rounded-4 mt-4" style={{ backgroundColor: "white" }}>
        <div className="col-12 d-flex justify-content-between align-items-center border-bottom">
          <h4 className="m-4">{isEdit ? "تعديل" : "إضافة"} طلب تعديل</h4>
        </div>

        {/* Main info */}
        <div className="p-4 col-12 d-flex flex-wrap">
          <div className="p-2 col-12 col-md-3">
            <label className="form-label fw-semibold">رقم الطلب</label>
            <input type="text" className="form-control" value={form.RequestNo} disabled />
          </div>
          <div className="p-2 col-12 col-md-3">
            <label className="form-label fw-semibold">تاريخ الطلب</label>
            <input type="date" className="form-control" value={form.RequestDate} onChange={e => set("RequestDate", e.target.value)} />
          </div>
          <div className="p-2 col-12 col-md-3">
            <label className="form-label fw-semibold">الحالة</label>
            <select className="form-select" value={form.Status} onChange={e => set("Status", e.target.value)}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="p-2 col-12 col-md-3">
            <label className="form-label fw-semibold">جهة الاتصال</label>
            <input type="text" className="form-control" value={form.ContactPerson} onChange={e => set("ContactPerson", e.target.value)} />
          </div>

          <div className="p-2 col-12 col-md-6">
            <label className="form-label fw-semibold">الشركة (العميل)</label>
            <input type="text" className="form-select" list="mr-clients" value={form.CustomerName} onChange={e => handleCustomer(e.target.value)} />
            <datalist id="mr-clients">
              {clients.map(c => <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>)}
            </datalist>
          </div>
          <div className="p-2 col-12 col-md-6">
            <label className="form-label fw-semibold">مهندس الدعم</label>
            <select className="form-select" value={form.StaffId} onChange={e => handleStaff(e.target.value)}>
              <option value="" disabled>-- اختر --</option>
              {staff.map(s => <option key={s.StaffId} value={s.StaffId}>{s.StaffName}</option>)}
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="col-12 px-4 pb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">تفاصيل التعديلات</h5>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addRow}>
              <i className="bi bi-plus-lg"></i> إضافة سطر
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "30%" }}>الوصف</th>
                  <th>القائمة/الموديول</th>
                  <th style={{ width: 130 }}>الأولوية</th>
                  <th style={{ width: 120 }}>الساعات المقدرة</th>
                  <th>ملاحظات</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {form.Items.map((it, i) => (
                  <tr key={i}>
                    <td><textarea rows={1} className="form-control" value={it.Description} onChange={e => setItem(i, "Description", e.target.value)} /></td>
                    <td><input className="form-control" value={it.ModuleName} onChange={e => setItem(i, "ModuleName", e.target.value)} /></td>
                    <td>
                      <select className="form-select" value={it.Priority} onChange={e => setItem(i, "Priority", e.target.value)}>
                        {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </td>
                    <td><input type="number" min="0" step="0.5" className="form-control" value={it.EstimatedHours} onChange={e => setItem(i, "EstimatedHours", e.target.value)} /></td>
                    <td><input className="form-control" value={it.Notes} onChange={e => setItem(i, "Notes", e.target.value)} /></td>
                    <td>
                      <button type="button" className="lv-icon-btn lv-delete" onClick={() => removeRow(i)} title="حذف">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Execution info */}
        <div className="col-12 px-4 pb-2">
          <h5>معلومات التنفيذ</h5>
        </div>
        <div className="p-2 col-12 d-flex flex-wrap px-4 pb-4">
          <div className="p-2 col-12 col-md-4">
            <label className="form-label fw-semibold">المطور</label>
            <select className="form-select" value={form.DeveloperId} onChange={e => handleDev(e.target.value)}>
              <option value="">-- اختر --</option>
              {staff.map(s => <option key={s.StaffId} value={s.StaffId}>{s.StaffName}</option>)}
            </select>
          </div>
          <div className="p-2 col-6 col-md-4">
            <label className="form-label fw-semibold">تاريخ البدء</label>
            <input type="date" className="form-control" value={form.StartDate || ""} onChange={e => set("StartDate", e.target.value)} />
          </div>
          <div className="p-2 col-6 col-md-4">
            <label className="form-label fw-semibold">تاريخ التسليم</label>
            <input type="date" className="form-control" value={form.DeliveryDate || ""} onChange={e => set("DeliveryDate", e.target.value)} />
          </div>
          <div className="p-2 col-6 col-md-4">
            <label className="form-label fw-semibold">الساعات الفعلية</label>
            <input type="number" min="0" step="0.5" className="form-control" value={form.ActualHours} onChange={e => set("ActualHours", e.target.value)} />
          </div>
          <div className="p-2 col-6 col-md-4">
            <label className="form-label fw-semibold">التكلفة</label>
            <input type="number" min="0" step="0.01" className="form-control" value={form.Cost} onChange={e => set("Cost", e.target.value)} />
          </div>
          <div className="p-2 col-12">
            <label className="form-label fw-semibold">رد التطوير</label>
            <textarea rows={2} className="form-control" value={form.DevResponse} onChange={e => set("DevResponse", e.target.value)} />
          </div>
          <div className="p-2 col-12 col-md-6">
            <label className="form-label fw-semibold">ملاحظات الإنجاز</label>
            <textarea rows={2} className="form-control" value={form.CompletionNotes} onChange={e => set("CompletionNotes", e.target.value)} />
          </div>
          <div className="p-2 col-12 col-md-6">
            <label className="form-label fw-semibold">سبب الرفض/التأخير</label>
            <textarea rows={2} className="form-control" value={form.RejectReason} onChange={e => set("RejectReason", e.target.value)} />
          </div>
        </div>

        <div className="col-12 px-4 pb-4 d-flex justify-content-end">
          <button className="btn btn-primary mx-2" onClick={handleSubmit}>تنفيذ</button>
          <Link to="/modifications" className="btn btn-secondary">الغاء</Link>
        </div>
      </div>
    </div>
  );
};

export default AddEditModification;
