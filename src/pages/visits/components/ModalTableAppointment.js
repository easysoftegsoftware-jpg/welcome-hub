import { useEffect, useState } from "react";
import { rolesDesc } from "../../../roles";
import { makeRequestApi } from "../../../rest_api";

const ModelTableAppointment = ({ActionChooseAppointment})=>{
    const [currPage, setCurrPage] = useState(1);
    let [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null);
    const count = 10;
    const [spliceData, setSpliceData] = useState(([...myData].splice(count * currPage - count, count)));
    
    const checkSpliceData = {
        next: [...myData].splice(count * (currPage + 1) - count, count).length > 0 ? false : true,
        prev: currPage > 1 ? false : true
    }

    let [colSearch, setColSearch] = useState({ title: "", field: ""});
    let [inputFilter, setInputFilter] = useState("")

    const handleFilterTabel = (value)=>{
        setInputFilter(value);
        var regex = new RegExp(value, "gi");

        
        console.log(value);
        if(value === ""){
            setSpliceData([...myData].splice(count * currPage - count, count))
        }else{
            let doFilter = myData.filter(record =>  record[colSearch.field].toString().match(regex) !== null );
            setSpliceData(doFilter)
        }
        
    }

    const handleChangeSlice = (type) => {
        let action = type === "next" ? currPage + 1 : currPage - 1;
        let doSpliceData = [...myData].splice(count * action - count, count);
        setCurrPage(action);
        setSpliceData(doSpliceData)
    }

    const handleChooseAppointment = (appointment_no)=>{
                let getButtonDom = document.getElementById(`btn_choose_appointment`)     

                ActionChooseAppointment(appointment_no)
                getButtonDom && getButtonDom.click();
    }
    
    useEffect(()=>{
        makeRequestApi("http://localhost:1150/api/Trans/Appointments", "GET")
        .then(res =>{
            setLoading(false);
            setMyData(res.data);
            setSpliceData([...res.data].splice(count * currPage - count, count))
        })
        .catch(err => window.alert("حدث خطاء في جلب بيانات المواعيد"))        
    },[])
    return(
            <div class="modal fade p-1" id="modelTabelAppointment" tabindex="-1" aria-labelledby="modelTabelAppointmentLabel" aria-hidden="true">
                <div class="modal-dialog" style={{maxWidth: "90%"}}>
                    <div class="modal-content col-10">
                        <div>  
                            <div className="d-flex col-12 justify-content-between align-items-center p-3 pt-4 border-bottom">
                                <div className="d-flex align-items-center">
                                    <h3>المواعيد</h3>
                                </div>


                                {colSearch.field.length > 0 &&
                                    <div class="d-none d-sm-block col-4 d-flex">
                                        <div class="form-floating col-12">
                                            <input type="text" onChange={(e)=>handleFilterTabel(e.target.value)} class="form-control form-control-sm h-0" id="floatingInput" placeholder=""/>
                                            <label for="floatingInput">{colSearch.title}</label>
                                        </div>
                                    </div>
                                }


                                <div className="gap-3 d-flex table_choose_staff_next_prev" style={inputFilter.length === 0 ? {visibility: "visible"}:{visibility: "hidden"}}>
                                    <button disabled={checkSpliceData.next} onClick={()=>handleChangeSlice("next")} className="bi bi-arrow-right-circle fs-3"></button>
                                    <button disabled={checkSpliceData.prev} onClick={()=>handleChangeSlice("prev")} className="bi bi-arrow-left-circle fs-3"></button>
                                </div>


                            </div>
                            {loading === false &&
                                <table class="table table-striped table-hover table_choose_staff">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th onClick={()=>setColSearch({title: "التاريخ", field:"ADate"})} className={`${colSearch.field === "ADate" ? "text-danger":""}`}>التاريخ</th>
                                            <th onClick={()=>setColSearch({title: "اسم العميل", field:"CustomerName"})} className={`${colSearch.field === "CustomerName" ? "text-danger":""}`}>اسم العميل</th>
                                            <th onClick={()=>setColSearch({title: "سبب الاتصال", field:"CallReason"})} className={`${colSearch.field === "CallReason" ? "text-danger":""}`}>سبب الاتصال</th>
                                            <th onClick={()=>setColSearch({title: "مهندس الدعم", field:"StaffName"})} className={`${colSearch.field === "StaffName" ? "text-danger":""}`}>مهندس الدعم</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {spliceData.map(appointment =>
                                            <tr onDoubleClick={()=>handleChooseAppointment(appointment.AppointmentNo)}>
                                                <th scope="col">{appointment.AppointmentNo}</th >
                                                <td>{appointment.ADate}</td>
                                                <td>{appointment.CustomerName}</td>
                                                <td>{appointment.CallReason}</td>
                                                <td>{appointment.StaffName}</td>
                                            </tr>
                                            
                                        )}
                                    </tbody>
                                </table>

                            }
                        </div>

                        </div>
                </div>
            </div>

    )
}

export default ModelTableAppointment;