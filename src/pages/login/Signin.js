import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeRequestApi } from "../../rest_api";
const Signin = ()=>{
    const [dataLogin, setDataLogin] = useState({StaffName: "", Password: ""});
    let [handleErr, setHandleErr] = useState("");

    let [errorInputs, setErrorInput] = useState([]);

    const handleSubmitLogin = ()=>{
        setHandleErr("");
        setErrorInput([])
        let checkInputs = {
            StaffName: dataLogin.StaffName.length === 0,
            Password: dataLogin.Password.length === 0,
        }
        
        
        if(checkInputs.StaffName || checkInputs.Password){
            let newError = [];
            checkInputs.StaffName && newError.push({name: "StaffName", errMsg: "ادخل اسم المستخدم"})
            checkInputs.Password && newError.push({name: "Password", errMsg: "ادخل كلمة المرور"})

            setErrorInput(newError)
        }else{
            setErrorInput([])
            makeRequestApi("http://localhost:1150/api/Identity/LogIn", "POST", dataLogin)
            .then(res => {
                if(res.status === 200){
                    window.localStorage.setItem("token_auth", res.data.Token);
                    window.localStorage.setItem("staff_name", res.data.StaffName);
                    window.localStorage.setItem("staff_id", res.data.StaffId);
                    window.localStorage.setItem("staff_type", res.data.IsStaffType);
                    window.location.assign("/")
                }else{
                    setHandleErr("هناك خطاء في اسم المستخدم او كلمة المرور")
                }
            })
            .catch(err => {
                setHandleErr("هناك خطاء في اسم المستخدم او كلمة المرور")
            })
        }
        
    }
    return(
    <main className="form-signin col-12 d-flex justify-content-center align-items-center h-full-vh">
        <form id="form_signin" className="border rounded-4 p-4 col-10 col-sm-8 col-md-6 col-xl-4 bg-white">
            <div className="mb-4 d-flex align-items-center justify-content-center ">
                <img className="" src="./media/icons/icon_logo.ico" alt="" width="150" height="150" />
            </div>

            <div className="text-danger pb-2 text-center fw-bold">{handleErr}</div>
            
            <div className="py-2">
                <label htmlFor="floatingInput" className="pb-2 fw-bolder">
                    أسم المستخدم
                    {errorInputs.map(ele => ele.name === "StaffName" && <span className="text-danger fw-medium px-4">* {ele.errMsg}</span>)}

                </label>
                <input type="text" className={`form-control ${errorInputs.filter(input => input.name === "StaffName").length > 0 ? "border-danger":""}`} onChange={(e)=>setDataLogin(state => {return {...state, StaffName: e.target.value}})} value={dataLogin.StaffName} id="floatingInput" />
            </div>
            <div className="py-2">
                <label htmlFor="floatingPassword" className="pb-2 fw-bolder">
                    كلمة المرور
                    
                    {errorInputs.map(ele => ele.name === "Password" && <span className="text-danger fw-medium px-4">* {ele.errMsg}</span>)}
                </label>
                <input type="password" onKeyUp={(e)=>{e.key === "Enter" && handleSubmitLogin()}} className={`form-control ${errorInputs.filter(input => input.name === "Password").length > 0 ? "border-danger":""}`} onChange={(e)=>setDataLogin(state => {return {...state, Password: e.target.value}})} value={dataLogin.Password} id="floatingPassword" />
            </div>

            {/* <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me" />
                    <span> تذكرني دائماَ</span>
                </label>
            </div> */}
            <button className="w-100 btn btn-md btn-primary mt-2" type="button" onClick={handleSubmitLogin}>تسجيل دخول</button>
            <p className="mt-5 mb-3 text-muted text-center">&copy; 2004 - 2025</p>
        </form>
    </main>
        
    )
}


export default Signin;




const newLogin = ()=>{
    return(
        <form class="form" action="">
                <div class="form__title">Login Form</div>
                <div class="form__sub-title">Welcome Back!</div>
                <div class="form__input-wrapper">
                    <input class="form__input" placeholder="Username or Email" type="text" />
                    <div class="form__input-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M10.49 2.23006L5.50003 4.10005C4.35003 4.53005 3.41003 5.89004 3.41003 7.12004V14.55C3.41003 15.73 4.19005 17.28 5.14005 17.99L9.44003 21.2001C10.85 22.2601 13.17 22.2601 14.58 21.2001L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12004C20.61 5.89004 19.67 4.53005 18.52 4.10005L13.53 2.23006C12.68 1.92006 11.32 1.92006 10.49 2.23006Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                        d="M12.0001 10.92C11.9601 10.92 11.9101 10.92 11.8701 10.92C10.9301 10.89 10.1801 10.11 10.1801 9.16003C10.1801 8.19003 10.9701 7.40002 11.9401 7.40002C12.9101 7.40002 13.7001 8.19003 13.7001 9.16003C13.6901 10.12 12.9401 10.89 12.0001 10.92Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                        d="M10.01 13.72C9.05004 14.36 9.05004 15.41 10.01 16.05C11.1 16.78 12.89 16.78 13.98 16.05C14.94 15.41 14.94 14.36 13.98 13.72C12.9 12.99 11.11 12.99 10.01 13.72Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                </div>
                <div class="form__input-wrapper">
                    <input id="password-input" class="form__input form__input--has-svg" placeholder="Password" type="password" />
                    <div class="form__input-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                        d="M16.28 13.61C15.15 14.74 13.53 15.09 12.1 14.64L9.51001 17.22C9.33001 17.41 8.96001 17.53 8.69001 17.49L7.49001 17.33C7.09001 17.28 6.73001 16.9 6.67001 16.51L6.51001 15.31C6.47001 15.05 6.60001 14.68 6.78001 14.49L9.36001 11.91C8.92001 10.48 9.26001 8.86001 10.39 7.73001C12.01 6.11001 14.65 6.11001 16.28 7.73001C17.9 9.34001 17.9 11.98 16.28 13.61Z"
                        stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                        stroke-linejoin="round" />
                        <path d="M10.45 16.28L9.59998 15.42" stroke="currentColor" stroke-width="1.5"
                        stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.3945 10.7H13.4035" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div class="form__pass-toggle">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_216_38)">
                            <path
                            d="M0.833374 9.99998C0.833374 9.99998 4.16671 3.33331 10 3.33331C15.8334 3.33331 19.1667 9.99998 19.1667 9.99998C19.1667 9.99998 15.8334 16.6666 10 16.6666C4.16671 16.6666 0.833374 9.99998 0.833374 9.99998Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                            <clipPath id="clip0_216_38">
                            <rect width="20" height="20" fill="white" />
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
                <a href="#" class="form__forget">Forgot Password?</a>
                <button class="form__submit-btn" type="submit">ENTER</button>
            </form>

    )
}