import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = ()=>{
	return(
			<div className="custom-bg text-dark">
				<div className="d-flex align-items-center justify-content-center min-vh-100 px-2">
					<div className="text-center">
						<h1 className="display-1 fw-bold">404</h1>
						<p className="fs-2 fw-medium mt-4">ربما تكون الصفحه غير موجوده</p>
						<Link to="/" className="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
							الرئيسيه
						</Link>
					</div>
				</div>
			</div>
	)
}


export default NotFoundPage;