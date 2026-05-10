import {useEffect, useState } from "react";
import Table from "../../../components/Table.js";
import IsRealVisit from "../../../components/IsRealVisit.js";
import IsReviewed from "../../../components/IsReviewed.js";
import { makeRequestApi } from "../../../rest_api.js";


const ReviewVisits = ()=>{
    const [myData, setMyData] = useState([]);
    
    useEffect(()=>{
        try {
            makeRequestApi("http://localhost:1150/api/Trans/Visits", "GET").then(res =>{
                
                setMyData(res.data)
            });
        } catch (error) {
            window.alert("عفوا حدث خظاء اثناء استدعاء البيانات")
        }

    },[])

    return(
        <>


            {myData.length > 0 ? 
                <Table
                    title="مراجعة الزيارات"
                    btn_add={null}
                    heading={[
                        { title: "#", field: "VisitNo", styleRow: {textAlign: "center"}},
                        { title: "تاريخ", field: "VisitDate"},
                        { title: "إسم العميل", field: "CustomerName"},
                        { title: "مهندس الدعم", field: "StaffName"},
                        { title: "سبب الاتصال", field: "CallReason"},
                        { title: "ما تم", field: "WhatDone"},
                        // { title: "إسم الموديول", field: "ModuleName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                    ]}
                    data={myData}
                    actions={[]}
                    isReviewed={<IsReviewed/>}
                    isRealVisit={<IsRealVisit/>}
                />
                    :
                    <div></div>
            }

        </>
    )
}

export default ReviewVisits;

