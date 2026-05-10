import { useEffect, useState } from "react";
import { makeRequestApi } from "../../rest_api.js";
import Table from "../../components/Table.js";
import { EditAction } from "../../components/EditAction.js";
import { DeleteAction } from "../../components/DeleteAction.js";
const DataAgents = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null)

    useEffect(()=>{
        try {
            makeRequestApi("http://localhost:1150/api/Codes/Agents", "GET").then(res =>{
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
                    title="بيانات الوكلاء"
                    btn_add={{link: "/agents/add", text: "إضافة وكيل"}}
                    heading={[
                        { title: "#", field: "AgentID", styleRow: {textAlign: "center"}},
                        { title: "إسم الوكيل", field: "AgentName" , classHead: "", classRow: "text-headline-gray" , styleRow: {fontSize: "larger"}},
                        { title: "الايميل", field: "Email" },
                        { title: "العنوان", field: "Address" }
                    ]}
                    data={myData.length > 0 ? myData:[]}
                    actions={[
                        <EditAction href="/agents/edit/"  fieldID="AgentID"/>,
                        <DeleteAction href="http://localhost:1150/api/Codes/Agents?AgentId=" fieldID="AgentID" />
                    ]}
                />
            }

        </>
    )
}

export default DataAgents;

