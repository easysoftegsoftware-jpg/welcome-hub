import { useEffect, useState } from "react";
import { makeRequestApi } from "../../../rest_api.js";
import Table from "../../../components/Table.js";
import SendMail from "../../../components/SendMail.js";


const AlmostEnd = ()=>{
    const [myData, setMyData] = useState([]);
    let [loading, setLoading] = useState(null)

    useEffect(()=>{
            makeRequestApi("http://localhost:1150/api/Info/ConstractsAlmostEnd", "GET")
            .then(res => {
                res.data = res.data.map(contract => {
                    return {...contract, ContractDate: contract.ContractDate.split("T")[0]}
                })
                res.data = res.data.sort((a, b) => new Date(b.ContractDate)  - new Date(a.ContractDate))

                setMyData(res.data)
                setLoading(false)

            })
            .catch (error =>  window.alert("عفوا حدث خظاء اثناء استدعاء البيانات"))

    },[])

    return(
        <>


            {loading === false &&
                <Table
                    title="عقود صيانة قاربت على اانتهاء"
                    btn_add={null}
                    heading={[
                        { title: "#", field: "ContractNo"},
                        { title: "العميل", field: "CustomerName"},
                        { title: "تاريخ اخر عقد", field: "ContractDate"},
                        { title: "الايام المتبقية", field: "RemainDays"},
                        { title: "القيمة المطلوبة", field: "MotalbaVal"},
                    ]}
                    data={myData.length > 0 ? myData:[]}
                    actions={[]}
                    sendMail={<SendMail />}
                />
            }

        </>
    )
}

export default AlmostEnd;

