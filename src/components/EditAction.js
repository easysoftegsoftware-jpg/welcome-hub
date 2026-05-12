import { Link } from "react-router-dom"

export const EditAction = ({href, id})=>{
    return(
        <Link to={href+id} className="lv-icon-btn lv-edit" title="تعديل">
            <i className="bi bi-pencil-square"></i>
        </Link>
    )
}
