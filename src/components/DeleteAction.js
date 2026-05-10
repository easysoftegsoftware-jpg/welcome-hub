import { useEffect } from "react";
import { makeRequestApi } from "../rest_api";
export const DeleteAction = ({href, id, changeLinkDel})=>{
    // console.log(changeLinkDel);
    
    // const handleDelete = ()=>{
    //     let confirmDelete = window.confirm("هل تريد حذف الزيارة ؟");
        
    //     console.log(id);
        
    //     if (confirmDelete) {
    //         makeRequestApi(`${href}${id}`, "DELETE")
    //         .then(res => window.location.reload())
    //         .catch(err => {window.alert(" خطاء في عملية الحذف"); console.log(err);
    //         })
    //     }

    // }
    return(
        <button type="button" className="btn border text-light mx-2" onClick={()=>changeLinkDel(`${href}${id}`)}  data-bs-toggle="modal" data-bs-target="#deleteModal">
            <i className="bi bi-trash text-danger" ></i>
        </button>


    )
}