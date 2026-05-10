export const dataAgents = [

    {code: "0", name: "الوكيل api", email: "api@mail.com", address: "October", contacts: [{id: 22, person_name: "احمد طارق", email: "ahmed@mail.com", phone1: "01557559549" , phone2: "01040749899"}]},
    {code: "1", name: "الوكيل الاول", email: "mail1@mail.com", address: "6 October", contacts: [{id: 22, person_name: "احمد طارق", email: "ahmed@mail.com", phone1: "01557559549" , phone2: "01040749899"}]},
    {code: "2", name: "الوكيل الثاني", email: "mail2@mail.com", address: "Maddi", contacts: []},
    {code: "3", name: "الوكيل الثالث", email: "mail3@mail.com", address: "New Cairo", contacts: []},
    {code: "4", name: "الوكيل الرابع", email: "mail4@mail.com", address: "Naser City", contacts: []},
    
]

export const clientsTypes = [
    {id: "1", type: "جلود", parentId: null},
    {id: "2", type: "مقاولات", parentId: "7"},
    {id: "7", type: "تجاري", parentId: null},
    
]

export const dataModules = [
    {code: 1, name: "مبيعات"},
    {code: 2, name: "صيانة"},
    {code: 3, name: "مشتريات"}
]

export const dataClients = [
    {
        code: "1", status: "عميل زيارة" ,
        name: "السمالوطي الطبية", email: "mail@mail.com", 
        typeId: "7", address: "الجيزة" , agentId: "2",
        date: "2014-02-09",expire: 3, value: "1200",
        servicePrice: "2334", fixedPrice: "700", admin_name: "",
        notes: "لا يوجد", modules: ["1", "3", "5"], visits_used: "0", visits_remaining: "20",
        last_visit_date: "2025-09-09", last_contract_date: "2025-06-09",
        contactsBranches: [{name_branch: "6 October", devices: "4"}], contactsPersons: [{name_person: "احمد طارق", phone1: "01557559549", phone2: "01040749899"}]
    },
    {
        code: "2", status: "عميل نشط" ,
        name: "معمار المرشدي", email: "elmorshdy@mail.com", 
        typeId: "7", address: "الجيزة" , agentId: "2",
        date: "2014-02-09",expire: 3, value: "1200",
        servicePrice: "2334", fixedPrice: "700", admin_name: "",
        notes: "لا يوجد", modules: ["1", "3", "5"], visits_used: "20", visits_remaining: "0",
        last_visit_date: "2025-11-09", last_contract_date: "2025-04-12",
        contactsBranches: [], contactsPersons: []
    }
]

export const dataDates = [
    {
        number_date: "44",client_id: "2", call_reason: "سبب زيارة", staff_id: "2", date_record: "2025-07-07", date_visit: "2025-07-10", time_visit: "02:30"
    }
]

export const dataStaff = [
    {code: "2", staff_name: "Mohamed Emad", password: "123", job_title: "مسؤول دعم فني"}
]

export const dataVisits = [
    {
        number_contract: "22776530", date_contract: "2024-12-12", visit_type: "3" ,
        number_date: "44",client_id: "1", client_name:  "محمد حسين", client_email: "elmarwa@mail.com", admin_name: "حازم حسن",
        staff_id: "2",time_open_visit: "18:15" , time_close_visit: "16:45",
        call_reason: "احتاج زيارة لتجديد الترخيص", what_is_done: "تم الانتهاء من الزيارة الاولى", agreed_upon: "احتاج الى 3 زيارات",
    }
]


export const dataContracts = [
    {
        number_contract: "22776530", date_contract: "2020-04-03", client_id: "2", price: "1000", visits_count: "25", contract_content: "text some text"
    }
]



export const visitTypes = {
    "0":"بدون تحديد",
    "1":"عقد صيانة",
    "2":"تحديد موعد",
    "3":"زيارة",
}