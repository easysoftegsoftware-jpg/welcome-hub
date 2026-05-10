import {useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api.js";
import Table from "../../components/Table.js";
import { EditAction } from "../../components/EditAction.js";
import { DeleteAction } from "../../components/DeleteAction.js";


const Appointments = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(true)
    
    useEffect(()=>{
        try {
            makeRequestApi("http://localhost:1150/api/Trans/Appointments", "GET").then(res =>{
                res.data = res.data.map(appointment => {
                    return {...appointment,AppointmentDate:appointment.AppointmentDate.split("T")[0],  ADate: appointment.ADate.split("T")[0]}
                })
                res.data = res.data.sort((a, b) => new Date(b.AppointmentDate)  - new Date(a.AppointmentDate))

                setMyData(res.data);
                setLoading(false)
            });
        } catch (error) {
            window.alert("عفوا حدث خظاء اثناء استدعاء البيانات")
        }

    },[])
    if(loading){
            return(
                <div className="text-center d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )

    }else{

        return(
            <>


                {loading === false &&
                    <Table
                        title="المواعيد"
                        btn_add={{link: "/appointments/add", text: "إضافة ميعاد"}}
                        heading={[
                            { title: "#", field: "AppointmentNo",styleRow: {textAlign: "center"}},
                            { title: "التاريخ", field: "AppointmentDate"},
                            { title: "اسم العميل", field: "CustomerName"},
                            { title: "سبب الاتصال", field: "CallReason"},
                            { title: "مهندس الدعم", field: "StaffName"},
                            { title: "الميعاد", field: "ADate"},
                            // { title: "إسم الموديول", field: "ModuleName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                        ]}
                        data={myData}
                        actions={[
                            <EditAction href="/appointments/edit/"  fieldID="AppointmentNo"/>,
                            <DeleteAction href="http://localhost:1150/api/Trans/Appointments?AppointmentNo=" fieldID="AppointmentNo" />
                        ]}
                    />
                }

            </>
        )
    }
}

export default Appointments;

