import { useEffect, useState } from "react";
import { makeRequestApi } from "../rest_api";

const ModalDelete = ({link})=>{
    let [linkDel, setLinkDel] = useState();

    const handleDeleteElement = ()=>{
        let btnCloseModal = document.getElementsByClassName("btn-close");
        btnCloseModal && btnCloseModal[0]?.click();
        makeRequestApi(linkDel, "DELETE")
        .then(res =>{
            window.location.reload()
        })
        .catch(err => {window.alert(" خطاء في عملية الحذف"); console.log(err);})

    }

    useEffect(()=>{
        setLinkDel(link);
    }, [link])
    return(
        <>
            <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">

                    <div class="modal-content">

                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel"> تاكيد عملية الحذف ؟</h1>
                            <button type="button" class="btn-close" id="closeModal" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-footer d-flex justify-content-start">
                            <button type="button" class="btn btn-danger" onClick={handleDeleteElement}>نعم</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ModalDelete;