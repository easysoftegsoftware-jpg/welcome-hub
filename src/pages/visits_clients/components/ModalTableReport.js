import { useEffect, useState } from "react";

const ModelTableReport = ({report})=>{
    const [currPage, setCurrPage] = useState(1);
    const count = 10;
    const [spliceData, setSpliceData] = useState(([...report].splice(count * currPage - count, count)));
    
    const checkSpliceData = {
        next: [...report].splice(count * (currPage + 1) - count, count).length > 0 ? false : true,
        prev: currPage > 1 ? false : true
    }

    let [colSearch, setColSearch] = useState({ title: "", field: ""});
    let [inputFilter, setInputFilter] = useState("")

    const handleFilterTabel = (value)=>{
        setInputFilter(value);
        var regex = new RegExp(value, "gi");

        
        if(value === ""){
            setSpliceData([...report].splice(count * currPage - count, count))
        }else{
            let doFilter = report.filter(record =>  record[colSearch.field].toString().match(regex) !== null );
            setSpliceData(doFilter)
        }
        
    }

    const handleChangeSlice = (type) => {
        let action = type === "next" ? currPage + 1 : currPage - 1;
        let doSpliceData = [...report].splice(count * action - count, count);
        setCurrPage(action);
        setSpliceData(doSpliceData)
    }

    
    useEffect(()=>{
        // if(link.length > 0){
        //     makeRequestApi(link, "GET")
        //     .then(res => {
        //         res.data = res.data.map(visits => {
        //             return {...visits, VisitDate: visits.VisitDate.split("T")[0]}
        //         })
                
        //         setLoading(false);
        //         setreport(res.data);
        //         setSpliceData([...res.data].splice(count * currPage - count, count))
        //     })
        //     .catch(err => window.alert("حدث خطاء في جلب بيانات التقرير"))        
        // }
                // setreport(report);


    },[report])
    return(
        <>
            <div className=" d-flex flex-wrap col-12 justify-content-between align-items-center p-3  border-top mt-3">
                <div className="d-flex align-items-center">
                    <h3>تقارير الزيارات</h3>
                </div>


                {colSearch.field.length > 0 &&
                    <div class="d-none d-sm-block col-4 d-flex">
                        <div class="form-floating col-12">
                            <input type="text" onChange={(e)=>handleFilterTabel(e.target.value)} class="form-control form-control-sm h-0" id="floatingInput" placeholder=""/>
                            <label for="floatingInput">{colSearch.title}</label>
                        </div>
                    </div>
                }


                <div className="gap-3 d-flex table_choose_staff_next_prev" style={inputFilter.length === 0 ? {visibility: "visible"}:{visibility: "hidden"}}>
                    <button disabled={checkSpliceData.next} onClick={()=>handleChangeSlice("next")} className="bi bi-arrow-right-circle fs-3"></button>
                    <button disabled={checkSpliceData.prev} onClick={()=>handleChangeSlice("prev")} className="bi bi-arrow-left-circle fs-3"></button>
                </div>


            </div>
            <table class="table table-striped table-hover table_choose_staff">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th onClick={()=>setColSearch({ title: "تاريخ", field: "VisitDate"})} className={`${colSearch.field === "VisitDate" ? "text-danger":""}`}>التاريخ</th>
                        <th onClick={()=>setColSearch({ title: "إسم العميل", field: "CustomerName"})} className={`${colSearch.field === "CustomerName" ? "text-danger":""}`}>اسم العميل</th>
                        <th onClick={()=>setColSearch({title: "سبب الاتصال", field:"CallReason"})} className={`${colSearch.field === "CallReason" ? "text-danger":""}`}>سبب الاتصال</th>
                        <th onClick={()=>setColSearch({title: "مهندس الدعم", field:"StaffName"})} className={`${colSearch.field === "StaffName" ? "text-danger":""}`}>مهندس الدعم</th>
                    </tr>
                </thead>
                <tbody>
                    {spliceData.map(staff =>
                        <tr>
                            <th scope="col">{staff.VisitNo}</th >
                            <th>{staff.VisitDate}</th >
                            <td>{staff.CustomerName}</td>
                            <td>{staff.CallReason}</td>
                            <td>{staff.StaffName}</td>
                        </tr>
                        
                    )}
                </tbody>
            </table>
        </>

    )
}

export default ModelTableReport;