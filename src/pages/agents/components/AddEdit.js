import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";
import { Link, useParams } from "react-router-dom";
import AlertBoxModel from "../../../components/AlertBoxModel";
import { handleCheckValueIsExisting, handleInputsNeedValidation } from "../validation";

const AddEditAgent = ()=>{
    let {id} = useParams();
    const [errInputs, setErrInput] = useState([]);

    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/agents/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/agents/add') !== -1 ? true : false
    }
    const defAgent = {AgentID: editOrAdd.addPage ? "":id , AgentName: "", Address: "", Email: "", Contacts: []};

    let [valueMyInputs, setValueMyInputs] = useState(defAgent);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("")
    let [agentName, setAgentName] = useState(null)

    const handleSubmit = async()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);
        let getResult = false;
        let updateErrorsAgentName = [];
        let updateErrorsContacts = [];

        
        if(getCheckStatus.length === 0){
            if(valueMyInputs.Contacts.length === 0){
                let err = {name: "Contact", errMsg: "يجب ادخال شخص واحد على الاقل"};
                updateErrorsContacts.push(err);
                
            }else{
                let getFirstContact = handleInputsNeedValidation(valueMyInputs.Contacts[0]);
                updateErrorsContacts = getFirstContact;
            }
        }
        
        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage && agentName !== valueMyInputs.AgentName)){
            let getValues  = await makeRequestApi("http://localhost:1150/api/Codes/Agents", "GET").then(res => res.data).catch(err => console.log(err))
            getResult = handleCheckValueIsExisting(getValues, "AgentName", valueMyInputs.AgentName);
            if(getResult){ updateErrorsAgentName.push(getResult) }
        }
        getCheckStatus = getCheckStatus.concat(updateErrorsContacts, updateErrorsAgentName)
        setErrInput(getCheckStatus);
        
        
        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage)){
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Agents`, editOrAdd.addPage ? "POST":"PUT", valueMyInputs)
                    .then(response => {
                        setResponseMsg(editOrAdd.addPage ? "عملية إضافة ناجحة" : "عملية تعديل ناجحة");
                        editOrAdd.addPage && setValueMyInputs(defAgent);
                        getElementClickAlert && getElementClickAlert.click();
                        setLoadingInsert(false);
                    })
                } catch (error) {
                    window.alert("حدث خطاء في معالجة الطلب")
                }
        }
    }
    const checkInputsValid = [
        // Boolean(valueMyInputs.AgentName),
        // Boolean(valueMyInputs.Address),
        // Boolean(valueMyInputs.Email),
    ]

    const handleChangeValue = (event, GetID , WhoIS /* GetID and WhoIS For Contacts only */)=>{
        let getValue = event.target.value , getName = event.target.name;
        if(["Contacts"].includes(WhoIS) ){
            let get_CustomerUsers_CustomerContacts = valueMyInputs[WhoIS].map(ele => {
                if(ele.readID === GetID){ return {...ele, [getName]: getValue}; }else{ return ele ;}
            });
            setValueMyInputs(state => { return {...state, [WhoIS]: get_CustomerUsers_CustomerContacts}})
        }
    }

    const handleAddContact = ()=>{
        setValueMyInputs(state => {return {...state, Contacts: [...state.Contacts, {readID: `_${state.Contacts.length}`, ContactName: "", Email: "", Phone1: "", Phone2: ""}]}})
    }
    const handleDeleteContact = (eleId)=>{
        setValueMyInputs(state =>{ return {...state , Contacts: [...state.Contacts].filter(ele => ele.readID !== eleId)}})
        
    }

    useEffect(()=>{
            if(editOrAdd.editPage){
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Agents?AgentId=${id}`, "GET")
                    .then(res => {

                        setAgentName(res.data.AgentName)
                        let handleNewState = {
                            Contacts: res.data?.Contacts.map((ele, index) => {return {...ele, readID: `_${index}`}})
                        }
                        setValueMyInputs(state => {return {...state, ...res.data, ...handleNewState}})
                        
                    })                    
                } catch (error) {
                    window.alert("حدث خطاء اثناء البيانات")
                }
            }
            
    }, [])


    return(
        <>
            <div className="d-flex justify-content-center align-items-center col-12">
                <div className="col-12 col-sm-10 col-md-12 border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="d-flex justify-content-between align-items-center border-bottom">
                        <h4 className="m-4">{editOrAdd.addPage ? "إضافة":"تعديل"} وكيل</h4>
                    </div>
                    <div className="p-4 d-flex flex-wrap">
                        <div className="p-2 col-6 col-lg-4">
                            <label htmlFor="staff_name" className="form-label fw-semibold">
                                إسم الوكيل
                                {errInputs.map(err => err.name === "AgentName" && <span className="px-4 text-danger">{err.errMsg}</span>)}    

                            </label>
                            <input type="text" id="staff_name"
                            className={`form-control ${errInputs.filter(ele => ele.name === "AgentName").length > 0 ? "input_error":""}`}
                            value={valueMyInputs.AgentName} onChange={(e)=>setValueMyInputs(state => {return {...state, AgentName: e.target.value}})}/>
                        </div>
                        <div className="p-2 col-6 col-lg-4">
                            <label htmlFor="staff_name" className="form-label fw-semibold">البريد الالكتروني</label>
                            <input type="text" id="staff_name" className="form-control" value={valueMyInputs.Email} onChange={(e)=>setValueMyInputs(state => {return {...state, Email: e.target.value}})}/>
                        </div>
                        <div className="p-2 col-12 col-lg-4">
                            <label htmlFor="staff_name" className="form-label fw-semibold">العنوان</label>
                            <input type="text" id="staff_name" className="form-control" value={valueMyInputs.Address} onChange={(e)=>setValueMyInputs(state => {return {...state, Address: e.target.value}})}/>
                        </div>



                        <div className="col-12 p-0 mt-3 bg-white rounded-4 border">
                            <h6 className="pt-2 px-4 fw-bold">
                                شخوص الاتصال
                            
                                <button type="button" className="btn" onClick={handleAddContact}>
                                    <i className="bi bi-patch-plus fs-5"></i> 
                                </button>


                                {errInputs.map(err => err.name === "Contact" && <span className="px-4 text-danger fs-sm">{err.errMsg}</span>)}    

                            </h6>
                            <table className="table px-2 border-top">
                                <thead className="thead-tabel-gray">
                                    <tr>
                                        <th scope="col" className="text-center">
                                            <i className="bi bi-x-octagon"></i>
                                        </th>
                                        <th>شخص الاتصال</th>
                                        <th>البريد الالكتروني</th>
                                        <th>هاتف 1</th>
                                        <th>هاتف 2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {valueMyInputs.Contacts.map((ele, index) => 
                                        <tr key={ele.readID}>
                                            <th>
                                                <input type="button" className="form-control" value="-" onClick={()=>handleDeleteContact(ele.readID)}/>
                                            </th>
                                            <th>
                                                <input type="text" 
                                                className={`form-control ${errInputs.filter(ele => ele.name === "ContactName").length > 0 ? "input_error":""}`}
                                                onChange={(e) => handleChangeValue(e, ele.readID , 'Contacts')} name="ContactName" defaultValue={ele.ContactName}/>
                                            </th>
                                            <th>
                                                <input type="text" className="form-control" onChange={(e) => handleChangeValue(e, ele.readID , 'Contacts')} name="Email" defaultValue={ele.Email}/>
                                            </th>
                                            <th>
                                                <input type="text"
                                                className={`form-control ${errInputs.filter(ele => ele.name === "Phone1").length > 0 ? "input_error":""}`}
                                                onChange={(e) => handleChangeValue(e, ele.readID , 'Contacts')} name="Phone1" defaultValue={ele.Phone1}/>
                                            </th>
                                            <th>
                                                <input type="text" className="form-control" onChange={(e) => handleChangeValue(e, ele.readID , 'Contacts')} name="Phone2" defaultValue={ele.Phone2}/>
                                            </th>
                                        </tr>

                                    )}
                                </tbody>
                            </table>
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

                        <Link to="/agents" className="btn btn-secondary">الغاء</Link>                        
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />
            
        </>
    )
}

export default AddEditAgent;
