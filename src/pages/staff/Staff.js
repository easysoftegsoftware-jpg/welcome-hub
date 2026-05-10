import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dataStaff, dataVisits } from "../../data";
import { makeRequestApi } from "../../rest_api";
import Table from "../../components/Table";
import { DeleteAction } from "../../components/DeleteAction";
import { EditAction } from "../../components/EditAction";

const Staff = ()=>{
    let [myData, setMyData] = useState([]);    
    let [loading, setLoading] = useState(true)

    const handleDeletStaff = (id)=>{
        let confirmDelete = window.confirm("هل تريد حذف الزيارة ؟");
        console.log(confirmDelete ? "تاكيد الحذف":"الغاء الحذف");
        try {
            makeRequestApi(`http://localhost:1150/api/Codes/Staffs?StaffId=${id}`, "DELETE")
            .then(res => window.location.reload())
            
        } catch (error) {
            window.alert(" خطاء في عملية الحذف")
        }

    }

    useEffect(()=>{
        try {
            makeRequestApi("http://localhost:1150/api/Codes/Staffs", "GET")
            .then(res =>{
                setLoading(false);
                setMyData(res.data)
            })
            
        } catch (error) {
            window.alert("حدث خطاء في جلب البيانات")
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
            {myData.length > 0 ? 
                <Table
                    title="بيانات الموظفين"
                    btn_add={{link: "/staff/add", text: "إضافة موظف"}}
                    heading={[
                        { title: "كود الموظف", field: "StaffId"},
                        { title: "اسم الموظف", field: "StaffName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                        { title: "نوع الوظيفة", field: "IsStaffType" }
                    ]}
                    data={myData}
                    actions={[
                        <EditAction href="/staff/edit/"  fieldID="StaffId"/>,
                        <DeleteAction href="http://localhost:1150/api/Codes/Staffs?StaffId=" fieldID="StaffId" />
                    ]}
                />
                    :
                    <div>Loading ...</div>
            }

        </>

    )}
}

export default Staff;