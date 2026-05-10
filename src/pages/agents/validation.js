export const inputsNeedValidation = [
    {
        name: "AgentName",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{5,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 5" },
        ]
    },
    {
        name: "ContactName",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{5,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 5" },
        ]

    },
    {
        name: "Phone1",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{5,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 5" },
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
