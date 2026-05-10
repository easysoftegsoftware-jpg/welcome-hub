import {useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api.js";
import Table from "../../components/Table.js";
import { EditAction } from "../../components/EditAction.js";
import { DeleteAction } from "../../components/DeleteAction.js";


const Visits = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(true)
    useEffect(()=>{

        makeRequestApi("http://localhost:1150/api/Trans/Visits", "GET")
        .then(res =>{
            
            res.data = res.data.map(visits => {
                return {...visits, VisitDate: visits.VisitDate.split("T")[0]}
            })
            res.data = res.data.sort((a, b) => new Date(b.VisitDate)  - new Date(a.VisitDate))
            
            setMyData(res.data)
            setLoading(false)
        })
        .catch (err => window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))

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
    
                {/* {myData.length > 0 ?  */}
                {loading === false &&
                    <Table
                        title="الزيارات"
                        btn_add={{link: "/visits/add", text: "إضافة زيارة"}}
                        heading={[
                            { title: "#", field: "VisitNo", styleRow: {textAlign: "center"}},
                            { title: "تاريخ", field: "VisitDate"},
                            { title: "إسم العميل", field: "CustomerName"},
                            { title: "سبب الاتصال", field: "CallReason"},
                            { title: "مهندس الدعم", field: "StaffName"},
                            // { title: "إسم الموديول", field: "ModuleName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                        ]}
                        data={myData.length > 0 ? myData:[]}
                        updateData={setMyData}
                        actions={[
                            <EditAction href="/visits/edit/"  fieldID="VisitNo"/>,
                            <DeleteAction href="http://localhost:1150/api/Trans/Visits?VisitNo=" fieldID="VisitNo" />
                        ]}
                    />
                }
            </>
        )
    }
}

export default Visits;

