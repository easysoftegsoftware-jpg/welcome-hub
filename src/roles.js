// export const roles = [
//     1 // مسؤول الدعم الفني 
//     , 2 // مدير الدعم الفني
//     , 3 // ادارة خدمة العملاء
//     , 4 // المدير العام
// ]

export const roles = [
    {roleID: "1", path_allow: ["/tech_appointment", "/visits", "/modifications"], view_all: false},
    {roleID: "2", path_allow: ["/tech_appointment", "/visits", "/appointments", "/modifications"], view_all: false},
    {roleID: "3", path_allow: [], view_all: true},
    {roleID: "4", path_allow: [], view_all: true},
]

export const rolesDesc = {
    "1": "مهندس دعم فني",
    "2": "مدير دعم فني",
    "3":"مسؤول خدمة عملاء",
    "4":"المدير العام"
}


