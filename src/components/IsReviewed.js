import { useState } from "react";
import { makeRequestApi } from "../rest_api";
const IsReviewed = ({visit})=>{
    let [isReviewed, setIsReviewed] = useState(visit.IsReviewed);
    const handleIsReviewed = ()=>{
        let updateIsReviewed = visit;
        updateIsReviewed.IsReviewed = !visit.IsReviewed;
        makeRequestApi(`http://localhost:1150/api/Trans/Visits`, "PUT", updateIsReviewed)
        .then(res => setIsReviewed(updateIsReviewed.IsReviewed) )
        .catch(err => {window.alert(" عفوا لم يتم تنفيذ الطلب"); console.log(err);
        })

    }
    return(
        <div className="form-check form-switch">
            <input className="form-check-input" checked={isReviewed} type="checkbox" role="switch" id="btn_is_reviewed" onChange={handleIsReviewed} />
        </div>

    )
}


export default IsReviewed;