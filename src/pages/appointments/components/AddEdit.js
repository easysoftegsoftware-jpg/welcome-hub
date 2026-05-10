import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";
import { Link, useParams } from "react-router-dom";
import AlertBoxModel from "../../../components/AlertBoxModel";
import { handleInputsNeedValidation } from "../validation";

const AddEditAppointment = ()=>{
    let {id} = useParams();
    const [errInputs, setErrInput] = useState([]);
    let [staffData, setStaffData] = useState([]);
    let [clientsData, setClientsData] = useState([]);
    let defClientStatus = {
        IsInContractGranty: "", ContractNo: "", RemainVisits: "", ContractVisits: "",
        ContractDate: "", VisitDate: "", Expdate: ""
    }
    let [clientStatus, setClientStatus] = useState(defClientStatus)
    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/appointments/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/appointments/add') !== -1 ? true : false
    }
    const defValue = {
        AppointmentNo: editOrAdd.addPage ? "":id , AppointmentDate: new Date().toJSON().split("T")[0], CustomerID: "", CustomerName: "", 
        StaffId: "", StaffName: "",  CallReason: "", AHour: "", ADate: new Date().toJSON().split("T")[0], IsDone: false, IsClosed: false, ClosedReason: ""
    };

    let [valueMyInputs, setValueMyInputs] = useState(defValue);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("")

    let handleChangeValueClient = (e)=>{
        setClientStatus(defClientStatus)
        let checkValue = clientsData.filter(ele => ele.CustomerID === Number(e.target.value))[0]?.CustomerName
        setValueMyInputs(state => {return {...state, CustomerID: e.target.value, CustomerName: checkValue}});
        
        let updateError = errInputs.filter(ele => ele.name !== "CustomerID");
        if(checkValue){
            handleCallClientState(e.target.value);
        }else{
            updateError.push({ name: "CustomerID", errMsg: "هذا العميل غير موجود"});
        }
        setErrInput(updateError);
    }
    
    const handleSubmit = ()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let bodyData = {...valueMyInputs};
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);
        let extractCustomerIdErr = errInputs.filter(err => err.name === "CustomerID")
        setErrInput(getCheckStatus.concat(extractCustomerIdErr));
        
        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage)){
            makeRequestApi(`http://localhost:1150/api/Trans/Appointments`, editOrAdd.addPage ? "POST":"PUT", bodyData)
            .then(response => {
                setResponseMsg(editOrAdd.addPage ? "عملية إضافة ناجحة" : "عملية تعديل ناجحة");
                editOrAdd.addPage && setValueMyInputs(defValue);
                getElementClickAlert && getElementClickAlert.click();
                setLoadingInsert(false);
            })
            .catch(err => window.alert("حدث خطاء في معالجة الطلب"))
            
        }
    }

    const checkInputsValid = [
        Boolean(valueMyInputs.StaffId),
        Boolean(valueMyInputs.CallReason),
        Boolean(valueMyInputs.CustomerID),
    ]

    const handleCallClientState = (id)=>{
        
        makeRequestApi(`http://localhost:1150/api/Info/Guaranty?CustomerId=${id}`, "GET")
        .then(res => setClientStatus(res.data ? res.data:defClientStatus))
        .catch(err => { console.log(err)})
        
    }


    useEffect(()=>{
        makeRequestApi(`http://localhost:1150/api/Codes/Staffs`, "GET")
        .then(res => {
            setStaffData(res.data)
        }) 
        makeRequestApi(`http://localhost:1150/api/Codes/Customers`, "GET")
        .then(res => {
            setClientsData(res.data)
        }) 
                           
        if(editOrAdd.editPage){
            try {
                makeRequestApi(`http://localhost:1150/api/Trans/Appointments?AppointmentNo=${id}`, "GET")
                .then(res => {
                    let editProps = {
                        AHour: res.data.AHour.split("T")[1] ? res.data.AHour.split("T")[1] : res.data.AHour,
                        ADate: res.data.ADate.split("T")[0],
                        AppointmentDate: res.data.AppointmentDate.split("T")[0]
                    }                    
                    handleCallClientState(res.data.CustomerID)
                    setValueMyInputs(state => {return {...state, ...res.data, ...editProps}})
                })                    
            } catch (error) {
                window.alert("حدث خطاء اثناء البيانات")
            }
        }

    }, [])
    

    return(
        <>
            <div className="d-flex justify-content-center align-items-center col-12">
                <div className="col-12 d-flex flex-wrap justify-content-center border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="col-12 d-flex justify-content-between align-items-center border-bottom">
                        <h4 className="m-4">{editOrAdd.addPage ? "إضافة":"تعديل"} ميعاد</h4>
                    </div>

                    <div className="p-4 col-12 col-sm-11 col-lg-8 d-flex flex-wrap">
                        <div className="p-2 col-6">
                            <label htmlFor="AppointmentDate" className="form-label fw-semibold">التاريخ</label>
                            <input type="date" id="AppointmentDate" className="form-control" value={valueMyInputs.AppointmentDate} onChange={(e)=>setValueMyInputs(state => {return {...state, AppointmentDate: e.target.value}})}/>
                        </div>
                        <div className="p-2 col-6">
                            <label htmlFor="CustomerID" className="form-label fw-semibold">
                                العميل
                            </label>
                            <input type="text" className={`form-select ${errInputs.filter(ele => ele.name === "CustomerID").length > 0 ? "input_error":""}`} onChange={(e)=>{handleChangeValueClient(e)}} list="CustomerID" value={valueMyInputs.CustomerName}/>
                            <datalist id="CustomerID">
                                {clientsData.map(client => 
                                    <option value={client.CustomerID}  key={client.CustomerID}>{client.CustomerName}</option>
                                )}
                            </datalist>
                        </div>

                        <div className="p-2 col-12">
                            <label htmlFor="CallReason" className="form-label fw-semibold">سبب الاتصال</label>
                            <textarea value={valueMyInputs.CallReason} onChange={(e)=>setValueMyInputs(state => {return {...state, CallReason: e.target.value}})} className={`form-control ${errInputs.filter(ele => ele.name === "CallReason").length > 0 ? "input_error":""} `} id="CallReason" rows="3"></textarea>
                        </div>

                        <div className="p-2 col-4">
                            <label htmlFor="StaffId" className="form-label fw-semibold">مهندس الدعم</label>
                            <select id="StaffId" value={valueMyInputs.StaffId} onChange={(e)=>setValueMyInputs(state => {return {...state, StaffId: e.target.value}})} className={`form-select  ${errInputs.filter(ele => ele.name === "StaffId").length > 0 ? "input_error":""}`}>
                                <option value="" disabled>--  اختر --</option>
                                {staffData.map(staff => 
                                    <option value={staff.StaffId}  key={staff.StaffId}>{staff.StaffName}</option>
                                )}
                            </select>
                        </div>
                        <div className="p-2 col-4">
                            <label htmlFor="AHour" className="form-label fw-semibold">الساعة</label>
                            <input type="time" id="AHour" className={`form-control  ${errInputs.filter(ele => ele.name === "AHour").length > 0 ? "input_error":""}`} value={valueMyInputs.AHour} onChange={(e)=>setValueMyInputs(state => {return {...state, AHour: e.target.value}})}/>
                        </div>
                        <div className="p-2 col-4">
                            <label htmlFor="ADate" className="form-label fw-semibold">الميعاد</label>
                            <input type="date" id="ADate" className="form-control" value={valueMyInputs.ADate} onChange={(e)=>setValueMyInputs(state => {return {...state, ADate: e.target.value}})}/>
                        </div>

                        <div className="col-12 m-4 mx-2 form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="IsClosed" checked={valueMyInputs.IsClosed} onChange={(e)=>setValueMyInputs(state => {return {...state, IsClosed: e.target.checked}})}/>
                            <label className="form-check-label" htmlFor="IsClosed">تم الغاء الميعاد</label>
                        </div>

                        <div className="col-12">
                            <textarea disabled={!valueMyInputs.IsClosed} value={valueMyInputs.ClosedReason} onChange={(e)=>setValueMyInputs(state => {return {...state, ClosedReason: e.target.value}})} className="form-control" rows="3"></textarea>
                        </div>
                    </div>


                    <div className="p-4 col-12 col-sm-11 col-lg-4 d-flex justify-content-center flex-wrap">
                        <div className="p-2 col-12">
                            <label htmlFor="ContractDate" className="form-label fw-semibold">اخر عقد صيانة</label>
                            <input type={clientStatus.ContractDate ? "date":"text"} className="form-control" disabled  value={clientStatus.ContractDate.split("T")[0]} />
                        </div>
                        <div className="p-2 col-12">
                            <label htmlFor="VisitDate" className="form-label fw-semibold">اخر زيارة</label>
                            <input type={clientStatus.ContractDate ? "date":"text"} className="form-control" disabled  value={clientStatus.VisitDate.split("T")[0]} />
                        </div>
                        <div className="p-2 col-12">
                            <label htmlFor="VisitDate" className="form-label fw-semibold">عدد الزيارات المستخدمة</label>
                            <input type="text" className="form-control" disabled
                                value={clientStatus.ContractVisits ? clientStatus.CountVisits: ""} />
                        </div>
                        <div className="p-2 col-12">
                            <label htmlFor="VisitDate" className="form-label fw-semibold">عدد الزيارات المتبقية</label>
                            <input type="text" className="form-control" disabled value={clientStatus.ContractVisits ? clientStatus.ContractVisits - clientStatus.CountVisits: ""} />
                        </div>
                        <div className="p-2 col-12">
                            <label htmlFor="add_modules" className="form-label fw-semibold">داخل عقد الصيانة</label>
                            <input type="text" className="form-control" disabled 
                                value={
                                    clientStatus.IsInGranty === true ? "نعم" :
                                    clientStatus.IsInGranty === false ? "لا" :
                                    clientStatus.IsInGranty
                                }
                                />
                        </div>

                            
                    </div>




                    <div className="col-12 px-4 pb-4 d-flex justify-content-end">

                        {loadingInsert ?
                            <button type="button" disabled className="btn btn-primary d-flex align-items-center">
                                <div className="spinner-border border-2 h-2" style={{height: "20px", width: "20px", margin: "0 10px"}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div>جاري التنفيذ</div>
                            </button>
                            :
                            <button className="btn btn-primary mx-4"
                                disabled={checkInputsValid.includes(false)}
                                onClick={handleSubmit}
                            >تنفيذ</button>
                        }

                        <Link to="/appointments" className="btn btn-secondary">الغاء</Link>                        
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />
            
        </>
    )
}

export default AddEditAppointment;