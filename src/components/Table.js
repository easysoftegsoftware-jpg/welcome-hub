import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bootstrapMin from "bootstrap/dist/js/bootstrap.min.js";
import BtnChangeStaff from "./BtnChangeStaff";
import { rolesDesc } from "../roles";
import ModalDelete from './ModalDelete.js';
const Table = ({title, btn_add, heading = [], data, actions = [] , isReviewed, isRealVisit, sendMail, sendAlert, changeStaff, changeAppointmentNo}) => {
    const [currPage, setCurrPage] = useState(Number(new URLSearchParams(window.location.search).get("page")) || 1);
    const [myData, setMyData] = useState([])
    const checkRole = localStorage.getItem("staff_type");

    const [deleteLink, setDeleteLink] = useState("");

    
    const count = 10;
    const [spliceData, setSpliceData] = useState(([...myData].splice(count * currPage - count, count)));
    

    const checkSpliceData = {
        next: [...myData].splice(count * (currPage + 1) - count, count).length > 0 ? false : true,
        prev: currPage > 1 ? false : true
    }
    

    let [colSearch, setColSearch] = useState({ title: "", field: ""});
    let [inputFilter, setInputFilter] = useState("")

    let [sortDate, setSortDate] = useState("a-b")

    const handleFilterTabel = (value)=>{
        setInputFilter(value);
        var regex = new RegExp(value, "gi");

        
        console.log(value);
        if(value === ""){
            setSpliceData([...myData].splice(count * currPage - count, count))
        }else{
            let doFilter = myData.filter(record =>  record[colSearch.field].toString().match(regex) !== null );
            setSpliceData(doFilter)
        }
        
        setTimeout(()=>{
            let tooltip = document.querySelector("[class='tooltip bs-tooltip-auto fade show']");
            tooltip?.remove();
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipTriggerList].map(tooltipTriggerEl =>  new bootstrapMin.Tooltip(tooltipTriggerEl) );

        }, 1000)

    }
    
    const handleChangeCurrPage = (type) => {
        let action = type === "next" ? currPage + 1 : currPage - 1;
        let doSpliceData = [...myData].splice(count * action - count, count);
        // const url = new URL(window.location);
        // url.searchParams.set("page", action);
        // window.history.pushState({}, "", url);
        
        setCurrPage(action);
        setSpliceData(doSpliceData)
        setTimeout(()=>{
            let tooltip = document.querySelector("[class='tooltip bs-tooltip-auto fade show']");
            tooltip?.remove();
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipTriggerList].map(tooltipTriggerEl =>  new bootstrapMin.Tooltip(tooltipTriggerEl) );
        }, 1000)
        
    }
    
    const handleSortData = (field)=>{
        let makeSort;
        console.log('click');
        
        if(sortDate === "new"){
            makeSort = myData.sort((a, b) => new Date(b[field]) - new Date(a[field]));
            setSortDate("old")
        }else{
            makeSort = myData.sort((a, b) => new Date(a[field]) - new Date(b[field]));
            setSortDate("new")
        }
        setMyData(makeSort);
        setSpliceData([...makeSort].splice(count * currPage - count, count))

    }

    useEffect(() => {
        setMyData(data)
        setSpliceData([...data].splice(count * currPage - count, count))
        setTimeout(()=>{
            let tooltip = document.querySelector("[class='tooltip bs-tooltip-auto fade show']");
            tooltip?.remove();
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipTriggerList].map(tooltipTriggerEl =>  new bootstrapMin.Tooltip(tooltipTriggerEl).update() );
            // [...tooltipTriggerList].map(tooltipTriggerEl =>  new bootstrapMin.Tooltip(tooltipTriggerEl) );

        }, 1000)
        // const url = new URL(window.location);
        // url.searchParams.set("page", 1);
        // window.history.pushState({}, "", url);
    }, [data])
    
    return (
        <>
            <div className="d-flex flex-wrap justify-content-center py-4 mt-4 bg-white border rounded-4">
                <div className=" d-flex flex-wrap col-12 justify-content-between align-items-center p-3 pt-1">

                    <div className="d-flex align-items-center">
                        <h3>{title}</h3>
                    </div>

                    {colSearch.field.length > 0 &&
                        <div class="d-none d-sm-block col-4 d-flex">
                            <div class="form-floating col-12">
                                <input type="text" onChange={(e)=>handleFilterTabel(e.target.value)} class="form-control form-control-sm h-0" id="floatingInput" placeholder=""/>
                                <label for="floatingInput">{colSearch.title}</label>
                            </div>
                        </div>
                    }

                    {btn_add &&
                        <Link to={btn_add.link} className="btn btn-primary d-flex align-items-center">
                            <div>{btn_add.text}</div>
                        </Link>
                    }
                    {colSearch.field.length > 0 &&
                        <div class="d-sm-none mt-3 col-12 d-flex">
                            <div class="form-floating col-12">
                                <input type="text" onChange={(e)=>handleFilterTabel(e.target.value)} class="form-control form-control-sm" id="floatingInput" placeholder=""/>
                                <label for="floatingInput">{colSearch.title}</label>
                            </div>
                        </div>
                    }


                </div>
                <div className="d-flex col-12 table-responsive">
                    <table className="col-12 table table-responsive table-hover border-top">
                        <thead className="">
                            <tr>
                                {heading.map(head_title =>
                                    <th scope="col" style={head_title.styleHead || {}}>
                                        <div className="d-flex justify-content-between">
                                            <span onClick={()=>setColSearch(head_title)} className={head_title.classHead || `${colSearch.field === head_title.field ? "text-danger":""}`}>{head_title.title}</span>
                                            {head_title.field.match(/date/ig) && 
                                                <span onClick={()=>handleSortData(head_title.field)}>
                                                    <i class="bi bi-funnel-fill"></i>
                                                </span>
                                            }

                                        </div>
                                    </th>

                                )}
                                {actions.length > 0 &&
                                    <th scope="col">اجراء</th>
                                }
                                {isRealVisit && 
                                    <th scope="col">تم احتسابها</th>
                                }
                                {isReviewed && 
                                    <th scope="col">تم المراجعة</th>
                                }
                                {sendMail && 
                                    <th scope="col">ارسال إيميل</th>
                                }
                                {sendAlert && 
                                    <th scope="col">ارسال تحذير</th>
                                }
                            </tr>
                        </thead>
                        {myData.length > 0 &&
            
                            <tbody>
                                {spliceData.map((record, index) =>
                                    <tr key={index}>
                                        {heading.map(props_value_row =>
                                            props_value_row.field === "StaffName" &&  checkRole === "2" && changeStaff ? 
                                            
                                                <td  data-bs-toggle="tooltip" key={record.AppointmentNo} data-bs-placement="top" data-bs-title={record[props_value_row.field] || null} style={props_value_row.styleRow || {}} className={props_value_row.classRow || ""}>
                                                    <BtnChangeStaff setAppointmentNo={changeAppointmentNo} staff_name={record[props_value_row.field]} appointment_id={record.AppointmentNo} />
                                                </td>
                                                :
                                                props_value_row.field === "IsStaffType" ?
                                                <td  data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={rolesDesc[record[props_value_row.field]] || null} style={props_value_row.styleRow || {}} className={props_value_row.classRow || ""}>{rolesDesc[record[props_value_row.field]]}</td>
                                                :
                                                <td  data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={record[props_value_row.field] || null} style={props_value_row.styleRow || {}} className={props_value_row.classRow || ""}>{record[props_value_row.field]}</td>

                                            
                                        )}


                                        {actions.length > 0 &&
                                            <td >
                                                {actions.map(Action =>
                                                    // Action

                                                    Action.props.href ?
                                                        <>
                                                            {Action.type({ href: Action.props.href, id: record[Action.props.fieldID], changeLinkDel: setDeleteLink })}
                                                        </>
                                                        :
                                                        <>
                                                            {Action}
                                                        </>


                                                )}
                                            </td>
                                        }
                                        {
                                            isRealVisit &&
                                            <td>
                                                {isRealVisit.type({visit: record})}
                                            </td>
                                        }
                                        {
                                            isReviewed &&
                                            <td>
                                                {isReviewed.type({visit: record})}

                                            </td>
                                        }
                                        {
                                            sendMail &&
                                            <td>
                                                {sendMail.type({contract: record})}
                                            </td>
                                        }
                                        {
                                            sendAlert &&
                                            <td>
                                                {sendAlert.type({contract: record})}

                                            </td>
                                        }
                                        
                                    </tr>
                                )}
                            {/* {handleAllIsDone()} */}
                            </tbody>
                        }
                        
                    </table>
                </div>
                {inputFilter.length === 0 &&
                    <div className="gap-3 d-flex table_choose_staff_next_prev">
                        <button disabled={checkSpliceData.next} onClick={()=>handleChangeCurrPage("next")} className="bi bi-arrow-right-circle fs-3"></button>
                        <button disabled={checkSpliceData.prev} onClick={()=>handleChangeCurrPage("prev")} className="bi bi-arrow-left-circle fs-3"></button>
                    </div>
                }
            </div>
            <ModalDelete link={deleteLink}/>
        </>
    )
}

export default Table;