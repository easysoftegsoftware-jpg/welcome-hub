import React, { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api";

const AlertBox = ({upId, actionUpdateTree})=>{
    const [newCustType, setNewCustType] = useState({CustTypeName: "", UpCustTypeID:""})
    let handleAddElement = ()=>{
        let getBtnCloseModel_1 = document.getElementById("btn_close_model_1");
        
        makeRequestApi("http://localhost:1150/api/Codes/CustTypes", "POST", newCustType)
        .then(res =>{
            actionUpdateTree()
            getBtnCloseModel_1.click();
        })

    }

    useEffect(()=>{
        setNewCustType({ CustTypeName: "", UpCustTypeID: upId })
        // setUpCustType(upId)
    },[upId])
    
    return(
        <>
            {/* <div class="modal fade" id="addNewElement" tabindex="-1" aria-labelledby="addNewElementLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="addNewElementLabel">إضافة عنصر</h1>
                            <button type="button" class="btn-close" id="btn_close_model_2" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="text" onChange={(e)=>setNewCustType(state => { return {...state, CustTypeName: e.target.value}})} className="form-control" value={newCustType.CustTypeName} name="root_element" placeholder="أدخل اسم العنصر"/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            <button type="button" class="btn btn-primary" onClick={handleAddNewElement}>تنفيذ</button>
                        </div>
                    </div>
                </div>
            </div> */}
            <div class="modal fade" id="addNewType" tabindex="-1" aria-labelledby="addNewTypeLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="addNewTypeLabel">إضافة {upId === "0" ? "جذر":"عنصر"}</h1>
                            <button type="button" class="btn-close" id="btn_close_model_1" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <input type="text" className="form-control" onChange={(e)=>setNewCustType(state => { return {...state, CustTypeName: e.target.value}})} defaultValue={newCustType.CustTypeName} name="root_element" placeholder={`ادخل اسم ${upId === 0 ? "الجذر":"العنصر"}`}/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            <button type="button" class="btn btn-primary" onClick={handleAddElement}>تنفيذ</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AlertBox;