import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./dashboard.rtl.css";
import "./signin.css";
import "./style.css";

import "bootstrap-icons/font/bootstrap-icons.css";

import { createContext, useEffect, useState } from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Modules from "./pages/modules/Modules.js";
import AddEditModule from "./pages/modules/components/AddEdit.js";
import Signin from "./pages/login/Signin.js";
import Layout from "./components/Layout.js";

import Clients from "./pages/clients/Client.js";
import AddEditClients from "./pages/clients/components/AddEdit.js";

import Appointments from "./pages/appointments/Appointments.js";
import AddEditAppointment from "./pages/appointments/components/AddEdit.js";

import Visits from "./pages/visits/Visits.js";
import AddEditVisit from "./pages/visits/components/AddEdit.js";

import Agents from "./pages/agents/Agents.js";
import AddEditAgent from "./pages/agents/components/AddEdit.js";

import Staff from "./pages/staff/Staff.js";
import AddEditStaff from "./pages/staff/components/AddEdit.js";

import Contracts from "./pages/contracts/Contracts.js";
import AddEditContract from "./pages/contracts/components/AddEdit.js";

import VisitsClients from "./pages/visits_clients/VisitsClient.js";
import TotalClientsTraffic from "./pages/total_clients_traffic/TotalClientsTraffic.js";
import { makeRequestApi } from "./rest_api.js";
import TechAppointment from "./pages/alert/components/Tech_Appointment.js";
import ReviewVisits from "./pages/alert/components/Review_Visits.js";
import ContractLess from "./pages/alert/components/Contract_Less.js";
import VisitLess from "./pages/alert/components/Visit_Less.js";
import AlmostEnd from "./pages/alert/components/AlmostEnd.js";
import NotFoundPage from "./components/Not_Found.js";

export const DataAppContext = createContext()


const App = ()=>{
	let [loading, setLoading] = useState(true);
	let	[auth, setAuth] = useState(false);
	let getRoleId = localStorage.getItem("staff_type");
	useEffect(()=>{
		makeRequestApi("http://localhost:1150/api/Codes/Staffs", "GET")
		.then(res => {
			setAuth(true);
			setLoading(false)
		})
		.catch(err => {
			setAuth(false)
			if(!["/signin", "/login"].includes(window.location.pathname)){
				window.location.assign("/signin")
			}
			setLoading(false)
		})
	}, [])
	if(loading){
		return(
			<div className="text-center d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		)
	}else{
		return (
			<BrowserRouter>
				<Routes>
					{auth ? 
						<>
							<Route path="/" element={<Layout />}>
								{['1','2', '3', '4'].includes(getRoleId) && <Route path="tech_appointment" element={<TechAppointment />} />}	  
								{['3', '4'].includes(getRoleId) && <Route path="contract_less" element={<ContractLess />} />}	  
								{['3', '4'].includes(getRoleId) && <Route path="visit_less" element={<VisitLess />} />	}  
								{['3', '4'].includes(getRoleId) && <Route path="almost_end" element={<AlmostEnd />} />}	  
								{/* <Route path="reviewed_visits" element={<ReviewVisits />} />	   */}
							</Route>

							{
								
							}
							{['3', '4'].includes(getRoleId) && <Route path="/modules" element={<Layout />}>
								<Route index element={<Modules />} />
								<Route path="add" element={<AddEditModule />} />
								<Route path="edit/:id" element={<AddEditModule />} />
							</Route>}

							{['3', '4'].includes(getRoleId) && <Route path="/agents" element={<Layout />}>
								<Route index element={<Agents />} />
								<Route path="add" element={<AddEditAgent />} />
								<Route path="edit/:id" element={<AddEditAgent />} />
							</Route>}

							{['1','2', '3', '4'].includes(getRoleId) && <Route path="/clients" element={<Layout />}>
								<Route index element={<Clients />} />
								<Route path="add" element={<AddEditClients />} />
								<Route path="edit/:id" element={<AddEditClients />} />
							</Route>}

							{['1','2', '3', '4'].includes(getRoleId) && <Route path="/visits" element={<Layout />}>
								<Route index element={<Visits />} />
								<Route path="add" element={<AddEditVisit />} />
								<Route path="edit/:id" element={<AddEditVisit />} />
							</Route>}

							{['2', '3', '4'].includes(getRoleId) && <Route path="/appointments" element={<Layout />}>
									<Route index element={<Appointments />} />
									<Route path="add" element={<AddEditAppointment />} />
									<Route path="edit/:id" element={<AddEditAppointment />} />
							</Route>}

							{['3', '4'].includes(getRoleId) && <Route path="/staff" element={<Layout />}>
								<Route index element={<Staff />} />
								<Route path="add" element={<AddEditStaff />} />
								<Route path="edit/:id" element={<AddEditStaff />} />
							</Route>}

							{['3', '4'].includes(getRoleId) && <Route path="/contracts" element={<Layout />}>
								<Route index element={<Contracts />} />
								<Route path="add" element={<AddEditContract />} />
								<Route path="edit/:id" element={<AddEditContract />} />
							</Route>}

							{['1','2','3', '4'].includes(getRoleId) && <Route path="/visits_clients" element={<Layout />}>
								<Route index element={<VisitsClients />} />
							</Route>}

							{['1','2','3', '4'].includes(getRoleId) && <Route path="/total_clients_traffic" element={<Layout />}>
								<Route index element={<TotalClientsTraffic />} />
							</Route>}
						</>
						:

						<>
							<Route path="/" element={<Navigate to="/signin" replace />} />
							<Route path="/login" element={<Navigate to="/signin" replace />} />
							<Route path="/signin">
								<Route index element={<Signin />} />
							</Route>
						</>

					}

					<Route path="*" element={<NotFoundPage />} />

				</Routes>
			</BrowserRouter>
		  )
	}
}

export default App;
