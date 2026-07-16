import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./dashboard.rtl.css";
import "./signin.css";
import "./style.css";

import "bootstrap-icons/font/bootstrap-icons.css";

import { createContext, lazy, Suspense, useEffect, useState } from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Layout from "./components/Layout.js";
import NotFoundPage from "./components/Not_Found.js";

const Modules = lazy(() => import("./pages/modules/Modules.js"));
const AddEditModule = lazy(() => import("./pages/modules/components/AddEdit.js"));
const Signin = lazy(() => import("./pages/login/Signin.js"));

const Clients = lazy(() => import("./pages/clients/Client.js"));
const AddEditClients = lazy(() => import("./pages/clients/components/AddEdit.js"));

const Appointments = lazy(() => import("./pages/appointments/Appointments.js"));
const AddEditAppointment = lazy(() => import("./pages/appointments/components/AddEdit.js"));

const Visits = lazy(() => import("./pages/visits/Visits.js"));
const AddEditVisit = lazy(() => import("./pages/visits/components/AddEdit.js"));

const Agents = lazy(() => import("./pages/agents/Agents.js"));
const AddEditAgent = lazy(() => import("./pages/agents/components/AddEdit.js"));

const Staff = lazy(() => import("./pages/staff/Staff.js"));
const AddEditStaff = lazy(() => import("./pages/staff/components/AddEdit.js"));

const Contracts = lazy(() => import("./pages/contracts/Contracts.js"));
const AddEditContract = lazy(() => import("./pages/contracts/components/AddEdit.js"));

const VisitsClients = lazy(() => import("./pages/visits_clients/VisitsClient.js"));
const TotalClientsTraffic = lazy(() => import("./pages/total_clients_traffic/TotalClientsTraffic.js"));
const TechAppointment = lazy(() => import("./pages/alert/components/Tech_Appointment.js"));
const Modifications = lazy(() => import("./pages/modifications/Modifications.js"));
const AddEditModification = lazy(() => import("./pages/modifications/components/AddEdit.js"));
const ModificationDetails = lazy(() => import("./pages/modifications/Details.js"));
const ContractLess = lazy(() => import("./pages/alert/components/Contract_Less.js"));
const VisitLess = lazy(() => import("./pages/alert/components/Visit_Less.js"));
const AlmostEnd = lazy(() => import("./pages/alert/components/AlmostEnd.js"));

export const DataAppContext = createContext()


const App = ()=>{
	const validRoleIds = ['1', '2', '3', '4'];
	const loader = (
		<div className="text-center d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
			<div className="spinner-border" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	);
	let [loading, setLoading] = useState(true);
	let	[auth, setAuth] = useState(false);
	let getRoleId = String(localStorage.getItem("staff_type") || "").trim();
	useEffect(()=>{
		const isPublicAuthRoute = ["/signin", "/login"].includes(window.location.pathname);
		const token = window.localStorage.getItem("token_auth");
		const roleId = String(window.localStorage.getItem("staff_type") || "").trim();

		if(isPublicAuthRoute){
			setAuth(false);
			setLoading(false);
			return;
		}

		if(!token || !validRoleIds.includes(roleId)){
			window.localStorage.removeItem("token_auth");
			setAuth(false);
			setLoading(false);
			return;
		}

		setAuth(true);
		setLoading(false);
	}, [])
	if(loading){
		return loader
	}else{
		return (
			<BrowserRouter>
				<Suspense fallback={loader}>
				<Routes>
					{auth ? 
						<>
							<Route path="/" element={<Layout />}>
								<Route index element={<Navigate to="/tech_appointment" replace />} />
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

							{['1','2','3','4'].includes(getRoleId) && <Route path="/modifications" element={<Layout />}>
								<Route index element={<Modifications />} />
								<Route path="add" element={<AddEditModification />} />
								<Route path="edit/:id" element={<AddEditModification />} />
								<Route path="details/:id" element={<ModificationDetails />} />
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
						<Route path="*" element={<Navigate to="/signin" replace />} />
						</>

					}

					<Route path="*" element={<NotFoundPage />} />

				</Routes>
				</Suspense>
			</BrowserRouter>
		  )
	}
}

export default App;
