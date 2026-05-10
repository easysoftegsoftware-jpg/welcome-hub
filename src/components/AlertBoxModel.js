import bootstrapMin from "bootstrap/dist/js/bootstrap.min";
import React, { useEffect } from "react";

const AlertBoxModel = ({msg})=>{
    useEffect(()=>{
                const toastTrigger = document.getElementById('liveToastBtn')
                const toastLiveExample = document.getElementById('liveToast')
                if (toastTrigger) {
                toastTrigger.addEventListener('click', () => {
                    const toast = new bootstrapMin.Toast(toastLiveExample)

                    toast.show()
                })
                }

        })

    return(
        <>
            <div class="toast-container position-fixed start-0 d-flex  justify-content-center" style={{width: "100%", top: "1rem"}}>
                <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="1500">
                    <div class="alert m-0 d-flex align-items-center" role="alert">
                        <i class="bi bi-check-circle-fill text-success fs-6"></i>
                        <div className="px-2 fs-6 text-success">
                            {msg}
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" style={{display: "none"}} class="btn btn-primary" id="liveToastBtn">toast</button>

        </>
    )
}

export default AlertBoxModel;