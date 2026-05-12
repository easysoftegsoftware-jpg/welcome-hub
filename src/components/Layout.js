import bootstrapMin from "bootstrap/dist/js/bootstrap.min";
import React, { useEffect, useState } from "react";
import {Outlet , Link, useLocation} from "react-router-dom";
import { roles } from "../roles";

export default function Layout(){
	const [staffName, setStaffName] = useState(window.localStorage.getItem("staff_name"));
	const [staffType, setStaffType] = useState(window.localStorage.getItem("staff_type"));
	let getRole = roles.filter(role => role.roleID === staffType)[0]
	const location = useLocation();
	const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
	const linkCls = (path) => `d-flex align-items-center nav-link ${isActive(path) ? "lv-active" : ""}`;

	let [openSideBar, setOpenSideBar] = useState(false)
	let [openProfileMenu, setOpenProfileMenu] = useState(false)
	const toggleDropMenu = (idMenu)=>{
		let checkDisplay = document.getElementById(idMenu);
		if(checkDisplay.style.display === "none"){
			checkDisplay.style.display = "block";
		}else{
			checkDisplay.style.display = "none";
		}
	}

	const handleLogout = ()=>{
		window.localStorage.removeItem("token_auth");
		window.location.assign("/signin")
	}
	return (
		<>
			{/* <header style={{height: "50px"}} className="navbar d-md-none bg-dark sticky-top justify-content-end flex-md-nowrap p-0"> */}
			<header style={{}} className="navbar bg-white border-bottom sticky-top justify-content-between justify-content-md-end flex-md-nowrap p-0 col-md-9 ms-sm-auto pt-2 px-md-4 width_header_content">
				{/* <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="عرض/إخفاء لوحة التنقل">
			
			</button> */}

				<div className="d-flex align-items-center position-relative mb-2" style={{cursor: "pointer"}}>
					<img src="/images/img_avatar.png" alt="Avatar" className="avatar" />
					<div className="px-2 fs-6" style={{fontFamily: "sans-serif"}}>{staffName}</div>

					<button className="btn" onClick={handleLogout}>
						<i className="bi bi-box-arrow-in-left fs-4"></i>
					</button>
					{/* <div style={{position: "absolute", bottom: 0}} className="m-0">
						<div>Log Out</div>
					</div> */}
				</div>


				<button className="btn d-md-none" onClick={()=>setOpenSideBar(!openSideBar)}>
					<svg width="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"/>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g>
					</svg>
				</button>

			</header>
			<div className="container-fluid">
				<div className="row">
					<div onClick={()=>setOpenSideBar(!openSideBar)} style={openSideBar ? {display: "block", position: "absolute", left:0 , opacity: .5, zIndex: 10001}:{}} className="col-6 bg-dark col-md-3 d-md-block bg-light top-0 p-0 h-100"></div>
					<nav style={openSideBar ? {display: "block", position: "absolute", zIndex: 10001}:{}} className="navbar_dashboard col-6 col-md-3 d-md-block bg-light top-0 sidebar p-0 collapse width_sidebar">
						<div className="position-sticky overflow-auto h-100"  style={{backgroundColor: 'white', borderLeft: "1px solid #e4e7ec"}}>
							<ul className="nav flex-column flex-nowrap pt-3 h-100">
								<li className="">
									<Link className="nav-link active d-none d-md-flex justify-content-center" aria-current="page" to="#">
                    					<img className="" src="/media/icons/icon_logo.ico" alt="" width="130" height="100" />
									</Link>
								</li>
								<li className="nav-item">
									<button onClick={()=>toggleDropMenu("alert_drop_menu")} className="d-flex align-items-center nav-link" type="button">
										<i className="bi bi-bell-fill"></i>
										<span> التنبيهات </span>
									</button>

								</li>
								<ul className="nav-item flex-column dropdown_menu_navbar" id="alert_drop_menu" style={{display: "none"}}>
									{(getRole.view_all || getRole.path_allow.includes("/tech_appointment")) &&
										<li className="dropdown-item">
											<Link className={linkCls("/tech_appointment")} to="/tech_appointment">
												مواعيد الدعم الفني 
											</Link>
										</li>}
									{(getRole.view_all || getRole.path_allow.includes("/contract_less")) &&
										<li className="dropdown-item">
											<Link className={linkCls("/contract_less")} to="/contract_less">
												عملاء بدون عقود صيانة 
											</Link>
										</li>}
									{(getRole.view_all || getRole.path_allow.includes("/visit_less")) &&
										<li className="dropdown-item">
											<Link className={linkCls("/visit_less")} to="/visit_less">
												عملاء انتهت عدد زياراتهم 
											</Link>
										</li>}
									{(getRole.view_all || getRole.path_allow.includes("/almost_end")) &&
										<li className="dropdown-item">
											<Link className={linkCls("/almost_end")} to="/almost_end">
												عقود قاربت على الانتهاء 
											</Link>
										</li>}
									{/* <li className="dropdown-item">
										<Link className="d-flex align-items-center rounded nav-link" to="/reviewed_visits">
											مراجعة الزيارات
										</Link>
									</li> */}
								</ul>
								{(getRole.view_all || getRole.path_allow.includes("/modules")) &&
									<li className="nav-item">
										<Link className={linkCls("/modules")} to="/modules">
											<i className="bi bi-boxes"></i>
											<span> القوائم </span>
										</Link>
									</li>}
								{(getRole.view_all || getRole.path_allow.includes("/agents")) &&
									<li className="nav-item">
										<Link className={linkCls("/agents")} to="/agents">
											<i className="bi bi-database"></i>
											<span> بيانات الوكلاء </span>
										</Link>
									</li>}
								{(getRole.view_all || getRole.path_allow.includes("/clients")) &&
									<li className="nav-item">
										<Link className={linkCls("/clients")} to="/clients">
											<i className="bi bi-people-fill"></i>
											<span> بيانات العملاء </span>
										</Link>
									</li>}
								{(getRole.view_all || getRole.path_allow.includes("/staff")) &&
									<li className="nav-item">
										<Link className={linkCls("/staff")} to="/staff">
											<i className="bi bi-person-vcard-fill"></i>
											<span> بيانات الموظفين </span>
										</Link>
									</li>}
								{(getRole.view_all || getRole.path_allow.includes("/appointments")) &&
									<li className="nav-item">
										<Link className={linkCls("/appointments")} to="/appointments">
											<i className="bi bi-calendar-week-fill"></i>
											<span> المواعيد </span>
										</Link>
									</li>}
								{(getRole.view_all || getRole.path_allow.includes("/visits")) &&
									<li className="nav-item">
										<Link className={linkCls("/visits")} to="/visits">
											<i className="bi bi-person-walking"></i>
											<span> الزيارات </span>
										</Link>
									</li>}
								{(getRole.view_all || getRole.path_allow.includes("/contracts")) &&
									<li className="nav-item">
										<Link className={linkCls("/contracts")} to="/contracts">
											<i className="bi bi-tools"></i>
											<span> عقود الصيانة </span>
										</Link>
									</li>}
								<li className="nav-item nav_heading_items">
									<h5 className="d-flex align-items-center nav-link">
										التقرير
									</h5>
								</li>
								<li className="nav-item">
									<Link className={linkCls("/visits_clients")} to="/visits_clients">
										<i className="bi bi-arrow-down-up"></i>
										<span> زيارات العملاء </span>
									</Link>
								</li>
								<li className="nav-item">
									<Link className={linkCls("/total_clients_traffic")} to="/total_clients_traffic">
										<i className="bi bi-file-earmark-text-fill"></i>
										<span> إجمالي حركة العملاء </span>
									</Link>
								</li>

								{/* <li className="nav-item">
									<a className="d-flex align-items-center nav-link" href="/logout">
										<i className="bi bi-door-open-fill"></i>
										<span> تسجيل الخروج </span>
									</a>
								</li> */}


							</ul>
						</div>
					</nav>

					<main className="col-md-9 ms-sm-auto pt-2 px-md-4 width_header_content">
						<Outlet />
					</main>
				</div>
			</div>

		
		</>
		
	)
}
