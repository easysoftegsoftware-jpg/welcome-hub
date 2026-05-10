import { useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api";
import { handleInputsNeedValidation } from "./validation";
import ModelTableReportTraffic from "./components/ModelTableReportTraffic";
import AlertBoxModel from "../../components/AlertBoxModel";

const TotalClientsTraffic = ()=>{

    const [dataClients, setDataClients] = useState([])
    const [dataStaffs, setDataStaffs] = useState([])
    const [report, setReport] = useState([])
    const [errInputs, setErrInput] = useState([]);

    const [responseMsg , setResponseMsg] = useState("")
    const [loadingInsert, setLoadingInsert] = useState(false);
    
    let [selectDataType, setSelectDateType] = useState("period")

    let [propsModalReport, setPropsModalReport] = useState("")
    const defaultSearchVisit = {
        FromDate: new Date().toJSON().split("T")[0], ToDate: new Date().toJSON().split("T")[0],
        CustomerID: ""
    }


    const [valueMyInputs, setValueMyInputs] = useState(defaultSearchVisit);
        
    let [clientName, setClientName] = useState("");

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
            
            makeRequestApi(`http://localhost:1150/api/Report/CustomerCard?${params.toString()}`, "GET")
            .then(res => {
                 
                res.data = res.data.map(report => {
                    return {...report, DocDate: report.DocDate.split("T")[0]}
                })
                res.data = res.data.sort((a, b) => new Date(b.DocDate)  - new Date(a.DocDate))
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
            .then(res =>{setDataClients(res.data) })
            .catch (error => { window.alert("عفوا حدث خظاء اثناء استدعاء البيانات") })
    }, [])

    return(

        <>

            <div className="d-flex flex-wrap justify-content-center align-items-center col-12">
                <div className="col-12  border rounded-4  mt-4" style={{backgroundColor: "white"}}>
                    <div className="p-2 pb-3 col-12 d-flex flex-wrap row-gap-2 row g-2 align-items-end">

                        <div className="col-11 row g-2 d-flex flex-wrap">

                            <div className={selectDataType === "period" ? "col-12 col-sm-4":"col-12 col-sm-6"}>
                                <label htmlFor="FromDate" className="form-label">{selectDataType === "period" ? "من" : "اختر التاريخ"}</label>
                                <input type="date" id="FromDate" name="FromDate" onChange={(e)=>setValueMyInputs(search => {return {...search, FromDate: e.target.value}})} value={valueMyInputs.FromDate} className="form-control"/>
                            </div>

                            <div className={selectDataType === "period" ? "col-12 col-sm-4":"col-12 col-sm-6"} style={{display: selectDataType === "period" ? "block":"none"}}>
                                <label htmlFor="ToDate" style={{visibility: selectDataType === "period" ? "visible":"hidden"}} className="form-label">الى</label>
                                <input id="ToDate" style={{visibility: selectDataType === "period" ? "visible":"hidden"}} type="date" name="ToDate" onChange={(e)=>setValueMyInputs(search => {return {...search, ToDate: e.target.value}})} value={valueMyInputs.ToDate} className="form-control"/>
                            </div>


                            <div className={selectDataType === "period" ? "col-12 col-sm-4":"col-12 col-sm-6"}>

                                <label htmlFor="CustomerID" className="form-label">
                                    العميل
                                    {errInputs.map(err => err.name === "CustomerID" && <span className=" px-3 text-danger">{err.errMsg}</span>)}    
                                </label>
                                <select id="CustomerID" value={valueMyInputs.CustomerID}
                                onChange={(e)=>{
                                    setValueMyInputs(data => {return {...data, CustomerID: e.target.value}});
                                    setClientName(dataClients.filter(client => e.target.value === String(client.CustomerID))[0]?.CustomerName || "")
                                }}
                                className="form-select">
                                    <option value={""} selected disabled>-- بدون تحديد --</option>
                                    {dataClients.map(client => 
                                        <option  value={client.CustomerID}>{client.CustomerName}</option>
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
                                <ModelTableReportTraffic report={report} name={clientName}/>
                            }
                    </div>
                </div>

            </div>


            <AlertBoxModel  msg={responseMsg} />

        </>
    )

}

export default TotalClientsTraffic;
