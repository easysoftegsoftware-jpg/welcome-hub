import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = ()=>{
	return(
			<div class="custom-bg text-dark">
				<div class="d-flex align-items-center justify-content-center min-vh-100 px-2">
					<div class="text-center">
						<h1 class="display-1 fw-bold">404</h1>
						<p class="fs-2 fw-medium mt-4">ربما تكون الصفحه غير موجوده</p>
						<Link to="/" class="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
							الرئيسيه
						</Link>
					</div>
				</div>
			</div>
	)
}


export default NotFoundPage;