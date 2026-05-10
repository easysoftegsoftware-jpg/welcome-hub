import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";
import { Link, useParams } from "react-router-dom";
import AlertBoxModel from "../../../components/AlertBoxModel";
import { handleInputsNeedValidation } from "../validation";
import ModelTableAppointment from "./ModalTableAppointment";

const AddEditVisit = ()=>{
    let {id} = useParams();
    const [errInputs, setErrInput] = useState([]);
    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/visits/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/visits/add') !== -1 ? true : false
    }
    let [clientsData, setClientsData] = useState([]);
    let [staffData, setStaffData] = useState([]);
    let getStaffId = localStorage.getItem("staff_id");
    let getStaffType = localStorage.getItem("staff_type");

    let defSelectStaff = editOrAdd.addPage ? getStaffId:"";
    let [appointmentData, setAppointmentData] = useState([]);
    const defModule = {
        VisitNo: editOrAdd.addPage ? "":id, AppointmentNo: "" , VisitDate: new Date().toJSON().split("T")[0] ,
        VisitType: "0", CustomerID: "", StaffId: defSelectStaff, WhatDone: "", Notes: "", IsRealVisit: true, IsReviewed: false,
        CallReason: "", Email: "", PersonName: "", 
    };

    let [valueMyInputs, setValueMyInputs] = useState(defModule);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("")

    const handleSubmit = ()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);

        setErrInput(getCheckStatus);

        
        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage)){
                try {
                    makeRequestApi(`http://localhost:1150/api/Trans/Visits`, editOrAdd.addPage ? "POST":"PUT", valueMyInputs)
                    .then(response => {
                        setResponseMsg(editOrAdd.addPage ? "عملية إضافة ناجحة" : "عملية تعديل ناجحة");
                        editOrAdd.addPage && setValueMyInputs(defModule);
                        getElementClickAlert && getElementClickAlert.click();
                        setLoadingInsert(false);
                    })
                } catch (error) {
                    window.alert("حدث خطاء في معالجة الطلب")
                }
        }
    }

    const handleAutoFillClient = (ID_Appointment)=>{
        setValueMyInputs(state => {return {...state, AppointmentNo: ID_Appointment}})
        let getAppointmentClientID = appointmentData.filter(ele => ele.AppointmentNo === Number(ID_Appointment))[0]
        
        if(getAppointmentClientID){
            let getClient = clientsData.filter(ele => ele.CustomerID === Number(getAppointmentClientID.CustomerID))[0]
            if(getClient){
                setValueMyInputs(state => {return {...state, CallReason: getAppointmentClientID.CallReason, Email: getClient.Email,  CustomerID: getClient.CustomerID}})
            }
        }
    }

    useEffect(()=>{
        
        makeRequestApi(`http://localhost:1150/api/Codes/Customers`, "GET")
            .then(res => {
                setClientsData(res.data)
            }) 
            makeRequestApi(`http://localhost:1150/api/Trans/Appointments`, "GET")
            .then(res => {
                setAppointmentData(res.data)
            }) 
            makeRequestApi(`http://localhost:1150/api/Codes/Staffs`, "GET")
            .then(res => {
                setStaffData(res.data)
            }) 

            if(editOrAdd.editPage){
                try {
                    makeRequestApi(`http://localhost:1150/api/Trans/Visits?VisitNo=${id}`, "GET")
                    .then(res => {
                        res.data.VisitDate = res.data.VisitDate.split("T")[0]
                        
                        setValueMyInputs(state => {return {...state, ...res.data}})
                    })
                } catch (error) {
                    window.alert("حدث خطاء اثناء البيانات")
                }
            }

    }, [editOrAdd.editPage, id])


    return(
        <>
            <div className="d-flex justify-content-center align-items-center col-12">
                <div className="col-12  border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="col-12 d-flex justify-content-between align-items-center border-bottom">
                        <h4 className="m-4">إضافة زيارة</h4>
                        {getStaffId === "2" &&
                            <div class="d-flex mx-2 form-check form-switch">
                                <input className="form-check-input" style={{padding: ".7rem 1.5em"}} type="checkbox" id="IsRealVisit" checked={valueMyInputs.IsRealVisit} onChange={(e)=>setValueMyInputs(state => {return {...state, IsRealVisit: e.target.checked}})}/>
                                <label className="form-check-label mx-2 fs-6" htmlFor="IsRealVisit">تحسب كزيارة</label>
                            </div>
                        }

                    </div>
                    <div className="p-4 col-12 d-flex flex-wrap">

                        <div className={getStaffType === "2" ? "p-1 col-6 col-md-4 col-lg-3":"p-1 col-6 col-md-6 col-lg-4"}>
                            <label htmlFor="VisitDate" className="form-label">تاريخ الزيارة</label>
                            <input type="date" id="VisitDate" onChange={(e)=>setValueMyInputs(data => {return {...data, VisitDate: e.target.value}})} value={valueMyInputs.VisitDate} className="form-control"/>
                        </div>
                        <div className={getStaffType === "2" ? "p-1 col-6 col-md-4 col-lg-3":"p-1 col-6 col-md-6 col-lg-4"}>
                            {errInputs.map(err => err.name === "AppointmentNo" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                            <label htmlFor="AppointmentNo" className="form-label">رقم الميعاد</label>
                            <button  id={`btn_choose_appointment`} className={`btn border col-12 ${errInputs.filter(ele => ele.name === "AppointmentNo").length > 0 ? "input_error":""}`} data-bs-toggle="modal" data-bs-target="#modelTabelAppointment">
                                {valueMyInputs.AppointmentNo ? valueMyInputs.AppointmentNo:"اختر رقم الميعاد"}
                            </button>
                            {/* <select id="AppointmentNo" disabled={editOrAdd.editPage ? true:false} value={valueMyInputs.AppointmentNo}
                                onChange={(e)=>{
                                    setValueMyInputs(state => {return {...state, AppointmentNo: e.target.value}});
                                    handleAutoFillClient(e.target.value)
                                }} className={`form-select ${errInputs.filter(ele => ele.name === "AppointmentNo").length > 0 ? "input_error":""}`}>
                                <option value={""} disabled>--اختر--</option>
                                {appointmentData.map(appointment => 
                                    <option value={appointment.AppointmentNo}  key={appointment.AppointmentNo}>{appointment.AppointmentNo}</option>
                                )}
                            </select> */}
                        </div>
                        <div className={getStaffType === "2" ? "p-1 col-6 col-md-4 col-lg-3":"p-1 col-6 col-md-6 col-lg-4"}>
                            <label htmlFor="VisitType" className="form-label">نوع الزيارة</label>
                            <select id="VisitType" onChange={(e)=>setValueMyInputs(data => {return {...data, VisitType: e.target.value}})} value={valueMyInputs.VisitType} className="form-select">
                                <option value={"0"} selected disabled>-- بدون تحديد --</option>
                                <option value={"1"}>اون لاين</option>
                                <option value={"2"}>تدريب</option>
                                <option value={"3"}>لدي عميل</option>
                            </select>
                        </div>
                        {getStaffType === "2" &&
                            <div className="p-1 col-6 col-md-6 col-lg-3">
                                {errInputs.map(err => err.name === "StaffId" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                                <label htmlFor="StaffId"  className="form-label">مهندس الدعم</label>
                                <select id="StaffId"  onChange={(e)=>setValueMyInputs(data => {return {...data, StaffId: e.target.value}})} value={valueMyInputs.StaffId} className="form-select">
                                    <option value={""} selected disabled>مهندس الدعم</option>
                                    {staffData.map(staff => 
                                        <option value={staff.StaffId}>{staff.StaffName}</option>
                                    )}
                                    
                                </select>
                            </div>
                        }

                        <div className={getStaffType === "2" ? "p-1 col-12 col-md-6 col-lg-4":"p-1 col-6 col-md-6 col-lg-4"}>
                            {errInputs.map(err => err.name === "CustomerID" && <span className="col-12 text-danger">{err.errMsg}</span>)}    

                            <label htmlFor="CustomerID" className="form-label">العميل</label>
                            <select id="CustomerID" disabled value={valueMyInputs.CustomerID} onChange={(e)=>{setValueMyInputs(state => {return {...state, CustomerID: e.target.value}});}}
                            className={`form-select ${errInputs.filter(ele => ele.name === "CustomerID").length > 0 ? "input_error":""}`}>
                                <option>-- غير محدد --</option>
                                {clientsData.map(client => 
                                    <option value={client.CustomerID}  key={client.CustomerID}>{client.CustomerName}</option>
                                )}
                            </select>
                        </div>
                        


                        <div className="p-1 col-12 col-md-6 col-lg-4">
                            <label htmlFor="Email" className="form-label">بريد الكتروني العميل</label>
                            <input type="email" disabled id="Email" value={valueMyInputs.Email} onChange={(e)=>setValueMyInputs(data => {return {...data, Email: e.target.value}})} className="form-control"/>
                        </div>

                        <div className="p-1 col-12 col-md-6 col-lg-4">
                            <label htmlFor="PersonName" className="form-label">إسم المسئول</label>
                            <input type="text" id="PersonName" value={valueMyInputs.PersonName} onChange={(e)=>setValueMyInputs(data => {return {...data, PersonName: e.target.value}})} className="form-control"/>
                        </div>


                        {/* <div className="col-sm-6 col-md-4 col-lg-6">
                            <label htmlFor="inputEmail4" className="form-label">ساعة فتح الزيارة</label>
                            <input type="time" onChange={(e)=>setValueMyInputs(data => {return {...data, time_open_visit: e.target.value}})} value={valueMyInputs.time_open_visit} className="form-control" id="inputEmail4"/>
                        </div>
                        
                        <div className="col-sm-6 col-md-4 col-lg-6">
                            <label htmlFor="inputEmail4" className="form-label">ساعة إغلاق الزيارة</label>
                            <input type="time" onChange={(e)=>setValueMyInputs(data => {return {...data, time_close_visit: e.target.value}})} value={valueMyInputs.time_close_visit} className="form-control" id="inputEmail4"/>
                        </div> */}

                        <div className="p-1 col-12 col-md-6">
                            {errInputs.map(err => err.name === "CallReason" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                            <label htmlFor="CallReason" className="form-label">سبب الإتصال</label>
                            <textarea className={`form-control ${errInputs.filter(ele => ele.name === "CallReason").length > 0 ? "input_error":""} `} disabled id="CallReason" onChange={(e)=>setValueMyInputs(data => {return {...data, CallReason: e.target.value}})} value={valueMyInputs.CallReason}  rows="3"></textarea>
                        </div>
                        <div className="p-1 col-12 col-md-6">
                            {errInputs.map(err => err.name === "WhatDone" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                            <label htmlFor="WhatDone" className="form-label">ما تم إنجازة</label>
                            <textarea className={`form-control ${errInputs.filter(ele => ele.name === "WhatDone").length > 0 ? "input_error":""} `} id="WhatDone" onChange={(e)=>setValueMyInputs(data => {return {...data, WhatDone: e.target.value}})} value={valueMyInputs.WhatDone} rows="3"></textarea>
                        </div>
                        <div className="p-1 col-12">
                            <label htmlFor="Notes" className="form-label">ما تم الاتفاق علية</label>
                            <textarea className="form-control" id="Notes" onChange={(e)=>setValueMyInputs(data => {return {...data, Notes: e.target.value}})} value={valueMyInputs.Notes}  rows="3"></textarea>
                        </div>

                    </div>
                    <div className="px-4 pb-4 d-flex justify-content-end">

                        {loadingInsert ?
                            <button type="button" disabled className="btn btn-primary d-flex align-items-center">
                                <div className="spinner-border border-2 h-2" style={{height: "20px", width: "20px", margin: "0 10px"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div>جاري التنفيذ</div>
                            </button>
                            :
                            <button className="btn btn-primary mx-4"
                                // disabled={valueMyInputs.ModuleName.length > 1 ? false:true}
                                onClick={handleSubmit}
                            >تنفيذ</button>
                        }

                        <Link to="/visits" className="btn btn-secondary">الغاء</Link>                        
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />
            <ModelTableAppointment ActionChooseAppointment={handleAutoFillClient}/>
        </>
    )
}

export default AddEditVisit;