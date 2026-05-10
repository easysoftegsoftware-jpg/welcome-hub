import { useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api";
import { handleInputsNeedValidation } from "./validation";
import ModelTableReport from "./components/ModalTableReport";
import AlertBoxModel from "../../components/AlertBoxModel";

const VisitsClients = ()=>{

    const [dataClients, setDataClients] = useState([])
    const [dataStaffs, setDataStaffs] = useState([])
    const [report, setReport] = useState([])

    const [errInputs, setErrInput] = useState([]);
    const [responseMsg , setResponseMsg] = useState("")
    const [loadingInsert, setLoadingInsert] = useState(null);
    
    let [selectDataType, setSelectDateType] = useState("period")

    let [propsModalReport, setPropsModalReport] = useState("")
    const defaultSearchVisit = {
        FromDate: new Date().toJSON().split("T")[0], ToDate: new Date().toJSON().split("T")[0],
        VisitType: "", CustomerID: "", StaffId: ""
    }


    const [valueMyInputs, setValueMyInputs] = useState(defaultSearchVisit);
        
        
    const handleSubmit = ()=>{
        setLoadingInsert(true)
        let getElementClickAlert = document.getElementById("liveToastBtn");
        let getCheckStatus = handleInputsNeedValidation(valueMyInputs);

        setErrInput(getCheckStatus);

        
        if(getCheckStatus.length === 0){
            const params = new URLSearchParams();
            for (const key in valueMyInputs) {
                if(valueMyInputs[key] && valueMyInputs[key].length > 0){
                    let changeToDateIf = key === "ToDate" &&  selectDataType === "date" ?  valueMyInputs.FromDate:valueMyInputs[key];
                    params.append(key, changeToDateIf)
                }
            }
            
            makeRequestApi(`http://localhost:1150/api/Report/CustomerVisits?${params.toString()}`, "GET")
            .then(res => {
                 
                res.data = res.data.map(visits => {
                    return {...visits, VisitDate: visits.VisitDate.split("T")[0]}
                })
                res.data = res.data.sort((a, b) => new Date(b.VisitDate)  - new Date(a.VisitDate))

                setResponseMsg(res.data.length === 0 ? "لا توجد بينات متطابقة للبحث":"تم انشاء التقرير بنجاح")
                setReport(res.data);
                getElementClickAlert && getElementClickAlert.click();
                setLoadingInsert(false)
            })
            .catch(err => window.alert("حدث خطاء في جلب بيانات التقرير"))        
        }
        
        


    }
    

    useEffect(()=>{
            makeRequestApi("http://localhost:1150/api/Codes/Customers", "GET")
            .then(res =>{ setDataClients(res.data) })
            .catch (error => { window.alert("عفوا حدث خظاء اثناء استدعاء البيانات") })

            makeRequestApi("http://localhost:1150/api/Codes/Staffs", "GET")
            .then(res =>{ setDataStaffs(res.data) })
            .catch (error => { window.alert("عفوا حدث خظاء اثناء استدعاء البيانات") })

    }, [valueMyInputs])

    return(

        <>

            <div className="d-flex justify-content-center align-items-center col-12">
                <div className="col-12  border rounded-4 mt-4" style={{backgroundColor: "white"}}>
                    <div className="p-4 col-12 d-flex flex-wrap row-gap-2 row g-2 justify-content-between align-items-end">

                            
                            <div className="col-6 col-lg-2">
                                <label htmlFor="FromDate" className="form-label">{selectDataType === "period" ? "من" : "اختر التاريخ"}</label>
                                <input type="date" id="FromDate" name="FromDate" onChange={(e)=>setValueMyInputs(search => {return {...search, FromDate: e.target.value}})} value={valueMyInputs.FromDate} className="form-control"/>
                            </div>

                            <div className="col-6 col-lg-2">
                                <label htmlFor="ToDate" style={{visibility: selectDataType === "period" ? "visible":"hidden"}} className="form-label">الى</label>
                                <input id="ToDate" style={{visibility: selectDataType === "period" ? "visible":"hidden"}} type="date" name="ToDate" onChange={(e)=>setValueMyInputs(search => {return {...search, ToDate: e.target.value}})} value={valueMyInputs.ToDate} className="form-control"/>
                            </div>

                        <div className="col-12 col-md-11 col-lg-7 row g-1 d-flex justify-content-center">
                            <div className="col-12 col-lg-4">
                                <label htmlFor="CustomerID" className="form-label">العميل</label>
                                <select id="CustomerID" value={valueMyInputs.CustomerID}
                                onChange={(e)=>setValueMyInputs(data => {return {...data, CustomerID: e.target.value}})}
                                className="form-select">
                                    <option value={""} selected disabled>-- بدون تحديد --</option>
                                    {dataClients.map(client => 
                                        <option  value={client.CustomerID}>{client.CustomerName}</option>
                                    )}
                                </select>
                            </div>

                            <div className="col-6 col-lg-4 mt-2">
                                <label htmlFor="VisitType" className="form-label">نوع الزيارة</label>
                                <select id="VisitType" onChange={(e)=>setValueMyInputs(data => {return {...data, VisitType: e.target.value}})} value={valueMyInputs.VisitType} className="form-select">
                                    <option value={""} disabled>-- بدون تحديد --</option>
                                    <option value={"1"}>اون لاين</option>
                                    <option value={"2"}>تدريب</option>
                                    <option value={"3"}>لدي عميل</option>
                                </select>
                            </div>


                            <div className="col-6 col-lg-4 mt-2">
                                <label htmlFor="StaffId" className="form-label">مهندس الدعم</label>
                                <select id="StaffId"  onChange={(e)=>setValueMyInputs(data => {return {...data, StaffId: e.target.value}})} value={valueMyInputs.StaffId} className="form-select">
                                    <option value={""} selected disabled>-- بدون تحديد --</option>
                                    {dataStaffs.map(staff => 
                                        <option value={staff.StaffId}>{staff.StaffName}</option>
                                    )}
                                    
                                </select>
                            </div>
                        </div>
                            

                                    

                        <div className=" col-12 col-sm-1 d-flex justify-content-end">
                            <button className="btn border" onClick={handleSubmit} >
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                            { (!loadingInsert && report.length > 0) &&
                                <ModelTableReport report={report} filter={valueMyInputs}/>
                            }
                    </div>
                </div>
            </div>
            <AlertBoxModel  msg={responseMsg} />

        </>
    )

}

export default VisitsClients;
