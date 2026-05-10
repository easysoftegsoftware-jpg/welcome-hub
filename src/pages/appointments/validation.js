export const inputsNeedValidation = [
    {
        name: "CustomerID",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{5,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 5" },
        ]
    },
    {
        name: "CallReason",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{5,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 10" },
        ]
    },
    {
        name: "AHour",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{15,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 14" },
        ]
    },
    {
        name: "StaffId",
        validation: [
            { desc: "required", regx: /\S+/, errMsg: "الحقل مطلوب" },
            // { desc: "length", regx: /^.{15,}$/, errMsg: "عدد الحروف يجب ان يكون اكبر من 14" },
        ]
    },
]


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
