import { useEffect, useState } from "react";
import { rolesDesc } from "../../../roles";
import { makeRequestApi } from "../../../rest_api";

const ModelTableStaff = ({AppointmentNO, ActionUpdateAppointmentData})=>{
    const [currPage, setCurrPage] = useState(1);
    let [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null);
    const count = 10;
    const [spliceData, setSpliceData] = useState(([...myData].splice(count * currPage - count, count)));
    
    const checkSpliceData = {
        next: [...myData].splice(count * (currPage + 1) - count, count).length > 0 ? false : true,
        prev: currPage > 1 ? false : true
    }
    const handleChangeSlice = (type) => {
        let action = type === "next" ? currPage + 1 : currPage - 1;
        let doSpliceData = [...myData].splice(count * action - count, count);
        setCurrPage(action);
        setSpliceData(doSpliceData)
    }

    const handleChangeStaff = (staff_id)=>{

        let getButtonDom = document.getElementById(`btn_change_staff_${AppointmentNO}`)     
        makeRequestApi(`http://localhost:1150/api/Trans/Appointments?AppointmentNo=${AppointmentNO}&StaffId=${staff_id}`, "PUT")
        .then(res => {
            
            if(res.data === true){
                console.log("تم التغيير بنجاح");
                ActionUpdateAppointmentData()
                getButtonDom && getButtonDom.click();
            }
        })
        .catch(err => window.alert("عذرا فشلت عملية التغيير"))
    }
    
    useEffect(()=>{
        makeRequestApi("http://localhost:1150/api/Codes/Staffs", "GET")
        .then(res =>{
            setLoading(false);
            setMyData(res.data);
            setSpliceData([...res.data].splice(count * currPage - count, count))
        })
        .catch(err => window.alert("حدث خطاء في جلب بيانات الموظفين"))        
    },[AppointmentNO])
    return(
            <div class="modal fade p-1" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" style={{maxWidth: "90%"}}>
                    <div class="modal-content col-10">
                        <div>  
                            <div className="d-flex col-12 justify-content-between align-items-center p-3 pt-4 border-bottom">
                                <div className="d-flex align-items-center">
                                    <h3>الموظفين</h3>
                                </div>
                                <div className="gap-3 d-flex table_choose_staff_next_prev">
                                    <button disabled={checkSpliceData.next} onClick={()=>handleChangeSlice("next")} className="bi bi-arrow-right-circle fs-3"></button>
                                    <button disabled={checkSpliceData.prev} onClick={()=>handleChangeSlice("prev")} className="bi bi-arrow-left-circle fs-3"></button>
                                </div>
                            </div>
                            {loading === false &&
                                <table class="table table-striped table-hover table_choose_staff">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th>اسم الموظف</th>
                                            <th>نوع الوظيفة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {spliceData.map(staff =>
                                            <tr onDoubleClick={()=>handleChangeStaff(staff.StaffId)}>
                                                <th scope="col">{staff.StaffId}</th >
                                                <td>{staff.StaffName}</td>
                                                <td>{rolesDesc[staff.IsStaffType]}</td>
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

export default ModelTableStaff;