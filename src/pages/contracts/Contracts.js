import {useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api.js";
import Table from "../../components/Table.js";
import { EditAction } from "../../components/EditAction.js";
import { DeleteAction } from "../../components/DeleteAction.js";


const DataModules = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null)

    useEffect(()=>{
        try {
            makeRequestApi("http://localhost:1150/api/Trans/Contracts", "GET").then(res => {
                // let editData = {ContractDate: res.data.ContractDate.split("T")[0]};
                res.data = res.data.map(contract => {
                    return {...contract, ContractDate: contract.ContractDate.split("T")[0]}
                })
                res.data = res.data.sort((a, b) => new Date(b.ContractDate)  - new Date(a.ContractDate))
                setMyData(res.data)});
                setLoading(false)
        } catch (error) {
            window.alert("عفوا حدث خظاء اثناء استدعاء البيانات")
        }

    },[])

    return(
        <>


            {loading === false &&
                <Table
                    title="عقود الصيانة"
                    btn_add={{link: "/contracts/add", text: "إضافة عقد"}}
                    heading={[
                        { title: "#", field: "ContractNo"},
                        { title: "تاريخ", field: "ContractDate"},
                        { title: "العميل", field: "CustomerName"},
                        { title: "شخص الاتصال", field: "PersonName"},
                        { title: "قيمة العقد", field: "ContractVal"},
                        { title: "عدد الزيارات", field: "ContractVisits"},
                        // { title: "إسم الموديول", field: "ModuleName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                    ]}
                    data={myData}
                    actions={[
                        <EditAction href="/contracts/edit/"  fieldID="ContractNo"/>,
                        <DeleteAction href="http://localhost:1150/api/Trans/Contracts?ContractNo=" fieldID="ContractNo" />
                    ]}
                />
            }

        </>
    )
}

export default DataModules;

