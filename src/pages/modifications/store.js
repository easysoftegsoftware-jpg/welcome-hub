// LocalStorage-backed store for Modification Requests (Phase 1 - mock data).
// Swap these functions for real API calls once backend endpoints are ready.

const KEY = "modification_requests_v1";

export const STATUSES = [
  { value: "New", label: "جديد", color: "#2563eb", bg: "#dbeafe" },
  { value: "SentToDev", label: "تم الإرسال للتطوير", color: "#7c3aed", bg: "#ede9fe" },
  { value: "InProgress", label: "قيد التنفيذ", color: "#ea580c", bg: "#ffedd5" },
  { value: "Waiting", label: "بإنتظار العميل", color: "#ca8a04", bg: "#fef9c3" },
  { value: "Completed", label: "منتهي", color: "#16a34a", bg: "#dcfce7" },
  { value: "Closed", label: "مغلق", color: "#6b7280", bg: "#e5e7eb" },
  { value: "Cancelled", label: "ملغي", color: "#dc2626", bg: "#fee2e2" },
];

export const PRIORITIES = [
  { value: "High", label: "عالية", color: "#dc2626", bg: "#fee2e2" },
  { value: "Medium", label: "متوسطة", color: "#ca8a04", bg: "#fef9c3" },
  { value: "Low", label: "منخفضة", color: "#16a34a", bg: "#dcfce7" },
];

export const getStatusMeta = (v) => STATUSES.find(s => s.value === v) || STATUSES[0];
export const getPriorityMeta = (v) => PRIORITIES.find(s => s.value === v) || PRIORITIES[1];

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
};
const write = (rows) => localStorage.setItem(KEY, JSON.stringify(rows));

const nextRequestNo = (rows) => {
  const year = new Date().getFullYear();
  const prefix = `MR-${year}-`;
  const nums = rows
    .map(r => r.RequestNo)
    .filter(n => typeof n === "string" && n.startsWith(prefix))
    .map(n => parseInt(n.slice(prefix.length), 10) || 0);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
};

export const listRequests = () => read().sort(
  (a, b) => new Date(b.RequestDate) - new Date(a.RequestDate)
);

export const getRequest = (requestNo) => read().find(r => r.RequestNo === requestNo);

export const createRequest = (data) => {
  const rows = read();
  const RequestNo = nextRequestNo(rows);
  const currentUser = localStorage.getItem("staff_name") || "System";
  const now = new Date().toISOString();
  const record = {
    ...data,
    RequestNo,
    CreatedAt: now,
    Timeline: [{
      action: "Request Created",
      label: "تم إنشاء الطلب",
      user: currentUser,
      at: now,
    }],
  };
  rows.push(record);
  write(rows);
  return record;
};

export const updateRequest = (requestNo, patch, timelineEntry) => {
  const rows = read();
  const idx = rows.findIndex(r => r.RequestNo === requestNo);
  if (idx === -1) return null;
  const prev = rows[idx];
  const updated = { ...prev, ...patch };
  const timeline = Array.isArray(prev.Timeline) ? [...prev.Timeline] : [];
  const currentUser = localStorage.getItem("staff_name") || "System";

  if (patch.Status && patch.Status !== prev.Status) {
    timeline.push({
      action: "Status Changed",
      label: `تغيير الحالة إلى ${getStatusMeta(patch.Status).label}`,
      user: currentUser,
      at: new Date().toISOString(),
    });
  }
  if (patch.DeliveryDate && patch.DeliveryDate !== prev.DeliveryDate) {
    timeline.push({
      action: "Delivery Date Updated",
      label: `تحديث تاريخ التسليم: ${patch.DeliveryDate}`,
      user: currentUser,
      at: new Date().toISOString(),
    });
  }
  if (patch.DeveloperId && patch.DeveloperId !== prev.DeveloperId) {
    timeline.push({
      action: "Developer Assigned",
      label: `تعيين المطور: ${patch.DeveloperName || patch.DeveloperId}`,
      user: currentUser,
      at: new Date().toISOString(),
    });
  }
  if (timelineEntry) {
    timeline.push({
      user: currentUser,
      at: new Date().toISOString(),
      ...timelineEntry,
    });
  }
  updated.Timeline = timeline;
  rows[idx] = updated;
  write(rows);
  return updated;
};

export const deleteRequest = (requestNo) => {
  write(read().filter(r => r.RequestNo !== requestNo));
};

export const previewNextRequestNo = () => nextRequestNo(read());
