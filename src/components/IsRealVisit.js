import { useState } from "react";
import { makeRequestApi } from "../rest_api";
const IsRealVisit = ({visit})=>{
    let [isRealVisit, setIsRealVisit] = useState(visit.IsRealVisit);
    const handleIsRealVisit = ()=>{
        let updateIsRealVisit = visit;
        updateIsRealVisit.IsRealVisit = !visit.IsRealVisit;
        makeRequestApi(`http://localhost:1150/api/Trans/Visits`, "PUT", updateIsRealVisit)
        .then(res => {
            console.log(updateIsRealVisit.IsRealVisit);
            
            setIsRealVisit(updateIsRealVisit.IsRealVisit) })
        .catch(err => {window.alert(" عفوا لم يتم تنفيذ الطلب"); console.log(err);
        })

    }
    return(
        <div className="form-check form-switch">
            <input className="form-check-input" checked={isRealVisit} type="checkbox" role="switch" id="btn_is_realvisit" onChange={handleIsRealVisit} />
        </div>

    )
}


export default IsRealVisit;