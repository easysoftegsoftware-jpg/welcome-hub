import { Link } from "react-router-dom"

export const EditAction = ({href, id})=>{
    return(
        <Link to={href+id} className="btn border text-light mx-2">
            <i className="bi bi-pencil-square text-dark" ></i>
        </Link>

    )
}