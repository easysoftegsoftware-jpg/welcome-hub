import React, { useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api.js";
import Table from "../../components/Table.js";
import { EditAction } from "../../components/EditAction.js";
import { DeleteAction } from "../../components/DeleteAction.js";
const DataClient = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null)

    useEffect(()=>{
        try {
            makeRequestApi("http://localhost:1150/api/Codes/Customers", "GET").then(res =>{
                setMyData(res.data)
                setLoading(false)

            });
        } catch (error) {
            window.alert("عفوا حدث خظاء اثناء استدعاء البيانات")
        }

    },[])

    return(
        <>


            {loading === false &&
                <Table
                    title="بيانات العملاء"
                    btn_add={{link: "/clients/add", text: "إضافة عميل"}}
                    heading={[
                        { title: "كود العميل", field: "CustomerID"},
                        { title: "إسم العميل", field: "CustomerName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                        { title: "الايميل", field: "Email" },
                        { title: "العنوان", field: "Address" }
                    ]}
                    data={myData.length > 0 ? myData:[]}
                    actions={[
                        <EditAction href="/clients/edit/"  fieldID="CustomerID"/>,
                        <DeleteAction href="http://localhost:1150/api/Codes/Customers?CustId=" fieldID="CustomerID" />
                    ]}
                />
            }

        </>
    )
}

export default DataClient;