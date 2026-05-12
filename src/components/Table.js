import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import bootstrapMin from "bootstrap/dist/js/bootstrap.min.js";
import BtnChangeStaff from "./BtnChangeStaff";
import { rolesDesc } from "../roles";
import ModalDelete from './ModalDelete.js';

const isDateField = (field) => /date/i.test(field);
const isStatusField = (field) => /^Is[A-Z]/.test(field);

const renderCellValue = (field, value) => {
    if (value === null || value === undefined || value === "") return <span className="text-muted">—</span>;

    if (field === "IsStaffType") {
        return <span className="lv-chip lv-chip-blue">{rolesDesc[value] || value}</span>;
    }
    if (isStatusField(field) && (value === true || value === false || value === 0 || value === 1)) {
        return value
            ? <span className="lv-chip lv-chip-green"><i className="bi bi-check-circle-fill"></i> تم</span>
            : <span className="lv-chip lv-chip-amber"><i className="bi bi-clock-fill"></i> معلق</span>;
    }
    if (isDateField(field)) {
        return <span className="lv-chip lv-chip-slate"><i className="bi bi-calendar3"></i> {value}</span>;
    }
    return value;
};

const Table = ({title, btn_add, heading = [], data, actions = [], isReviewed, isRealVisit, sendMail, sendAlert, changeStaff, changeAppointmentNo}) => {
    const [currPage, setCurrPage] = useState(1);
    const [myData, setMyData] = useState([]);
    const checkRole = localStorage.getItem("staff_type");
    const [deleteLink, setDeleteLink] = useState("");
    const [globalQuery, setGlobalQuery] = useState("");
    const [sortDate, setSortDate] = useState("a-b");
    const count = 10;

    const filteredData = useMemo(() => {
        if (!globalQuery.trim()) return myData;
        let regex;
        try { regex = new RegExp(globalQuery.trim(), "gi"); }
        catch { return myData; }
        return myData.filter(record =>
            Object.values(record).some(v => v != null && String(v).match(regex))
        );
    }, [myData, globalQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / count));
    const safePage = Math.min(currPage, totalPages);
    const spliceData = filteredData.slice(count * safePage - count, count * safePage);

    const handleChangeCurrPage = (type) => {
        const action = type === "next" ? safePage + 1 : safePage - 1;
        if (action < 1 || action > totalPages) return;
        setCurrPage(action);
    };

    const handleSortData = (field) => {
        const sorted = [...myData].sort((a, b) =>
            sortDate === "new"
                ? new Date(b[field]) - new Date(a[field])
                : new Date(a[field]) - new Date(b[field])
        );
        setSortDate(sortDate === "new" ? "old" : "new");
        setMyData(sorted);
    };

    useEffect(() => {
        setMyData(data || []);
        setCurrPage(1);
        setTimeout(() => {
            document.querySelectorAll("[class='tooltip bs-tooltip-auto fade show']").forEach(t => t.remove());
            const tips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tips].forEach(el => new bootstrapMin.Tooltip(el));
        }, 500);
    }, [data]);

    return (
        <>
            <div className="lv-card">
                <div className="lv-card-header">
                    <div className="d-flex align-items-center">
                        <h3>{title}</h3>
                        <span className="lv-count">{filteredData.length}</span>
                    </div>

                    <div className="lv-search">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            value={globalQuery}
                            onChange={(e) => { setGlobalQuery(e.target.value); setCurrPage(1); }}
                            placeholder="بحث في كل الأعمدة..."
                        />
                    </div>

                    {btn_add &&
                        <Link to={btn_add.link} className="lv-btn-primary">
                            <i className="bi bi-plus-lg"></i>
                            <span>{btn_add.text}</span>
                        </Link>
                    }
                </div>

                <div className="d-flex col-12 table-responsive">
                    <table className="col-12 table table-hover">
                        <thead>
                            <tr>
                                {heading.map((head_title, i) =>
                                    <th key={i} scope="col" style={head_title.styleHead || {}}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>{head_title.title}</span>
                                            {isDateField(head_title.field) &&
                                                <span style={{cursor:"pointer"}} onClick={() => handleSortData(head_title.field)}>
                                                    <i className="bi bi-funnel-fill"></i>
                                                </span>
                                            }
                                        </div>
                                    </th>
                                )}
                                {actions.length > 0 && <th scope="col">اجراء</th>}
                                {isRealVisit && <th scope="col">تم احتسابها</th>}
                                {isReviewed && <th scope="col">تم المراجعة</th>}
                                {sendMail && <th scope="col">ارسال إيميل</th>}
                                {sendAlert && <th scope="col">ارسال تحذير</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {spliceData.map((record, index) =>
                                <tr key={index}>
                                    {heading.map((p, ci) => {
                                        if (p.field === "StaffName" && checkRole === "2" && changeStaff) {
                                            return (
                                                <td key={ci} data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-title={record[p.field] || null}
                                                    style={p.styleRow || {}} className={p.classRow || ""}>
                                                    <BtnChangeStaff setAppointmentNo={changeAppointmentNo}
                                                        staff_name={record[p.field]} appointment_id={record.AppointmentNo} />
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={ci} data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-title={record[p.field] != null ? String(record[p.field]) : null}
                                                style={p.styleRow || {}} className={p.classRow || ""}>
                                                {renderCellValue(p.field, record[p.field])}
                                            </td>
                                        );
                                    })}

                                    {actions.length > 0 &&
                                        <td>
                                            <div className="lv-actions">
                                                {actions.map((Action, ai) =>
                                                    Action.props.href ?
                                                        <span key={ai}>{Action.type({ href: Action.props.href, id: record[Action.props.fieldID], changeLinkDel: setDeleteLink })}</span>
                                                        : <span key={ai}>{Action}</span>
                                                )}
                                            </div>
                                        </td>
                                    }
                                    {isRealVisit && <td>{isRealVisit.type({visit: record})}</td>}
                                    {isReviewed && <td>{isReviewed.type({visit: record})}</td>}
                                    {sendMail && <td>{sendMail.type({contract: record})}</td>}
                                    {sendAlert && <td>{sendAlert.type({contract: record})}</td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {spliceData.length === 0 &&
                    <div className="lv-empty">
                        <i className="bi bi-inbox"></i>
                        <div>لا توجد بيانات</div>
                    </div>
                }

                {filteredData.length > count &&
                    <div className="lv-pagination">
                        <button disabled={safePage <= 1} onClick={() => handleChangeCurrPage("prev")} title="السابق">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                        <span className="lv-page-info">{safePage} / {totalPages}</span>
                        <button disabled={safePage >= totalPages} onClick={() => handleChangeCurrPage("next")} title="التالي">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </div>
                }
            </div>
            <ModalDelete link={deleteLink}/>
        </>
    );
};

export default Table;
