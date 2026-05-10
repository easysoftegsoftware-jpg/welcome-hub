import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";
import { Link, useParams } from "react-router-dom";
import AlertBoxModel from "../../../components/AlertBoxModel";
import { handleInputsNeedValidation } from "../validation";

const AddEditContract = ()=>{
    let {id} = useParams();
    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/contracts/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/contracts/add') !== -1 ? true : false
    }
    const [errInputs, setErrInput] = useState([]);

    let [clientsData, setClientsData] = useState([]);
    const defModule = {
        ContractNo: editOrAdd.addPage ? "":id , ContractDate: new Date().toJSON().split("T")[0] ,
        PersonName: "", ContractVal: "", ContractVisits: "", CustomerID: ""
    };

    let [valueMyInputs, setValueMyInputs] = useState(defModule);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("")

    let handleChangeValueClient = (e)=>{
        // setClientStatus(defClientStatus)
        let checkValue = clientsData.filter(ele => ele.CustomerID === Number(e.target.value))[0]?.CustomerName
        setValueMyInputs(state => {return {...state, CustomerID: e.target.value, CustomerName: checkValue}});
        
        let updateError = errInputs.filter(ele => ele.name !== "CustomerID");
        if(!checkValue){
            updateError.push({ name: "CustomerID", errMsg: "هذا العميل غير موجود"});
        }
        setErrInput(updateError);
    }



    const handleSubmit = ()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);
        let extractCustomerIdErr = errInputs.filter(err => err.name === "CustomerID");
        getCheckStatus = getCheckStatus.concat(extractCustomerIdErr)
        setErrInput(getCheckStatus);
        

        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage)){
            makeRequestApi(`http://localhost:1150/api/Trans/Contracts`, editOrAdd.addPage ? "POST":"PUT", valueMyInputs)
            .then(response => {
                setResponseMsg(editOrAdd.addPage ? "عملية إضافة ناجحة" : "عملية تعديل ناجحة");
                editOrAdd.addPage && setValueMyInputs(defModule);
                getElementClickAlert && getElementClickAlert.click();
                setLoadingInsert(false);
                let questionToAction = window.confirm("سوف يتم تعديل قيمة المطالبة في اكواد العملاء هل تريد الاستمرار ؟")
                if(questionToAction){
                    makeRequestApi(`http://localhost:1150/api/Trans/Contracts/UpdateRequestValue?CustId=${valueMyInputs.CustomerID}`, "PUT")
                    .then(res => res)
                    .catch(err => console.log(err)
                    )
                    // .catch(err => window.alert("حدث حطاء في معالجة الطلب"))
                }
            })
            .catch(err => {
                getElementClickAlert && getElementClickAlert.click();
                setResponseMsg(err.response.data);
                console.log(err.response.data);
                

            })
                
        }
    }
    const checkInputsValid = [
        Boolean(valueMyInputs.ContractDate),
        Boolean(valueMyInputs.CustomerID),
        Boolean(valueMyInputs.ContractVisits),
        Boolean(valueMyInputs.ContractVal),
    ]

    useEffect(()=>{
            makeRequestApi(`http://localhost:1150/api/Codes/Customers`, "GET")
            .then(res => {
                setClientsData(res.data)
            }) 

            if(editOrAdd.editPage){
                try {
                    makeRequestApi(`http://localhost:1150/api/Trans/Contracts?ContractNo=${id}`, "GET")
                    .then(res => {
                        res.data.ContractDate = res.data.ContractDate.split("T")[0]
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
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="d-flex justify-content-between align-items-center border-bottom">
                        <h4 className="m-4">إضافة عقد</h4>
                    </div>
                    <div className="p-4 col-12 d-flex flex-wrap row-gap-2">
                        <div className="col-12">
                            <label htmlFor="ContractDate" className="form-label">تاريخ العقد</label>
                            <input type="date" id="ContractDate" onChange={(e)=>setValueMyInputs(state => {return {...state, ContractDate: e.target.value}})} value={valueMyInputs.ContractDate} className="form-control"/>
                        </div>

                        <div className="col-12">
                            <label htmlFor="CustomerID" className="form-label">
                                العميل
                            </label>
                            <input type="text" className={`form-select ${errInputs.filter(ele => ele.name === "CustomerID").length > 0 ? "input_error":""}`} onChange={(e)=>{handleChangeValueClient(e)}} list="CustomerID" value={valueMyInputs.CustomerName}/>
                            <datalist id="CustomerID">
                                {clientsData.map(client => 
                                    <option value={client.CustomerID}  key={client.CustomerID}>{client.CustomerName}</option>
                                )}
                            </datalist>
                        </div>


                        {/* <div className="col-12">
                            <label htmlFor="CustomerID" className="form-label">العميل</label>
                            <select id="CustomerID" value={valueMyInputs.CustomerID} onChange={(e)=>setValueMyInputs(state => {return {...state, CustomerID: e.target.value}})}
                            className="form-select">
                                <option value={""} selected disabled>العميل --</option>
                                {clientsData.map(client => 
                                    <option  value={client.CustomerID}>{client.CustomerName}</option>
                                )}
                            </select>
                        </div> */}


                        <div className="col-12">
                            <label htmlFor="ContractVal" className="form-label">القيمة</label>
                            <input type="number" id="ContractVal" onChange={(e)=>setValueMyInputs(state => {return {...state, ContractVal: e.target.value}})} value={valueMyInputs.ContractVal} className="form-control"/>
                        </div>

                        <div className="col-12">
                            <label htmlFor="ContractVisits" className="form-label">عدد الزيارات</label>
                            <input type="number" id="ContractVisits" onChange={(e)=>setValueMyInputs(state => {return {...state, ContractVisits: e.target.value}})} value={valueMyInputs.ContractVisits} className="form-control"/>
                        </div>
                        

                        <div className="col-12">
                            <label htmlFor="PersonName" className="form-label">يمثلها في العقد</label>
                            <input type="text" id="PersonName" onChange={(e)=>setValueMyInputs(state => {return {...state, PersonName: e.target.value}})} value={valueMyInputs.PersonName} className="form-control"/>
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
                        <Link to="/contracts" className="btn btn-secondary">الغاء</Link>                        
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />
            
        </>
    )
}

export default AddEditContract;