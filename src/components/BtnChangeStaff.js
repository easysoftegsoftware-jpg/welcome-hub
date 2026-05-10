const BtnChangeStaff = ({staff_name, appointment_id, setAppointmentNo})=>{
    return(
        <>
            <button type="button" onClick={()=>setAppointmentNo(appointment_id)} id={`btn_change_staff_${appointment_id}`} class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">{staff_name}</button>
        </>
    )
}

export default BtnChangeStaff;