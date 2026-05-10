import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";
import { Link, useParams } from "react-router-dom";
import AlertBoxModel from "../../../components/AlertBoxModel";
import { handleCheckValueIsExisting, handleInputsNeedValidation } from "../validation";

const AddEditModule = ()=>{
    let {id} = useParams();
    const [errInputs, setErrInput] = useState([]);
    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/modules/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/modules/add') !== -1 ? true : false
    }
    const defModule = {ModuleId: editOrAdd.addPage ? "":id , ModuleName: ""};
    let [moduleName, setModuleName] = useState(null)

    let [valueMyInputs, setValueMyInputs] = useState(defModule);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("")

    const handleSubmit = async()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);
        let getResult = false;
        let updateErrorsModuleName = [];
        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage && moduleName !== valueMyInputs.ModuleName)){
           let getValues  = await makeRequestApi("http://localhost:1150/api/Codes/Modules", "GET").then(res => res.data).catch(err => console.log(err))
            getResult = handleCheckValueIsExisting(getValues, "ModuleName", valueMyInputs.ModuleName);
            
            if(getResult){ updateErrorsModuleName.push(getResult) }
        }

        getCheckStatus = getCheckStatus.concat(updateErrorsModuleName)


        setErrInput(getCheckStatus)


        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage)){
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Modules`, editOrAdd.addPage ? "POST":"PUT", valueMyInputs)
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

    useEffect(()=>{
                    if(editOrAdd.editPage){
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Modules?ModuleId=${id}`, "GET")
                    .then(res => {
                        setModuleName(res.data.ModuleName)
                        setValueMyInputs(res.data)
                    })                    
                } catch (error) {
                    window.alert("حدث خطاء اثناء البيانات")
                }
            }

    }, [])


    return(
        <>
            <div className="d-flex justify-content-center align-items-center col-12">
                <div className="col-12 col-sm-10 col-md-9 col-lg-8 border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="d-flex justify-content-between align-items-center border-bottom">
                        <h4 className="m-4">إضافة قائمة</h4>
                    </div>
                    <div className="p-4">
                        <label for="add_modules" className="form-label fw-semibold">
                            إسم القائمة
                            {errInputs.map(err => err.name === "ModuleName" && <span className="px-4 text-danger">{err.errMsg}</span>)}    
                        </label>
                        <input type="text"
                        className={`form-control ${errInputs.filter(ele => ele.name === "ModuleName").length > 0 ? "input_error":""}`}
                        value={valueMyInputs.ModuleName} onChange={(e)=>setValueMyInputs(state => {return {...state, ModuleName: e.target.value}})}/>
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
                                disabled={valueMyInputs.ModuleName.length > 1 ? false:true}
                                onClick={handleSubmit}
                            >تنفيذ</button>
                        }

                        <Link to="/modules" className="btn btn-secondary">الغاء</Link>                        
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />
            
        </>
    )
}

export default AddEditModule;