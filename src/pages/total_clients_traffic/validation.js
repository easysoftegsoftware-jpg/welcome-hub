export const inputsNeedValidation = [
    {
        name: "FromDate",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
        ]
    },
    {
        name: "ToDate",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
        ]
    },
    {
        name: "CustomerID",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
        ]
    },
    
]



export const handleCheckValueIsExisting = (values = [], fieldNameInValues, valueInput)=>{
    let checkStatus = values.filter(val => val[fieldNameInValues] === valueInput);
    if(checkStatus.length){
        return {name: fieldNameInValues, errMsg: "هذا الاسم موجود مسبقا"}
    }
    
    return false
    
}
export const handleInputsNeedValidation = (inputsValue, validRoles = inputsNeedValidation, Quick) => {
    let checkStatus = []
    validRoles.forEach(element => {

        for (let i = 0; i < element.validation.length; i++) {
            const valid = element.validation[i];

            if(typeof inputsValue[element.name] === "string"){

                let checkInputValue = inputsValue[element.name].match(valid.regx);
                if (checkInputValue === null) {
                    checkStatus.push({ name: element.name, errMsg: valid.errMsg })
                    break;
                }
            }
        }
    });
    return checkStatus

}
