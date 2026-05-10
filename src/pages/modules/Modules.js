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
            makeRequestApi("http://localhost:1150/api/Codes/Modules", "GET").then(res =>{
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
                    title="القوائم"
                    btn_add={{link: "/modules/add", text: "إضافة قائمة"}}
                    heading={[
                        { title: "كود القائمة", field: "ModuleId"},
                        { title: "إسم القائمة", field: "ModuleName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                    ]}
                    data={myData.length > 0 ? myData:[]}
                    actions={[
                        <EditAction href="/modules/edit/"  fieldID="ModuleId"/>,
                        <DeleteAction href="http://localhost:1150/api/Codes/Modules?ModuleId=" fieldID="ModuleId" />
                    ]}
                />
            }

        </>
    )
}

export default DataModules;

