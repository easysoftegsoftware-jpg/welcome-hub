import React from "react";
import {  useEffect, useState } from "react";
import AlertBox from "./AlertBox";
import { Link, useParams } from "react-router-dom";
import { handleCheckValueIsExisting, handleInputsNeedValidation } from "../validation";
import { makeRequestApi } from "../../../rest_api";
import { defaultDataClientType, recursion } from "../../../helpers";
import AlertBoxModel from "../../../components/AlertBoxModel";


const TreeCustType = React.memo(({data})=>{
    let [handleTree, setHandleTree] = useState('');

    useEffect(()=>{
        setHandleTree(recursion(data));
        
        
    }, [data])
    return <div className="list-tree" style={{overflow: "auto", scrollbarWidth: "auto"}} dangerouslySetInnerHTML={{ __html: handleTree }} />;
})


const AddEditClients = ()=>{
    const [errInputs, setErrInput] = useState([]);
    
    const [dataAgents, setDataAgents] = useState([])
    const [dataModules, setDataModules] = useState([])
    let [dataClientsTypes, setDataClientsTypes] = useState([])
    const [treeTypeClients, setTreeTypeClients] = useState([]); 
    let [upCustTypeID, setUpCustTypeID] = useState("0")



    let {id} = useParams();
    let editOrAdd = {
        editPage: window.location.pathname.indexOf('/clients/edit') !== -1 ? true : false, 
        addPage: window.location.pathname.indexOf('/clients/add') !== -1 ? true : false
    }
    
    const defCustomer = {
        CustomerID: editOrAdd.addPage ? "":id,  CustomerName: "", CustTypeID: "",
        Address: "", Email: "", AgentID: "", ContractDate: new Date().toJSON().split("T")[0],
        ContactValue: "", RequestValue: "", Granty: "", CustState: "",
        GrantyTch: "", Notes: "", CustomerUsers: [], CustomerContacts: [], CustomerModules: [], 
    }

    let [clientName, setClientName] = useState(null)
    const [valueMyInputs , setValueMyInputs] = useState(defCustomer);


    const checkInputsNotNull = [
    //     Boolean(valueMyInputs.CustomerName),
    //     Boolean(valueMyInputs.Email),
    //     Boolean(valueMyInputs.Address),
    //     Boolean(valueMyInputs.CustState),
    //     Boolean(valueMyInputs.CustTypeID),
    //     Boolean(valueMyInputs.AgentID),
    //     Boolean(valueMyInputs.ContractDate),
    //     Boolean(valueMyInputs.ContactValue),
    //     Boolean(valueMyInputs.Granty),
    //     Boolean(valueMyInputs.GrantyTch),
    //     // Boolean(valueMyInputs.CustomerModules ? editClient.CustomerModules.length > 0 : false),  // condition nul null
    //     // Boolean(valueMyInputs.Notes),
    //     // Boolean(valueMyInputs.CustomerUsers),
    //     // Boolean(valueMyInputs.CustomerContacts),
    ]
        
    const handleChangeValue = (event, GetID , WhoIS /* GetID and WhoIS For Contacts only */)=>{
        let getValue = event.target.value , getName = event.target.name;
        if(getName === "CustomerModules"){
            // Step 1
            let getCustomerModules = valueMyInputs.CustomerModules.filter(ele => ele.ModuleID !== Number(getValue));
            // Step 2
            if(event.target.checked){ getCustomerModules.push({ModuleID:  Number(getValue)}); };
            //Step 3
            setValueMyInputs(state => { return {...state, CustomerModules: getCustomerModules}})
            
        }else if(["CustomerUsers", "CustomerContacts"].includes(WhoIS) ){
            // Step 1
            let get_CustomerUsers_CustomerContacts = valueMyInputs[WhoIS].map(ele => {
                if(ele.readID === GetID){ return {...ele, [getName]: getValue}; }else{ return ele ;}
            });
            // Step 2
            setValueMyInputs(state => { return {...state, [WhoIS]: get_CustomerUsers_CustomerContacts}})
        }else{
            setValueMyInputs(state => { return {...state, [getName]: getValue} })
        }
    }

    const handleAddContact = (type)=>{
        type === "person" ?
        setValueMyInputs(state => {return {...state, CustomerContacts: [...state.CustomerContacts, {readID: `_${state.CustomerContacts.length}`, ContactName: "", Phone1: "", Phone2: "", Phone3: "", Phone4: ""}]}})
        :
        setValueMyInputs(state => {return {...state, CustomerUsers: [...state.CustomerUsers, {readID: `_${state.CustomerUsers.length}`, BranchName: "", UsersCount: ""}]}})
    }
    const handleDeleteContact = (type, eleId)=>{
        type === "person" ?
        setValueMyInputs(state =>{ return {...state , CustomerContacts: [...state.CustomerContacts].filter(ele => ele.readID !== eleId)}})
        :
        setValueMyInputs(state =>{ return {...state , CustomerUsers: [...state.CustomerUsers].filter(ele => ele.readID !== eleId)}})
        
    }
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [responseMsg , setResponseMsg] = useState("")


    const handleSubmitForm = async()=>{
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);
        let getResult = false;
        let updateErrorsCustomerContacts = [];
        let updateErrorsCustomerUsers = [];
        let updateErrorsCustomerName = [];


        if(getCheckStatus.length === 0){
            if(valueMyInputs.CustomerContacts.length === 0){
                let err = {name: "CustomerContacts", errMsg: "يجب ادخال شخص واحد على الاقل"};
                updateErrorsCustomerContacts.push(err);
                
            }else{
                let getFirstItem = handleInputsNeedValidation(valueMyInputs.CustomerContacts[0]);
                updateErrorsCustomerContacts = getFirstItem;
            }

            if(valueMyInputs.CustomerUsers.length === 0){
                let err = {name: "CustomerUsers", errMsg: "يجب ادخال فرع واحد على الاقل"};
                updateErrorsCustomerUsers.push(err);
            }else{
                let getFirstItem = handleInputsNeedValidation(valueMyInputs.CustomerUsers[0]);
                updateErrorsCustomerUsers = getFirstItem;
            }
        }

        if(getCheckStatus.length === 0 && (editOrAdd.addPage || editOrAdd.editPage && clientName !== valueMyInputs.CustomerName)){
           let getValues  = await makeRequestApi("http://localhost:1150/api/Codes/Customers", "GET").then(res => res.data).catch(err => console.log(err))
            getResult = handleCheckValueIsExisting(getValues, "CustomerName", valueMyInputs.CustomerName);
            
            if(getResult){ updateErrorsCustomerName.push(getResult) }
        }

        getCheckStatus = getCheckStatus.concat(updateErrorsCustomerName, updateErrorsCustomerUsers, updateErrorsCustomerContacts)
        setErrInput(getCheckStatus);

        console.log(getCheckStatus);
        
        if(getCheckStatus.length === 0){
            setLoadingInsert(true);
            let bodyData = valueMyInputs;
            if(editOrAdd.editPage){
                delete bodyData.CustTypeName;
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Customers?CustId=${id}`, "PUT", valueMyInputs)
                    .then(response => {
                        setResponseMsg("عملية تعديل ناجحة");
                        getElementClickAlert && getElementClickAlert.click();
                        setTimeout(() => {
                            window.location.assign("/clients/add")                            
                        }, 1500);
                        
                    })
                } catch (error) {
                    setLoadingInsert(false);
                    window.alert("خطاء في تعديل عميل")
                }
            }else if(editOrAdd.addPage){
                delete bodyData.CustTypeName;
                delete bodyData.CustomerID;
                try {
                    makeRequestApi(`http://localhost:1150/api/Codes/Customers`, "POST", bodyData)
                    .then(response => {
                        setResponseMsg("عملية إضافة ناجحة");
                        setValueMyInputs(defCustomer)
                        getElementClickAlert && getElementClickAlert.click();
                        setLoadingInsert(false);
                    })
                } catch (error) {
                    window.alert("خطاء في تسجيل عميل")
                }
            }
        }
    }
    const handleQuickValidation = (inputName)=>{
        setErrInput(handleInputsNeedValidation({[inputName]: valueMyInputs[inputName]}))
    }

    const handleUpdateTree = ()=>{
        makeRequestApi("http://localhost:1150/api/Codes/CustTypes/CustTree")
        .then(res => {
            setTreeTypeClients(res.data);
        })
        makeRequestApi("http://localhost:1150/api/Codes/CustTypes", "GET")
        .then(res =>{ setDataClientsTypes(res.data)})
        .catch(err => window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))

    }

    useEffect(()=>{
        
        makeRequestApi("http://localhost:1150/api/Codes/CustTypes/CustTree")
        .then(res => {
            setTreeTypeClients(res.data)
        })
        makeRequestApi("http://localhost:1150/api/Codes/Modules", "GET")
        .then(res => setDataModules(res.data))
        .catch(err => window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))

        
        makeRequestApi("http://localhost:1150/api/Codes/Agents", "GET")
        .then(res => setDataAgents(res.data))
        .catch(err => window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))
        
        makeRequestApi("http://localhost:1150/api/Codes/CustTypes", "GET")
        .then(res =>{
            // console.log(res.data.length );
            
             setDataClientsTypes(res.data)})
        .catch(err => window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))


        
        if(editOrAdd.editPage){
            try {
                makeRequestApi(`http://localhost:1150/api/Codes/Customers?CustId=${id}`, "GET")
                .then(res => {
                    setClientName(res.data.CustomerName)
                    let handleNewState = {
                        ContractDate: res.data?.ContractDate.split("T")[0] || "",
                        CustomerContacts: res.data?.CustomerContacts.map((ele, index) => {return {...ele, readID: `_${index}`}}),
                        CustomerUsers: res.data?.CustomerUsers.map((ele, index) => {return {...ele, readID: `_${index}`}})
                    }
                    setValueMyInputs(state => {return {...state, ...res.data, ...handleNewState}})
                    
                })                    
            } catch (error) {
                window.alert("حدث خطاء اثناء استدعاء العميل")
            }
        }


            document.addEventListener("click", ()=>{
                let get_right_click_menu = document.getElementById("right_click_menu");
                if(get_right_click_menu){
                    document.getElementById("right_click_menu").style.display = "none";
                }
            })
            const getMainCategory = document.getElementById("main_category")
    
            getMainCategory.addEventListener("contextmenu", (e)=>{
                
                let getElementDropMenu = document.getElementById("right_click_menu");
                e.preventDefault();
        
                getElementDropMenu.style.display = "block";
        
                
                if(e.target.id?.match("CustTypeID")){
                    let getID = e.target.id.split("-")[1];
                    setUpCustTypeID(getID)
                }
                if([...e.target.classList].includes('right_click') ){
                    getElementDropMenu.style.display = "block";
                    getElementDropMenu.style.position = "absolute";
                    getElementDropMenu.style.left = `${e.pageX}px`;
                    getElementDropMenu.style.top = `${e.pageY + 30}px`;
                }else{
                    getElementDropMenu.style.display = "none";
                }
                
            })


    }, [])
        


    return(
    <>  
        <form className="row justify-content-end justify-content-lg-between g-3 col-12">
            <div className="row align-items-start main section_top justify-content-between">
                <div className="row section_main_info justify-content-center p-0 col-12 col-md-12 col-lg-9 col-xl-8  g-3 bg-white pb-3 rounded-4 border">
                    <div className="d-flex justify-content-between align-items-center mt-0 p-4 border-bottom">

                        <h5 className="fw-bold m-0">{editOrAdd.addPage ? "إضافة عميل":"تعديل بيانات العميل"}</h5>

                    </div>

                    <div className="row justify-content-center align-items-end p-2 mt-0 col-12 g-3 select_all_label_input" >
                            <input type="hidden" name="CustomerID" value={valueMyInputs.CustomerID}/>

                            <div className="col-12 col-sm-6">
                                {errInputs.map(err => err.name === "CustomerName" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                                <label htmlFor="CustomerName">
                                    اسم العميل
                                </label>
                                <input type="text"
                                    className={`form-control ${errInputs.filter(ele => ele.name === "CustomerName").length > 0 ? "input_error":""}`}
                                    onBlur={()=>handleQuickValidation("CustomerName")}
                                    onChange={(e)=>handleChangeValue(e)} name="CustomerName" id="CustomerName"
                                    value={valueMyInputs.CustomerName} />
                            </div>
                            <div className="col-12 col-sm-6">
                                {errInputs.map(err => err.name === "Email" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                                <label htmlFor="Email ">البريد الكتروني</label>
                                <input type="email"
                                    className={`form-control ${errInputs.filter(ele => ele.name === "Email").length > 0 ? "input_error":""}`}
                                    onBlur={()=>handleQuickValidation("Email")}
                                    onChange={(e)=>handleChangeValue(e)} name="Email" id="Email"
                                    value={valueMyInputs.Email}/>
                            </div>
                            <div className="col-12">
                                <label htmlFor="Address ">عنوان العميل</label>
                                <input type="text"
                                    className={`form-control ${errInputs.filter(ele => ele.name === "Address").length > 0 ? "input_error":""}`}
                                    onBlur={()=>handleQuickValidation("Address")}
                                    onChange={(e)=>handleChangeValue(e)}
                                    name="Address" id="Address" value={valueMyInputs.Address} />
                            </div>



                            <div className=" col-12 col-sm-4">
                                <label htmlFor="CustState">حالة العميل</label>
                                <select id="CustState" value={valueMyInputs.CustState} name="CustState" onChange={(e)=>handleChangeValue(e)} className="form-select">
                                    <option value={"0"}>بدون تحديد</option>
                                    <option value={"1"}>غير نشط</option>
                                    <option value={"2"}>عميل زيارة</option>
                                    <option value={"3"} >عقد صيانة</option>
                                    <option value={"4"}>إيجار</option>
                                </select>
                            </div>

                            <div className=" col-12 col-sm-4">
                                <label htmlFor="CustTypeID">نوع العميل</label>
                                <select id="CustTypeID" value={valueMyInputs.CustTypeID} name="CustTypeID" onChange={(e)=>handleChangeValue(e)} className="form-select">
                                    {dataClientsTypes.map(client_type => 
                                        <option value={client_type.CustTypeID} key={client_type.CustTypeID}>{client_type.CustTypeName}</option>
                                    )}
                                </select>
                            </div>

                            <div className=" col-12 col-sm-4">
                                <label htmlFor="AgentID">الوكيل</label>
                                <select id="AgentID" value={valueMyInputs.AgentID} name="AgentID" onChange={(e)=>handleChangeValue(e)} className="form-select">
                                    <option value="" selected>بدون تحديد</option>
                                    {dataAgents.map(agent => 
                                        <option value={agent.AgentID}  key={agent.AgentID}>{agent.AgentName}</option>
                                    )}
                                </select>
                            </div>
                            

                            <div className="col-12 col-sm-6">
                                {errInputs.map(err => err.name === "ContactValue" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                                <label htmlFor="ContactValue ">قيمة التعاقد</label>
                                <input type="number" min={0} value={valueMyInputs.ContactValue}  onChange={(e)=>handleChangeValue(e)} name="ContactValue" style={{direction: "rtl"}}
                                className={`form-control ${errInputs.filter(ele => ele.name === "ContactValue").length > 0 ? "input_error":""}`} id="ContactValue" />
                            </div>
                            <div className=" col-12 col-sm-6">
                                <label htmlFor="GrantyTch ">مدة ضمان الدعم الفني " شهري "</label>
                                <input type="number" min={0} value={valueMyInputs.GrantyTch}  onChange={(e)=>handleChangeValue(e)} name="GrantyTch" style={{direction: "rtl"}} className="form-control" id="RequestValue" />
                            </div>
                            <div className="col-12 col-sm-6">
                                {errInputs.map(err => err.name === "RequestValue" && <span className="col-12 text-danger">{err.errMsg}</span>)}    
                                <label htmlFor="RequestValue ">قيمة عقد الصيانة</label>
                                <input type="number" min={0} value={valueMyInputs.RequestValue}  onChange={(e)=>handleChangeValue(e)} name="RequestValue" style={{direction: "rtl"}}
                                className={`form-control ${errInputs.filter(ele => ele.name === "RequestValue").length > 0 ? "input_error":""}`} id="GrantyTch" />
                            </div>


                            <div className="col-12 col-sm-6">
                                <label htmlFor="ContractDate">تاريخ التعاقد</label>
                                <input type="date" value={valueMyInputs.ContractDate}  onChange={(e)=>handleChangeValue(e)} name="ContractDate" className="form-control" id="ContractDate" />
                            </div>

                            <div className="col-12">
                                <label htmlFor="Notes" className="form-label mx-2">ملاحظات</label>
                                <textarea value={valueMyInputs.Notes} onChange={(e)=>handleChangeValue(e)} name="Notes" className="form-control" id="Notes" rows="3"></textarea>
                            </div>

                        </div>
                    </div>



                <div style={{overflow: "auto", position: "relative"}} className="row service_list select_all_label_input justify-content-center align-content-start p-0 col-12 col-lg-3 col-xl-2 g-3 bg-white pb-3 rounded-4 border">
                    <div style={{position: "sticky", top: "0px", backgroundColor: "white"}} className="d-flex justify-content-between align-items-center mt-0 p-4 border-bottom">

                        <h5 className="fw-bold m-0">الخدمات</h5>

                    </div>

                    {dataModules.map(module =>
                        <div className="col-md-12" key={module.code}>
                            <input name="CustomerModules" checked={valueMyInputs.CustomerModules.filter(ele => ele.ModuleID === Number(module.ModuleId))[0]?true:false}  onChange={(e)=>handleChangeValue(e)} type="checkbox"  value={module.ModuleId} id={"service"+module.ModuleId} />
                            <label htmlFor={"service"+module.ModuleId} className="px-2">{module.ModuleName}</label>
                        </div>
                    )}
                </div>

                <div style={{overflow: "auto", position: "relative"}} id="main_category" className="row clients_types_list justify-content-center align-content-start p-0 d-none d-lg-block col-lg-3 col-xl-2  g-3 bg-white pb-3 rounded-4 border">
                    <div style={{position: "sticky", left: "0", top: "0px", backgroundColor: "white"}} className="d-flex justify-content-between align-items-center mt-0 p-4 border-bottom">

                        <h5 className="fw-bold m-0">الفئات</h5>

                    </div>
                    {/* <TreeCustType /> */}
                    <TreeCustType data={treeTypeClients}/>
                    {/* <div className="list-tree" style={{overflow: "auto", scrollbarWidth: "auto"}} dangerouslySetInnerHTML={{__html:recursion(treeTypeClients)}} /> */}
                    {/* <div className="list-tree" style={{overflow: "auto", scrollbarWidth: "auto"}} dangerouslySetInnerHTML={{__html:handleTree},} /> */}
                </div>

            </div>
                
            <div className="hr col-12 border"></div>


                <div className="row justify-content-center align-items-start p-0 mt-2 col-12">
                    <div className="col-12 p-0 mt-3 bg-white rounded-4 border">
                        <h6 className="pt-2 px-4 fw-bold">
                            بيانات اتصال الفروع
                        
                            <button type="button" className="btn" onClick={()=>handleAddContact("branch")}>
                                <i className="bi bi-patch-plus fs-5"></i> 
                            </button>


                            {errInputs.map(err => err.name === "CustomerUsers" && <span className="px-4 text-danger fs-sm">{err.errMsg}</span>)}    

                        </h6>
                        <table className="table px-2 border-top">
                            <thead className="thead-tabel-gray">
                                <tr>
                                    <th scope="col" className="text-center">
                                        <i className="bi bi-x-octagon"></i>
                                    </th>
                                    <th>الفرع</th>
                                    <th>عدد المستخدمين</th>                                 
                                </tr>
                            </thead>
                            <tbody>
                                {valueMyInputs.CustomerUsers.map(ele => 
                                    <tr key={ele.readID}>
                                        <th>
                                            <input type="button" className="form-control" value="-" onClick={()=>handleDeleteContact("branch", ele.readID)}/>
                                        </th>
                                        <th>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "BranchName").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerUsers')} name="BranchName" defaultValue={ele.BranchName}/>
                                        </th>
                                        <th>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "UsersCount").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerUsers')} name="UsersCount" defaultValue={ele.UsersCount}/>
                                        </th>
                                    </tr>

                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 p-0 mt-3 bg-white rounded-4  border">
                        <h6 className="pt-2 px-4 fw-bold">
                            بيانات اتصال الاشخاص
                        
                            <button type="button" className="btn" onClick={()=>handleAddContact("person")}>
                                <i className="bi bi-patch-plus fs-5"></i> 
                            </button>

                            {errInputs.map(err => err.name === "CustomerContacts" && <span className="px-4 text-danger fs-sm">{err.errMsg}</span>)}    

                        </h6>


                        <table className="table px-2 border-top">
                            <thead className="thead-tabel-gray">
                                <tr>
                                    <th scope="col" className="text-center">
                                        <i className="bi bi-x-octagon"></i>
                                    </th>
                                    <th>شخص الاتصال</th>
                                    <th>هاتف 1</th>                                 
                                    <th>هاتف 2</th>                                 
                                    <th>هاتف 3</th>                                 
                                    <th>هاتف 4</th>                                 
                                </tr>
                                
                            </thead>
                            <tbody className="px-3">
                                {valueMyInputs.CustomerContacts.map(ele => 
                                    <tr key={ele.readID}>
                                        <td>
                                            <input type="button" className="form-control"  value="-" onClick={()=>handleDeleteContact("person", ele.readID)}/>
                                        </td>
                                        <td>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "ContactName").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerContacts')} name="ContactName" defaultValue={ele.ContactName}/>
                                        </td>
                                        <td>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "Phone1").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerContacts')} name="Phone1" defaultValue={ele.Phone1}/>
                                        </td>
                                        <td>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "Phone2").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerContacts')} name="Phone2" defaultValue={ele.Phone2}/>
                                        </td>
                                        <td>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "Phone3").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerContacts')} name="Phone3" defaultValue={ele.Phone3}/>
                                        </td>
                                        <td>
                                            <input type="text" className={`form-control ${errInputs.filter(ele => ele.name === "Phone4").length > 0 ? "input_error":""}`} onChange={(e) => handleChangeValue(e, ele.readID , 'CustomerContacts')} name="Phone4" defaultValue={ele.Phone4}/>
                                        </td>
                                    </tr>

                                )}

                            </tbody>
                        </table>

                        <div className="col-12 py-4 border-top  d-flex justify-content-end">
                            {loadingInsert ?
                                    <button type="button" disabled className="btn btn-primary d-flex align-items-center">
                                        <div className="spinner-border border-2 h-2" style={{height: "20px", width: "20px", margin: "0 10px"}} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <div>جاري التنفيذ</div>
                                    </button>
                                    :
                                    <button type="button" onClick={handleSubmitForm} disabled={loadingInsert} className="btn btn-primary d-flex align-items-center">
                                        <div>تنفيذ</div> 
                                    </button>
                                }

                            <Link to="/data_client" className="btn btn-secondary  mx-4">الغاء</Link>                        
                        </div>
                    </div>


                </div>
            </form>

            <AlertBox upId={upCustTypeID} actionUpdateTree={handleUpdateTree} />
            <AlertBoxModel  msg={responseMsg} />

            <div class="dropdown-menu right_click_menu" id="right_click_menu">
                <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addNewType" 
                    onClick={()=>{
                        document.getElementById('addNewType').querySelector('input').value = ""
                    }}>إضافة عنصر</button>

                <div class="dropdown-divider"></div>

                <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addNewType" 
                onClick={()=>{
                        document.getElementById('addNewType').querySelector('input').value = ""
                        setUpCustTypeID(0)
                    }} >إضافة جذر</button>

            </div>

        </>
    )
}

export default AddEditClients;
