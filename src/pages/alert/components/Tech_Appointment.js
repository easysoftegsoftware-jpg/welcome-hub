import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api.js";
import Table from "../../../components/Table.js";
import { EditAction } from "../../../components/EditAction.js";
import ModelTableStaff from "./ModelTableStaff.js";



const TechAppointment = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null)
    let [appointmentNO, setAppointmentNO] = useState(null);
    

    let handleGetTechAppointment = ()=>{
        makeRequestApi("http://localhost:1150/api/Info/TechAppointments", "GET")
        .then(res => {
            let filterAppointment = res.data?.filter(ele => ele.IsClosed === false).map(appointment => {
            return {...appointment,AppointmentDate:appointment.AppointmentDate.split("T")[0],  ADate: appointment.ADate.split("T")[0]}
            })
            filterAppointment = filterAppointment.sort((a, b) => new Date(b.ADate)  - new Date(a.ADate))
            setMyData(filterAppointment)
            setLoading(false)

        })
        .catch (error =>  window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))

    }
    useEffect(()=>{
        handleGetTechAppointment()
    },[])

    return(
        <>
            {loading === false &&
                <Table
                    title="مواعيد الدعم الفني"
                    btn_add={null}
                    heading={[
                        { title: "#", field: "AppointmentNo"},
                        { title: "التاريخ", field: "ADate"},
                        { title: "إسم العميل", field: "CustomerName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                        { title: "سبب الاتصال", field: "CallReason"},
                        { title: "مهندس الدعم", field: "StaffName"},
                    ]}
                    data={myData.length > 0 ? myData:[]}
                    changeStaff={true}
                    changeAppointmentNo={setAppointmentNO}
                />
            }
            <ModelTableStaff ActionUpdateAppointmentData={handleGetTechAppointment} AppointmentNO={appointmentNO}/>

        </>
    )
}

export default TechAppointment;

