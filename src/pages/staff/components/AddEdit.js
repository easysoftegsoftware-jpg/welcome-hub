import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";
import { Link, useParams } from "react-router-dom";
import AlertBoxModel from "../../../components/AlertBoxModel";
import { handleCheckValueIsExisting } from "../validation";

const AddEditModule = ()=>{
    let {id} = useParams();
    const [errInputs, setErrInput] = useState([]);

    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/staff/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/staff/add') !== -1 ? true : false
    }

    const defStaff = {StaffId: editOrAdd.addPage ? "":id , StaffName: "", IsStaffType: "", Password: ""};

    let [disabledPassword, setDisabledPassword] = useState(editOrAdd.addPage ? false:true);
    let [staffName, setStaffName] = useState(null)
    let [valueMyInputs, setValueMyInputs] = useState(defStaff);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("");

    const handleSubmit = async()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let bodyData = valueMyInputs;

        let getResult = false;
        if(editOrAdd.addPage || (editOrAdd.editPage && staffName !== valueMyInputs.StaffName)){
            let getValues  = await makeRequestApi("http://localhost:1150/api/Codes/Staffs", "GET").then(res => res.data).catch(err => console.log(err))
            getResult = handleCheckValueIsExisting(getValues, "StaffName", valueMyInputs.StaffName);
            let updateErrors = errInputs.filter(ele => ele.name !== "StaffName");
            if(getResult){ updateErrors.push(getResult) }
            setErrInput(updateErrors);
        }

        
        // if(editOrAdd.editPage && valueMyInputs.Password){delete valueMyInputs.Password}
        

        if(getResult === false && (editOrAdd.addPage || editOrAdd.editPage)){
                
            try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Staffs`, editOrAdd.addPage ? "POST":"PUT", bodyData)
                    .then(response => {
                        setResponseMsg(editOrAdd.addPage ? "عملية إضافة ناجحة" : "عملية تعديل ناجحة");
                        editOrAdd.addPage && setValueMyInputs(defStaff);
                        getElementClickAlert && getElementClickAlert.click();
                        setLoadingInsert(false);
                    })
                } catch (error) {
                    window.alert("حدث خطاء في معالجة الطلب")
                }
        }
    }

    const checkInputsValid = [
        Boolean(valueMyInputs.StaffName),
        Boolean(valueMyInputs.IsStaffType),
        Boolean(disabledPassword ? true:valueMyInputs.Password),
    ]

    useEffect(()=>{
            if(editOrAdd.editPage){
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Staffs?StaffId=${id}`, "GET")
                    .then(res => {
                        
                        setValueMyInputs(res.data)
                        setStaffName(res.data.StaffName)
                    })                    
                } catch (error) {
                    window.alert("حدث خطاء اثناء البيانات")
                }
            }

    }, [])


    return(
        <>
            <div className="d-flex justify-content-center align-items-center col-12">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="d-flex justify-content-between align-items-center border-bottom">
                        <h4 className="m-4">{editOrAdd.addPage ? "إضافة":"تعديل"} موظف</h4>
                    </div>
                    <div className="p-4">
                        <div className="p-2">
                            <label htmlFor="staff_name" className="form-label fw-semibold">
                                إسم الموظف
                                {errInputs.map(err => err.name === "StaffName" && <span className="px-4 text-danger">{err.errMsg}</span>)}    
                            </label>
                            <input type="text" id="staff_name" className={`form-control ${errInputs.filter(ele => ele.name === "StaffName").length > 0 ? "input_error":""} `} value={valueMyInputs.StaffName} onChange={(e)=>setValueMyInputs(state => {return {...state, StaffName: e.target.value}})}/>
                        </div>
                        <div className="p-2">
                            <label htmlFor="staff_password" className="form-label fw-semibold">كلمة المرور</label>
                            <div class="input-group">
                                {editOrAdd.editPage &&
                                    <button type="button" onClick={()=>setDisabledPassword(!disabledPassword)} className="input-group-text" id="inputGroup-sizing-sm">
                                        <i className={`bi ${disabledPassword ? "bi-lock":"bi-unlock"}`}></i>
                                    </button>
                                }
                                <input type="password" disabled={disabledPassword}  onChange={(e)=>setValueMyInputs(data => {return {...data, Password: e.target.value}})} className="form-control" id="staff_password" value={valueMyInputs.Password} />
                            </div>
                        </div>

                        <div className="p-2">
                            <label htmlFor="job_name" className="form-label fw-semibold">المسمى الوظيفي</label>
                            <select id="job_name" value={valueMyInputs.IsStaffType}  onChange={(e)=>setValueMyInputs(data => { return {...data, IsStaffType: e.target.value}})} className="form-select">
                                <option value={""} disabled>-- اختر --</option>
                                <option value={"1"}>مهندس دعم فني</option>
                                <option value={"2"}>مدير الدعم الفني</option>
                                <option value={"3"}>ادارة خدمة العملاء</option>
                                <option value={"4"}>المدير العام</option>
                            </select>
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
                                disabled={checkInputsValid.includes(false)}
                                onClick={handleSubmit}
                            >تنفيذ</button>
                        }

                        <Link to="/staff" className="btn btn-secondary">الغاء</Link>                        
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />
            
        </>
    )
}

export default AddEditModule;