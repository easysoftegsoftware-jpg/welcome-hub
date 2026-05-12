export const DeleteAction = ({href, id, changeLinkDel})=>{
    return(
        <button type="button" className="lv-icon-btn lv-delete" title="حذف"
            onClick={()=>changeLinkDel(`${href}${id}`)}
            data-bs-toggle="modal" data-bs-target="#deleteModal">
            <i className="bi bi-trash"></i>
        </button>
    )
}
