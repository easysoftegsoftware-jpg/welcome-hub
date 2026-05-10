var typesClients = [];

export function defaultDataClientType(custTypes){
    for (const custType of custTypes) {
      if(custType.SType === 1){
        if(custType.Customers){
          typesClients.push(custType);
          defaultDataClientType(custType.Customers)
        }else{
          typesClients.push(custType);
        }
      }

    }  
  
  return typesClients;

}

export function recursion(custTypes) {
  
  let tree = '<ul>';
  for (const custType of custTypes) {
    if(custType.SType === 1 && custType.Customers){
        tree += `
            <details>
                <summary class="right_click" id="CustTypeID-${custType.CustTypeID}">
                ${pepole()}
                 ${custType.CustTypeName} </summary>
            `;
            if (custType.Customers && custType.Customers.length > 0) {
                tree += recursion(custType.Customers);
            }
            tree += '</details>';

    }else{
        tree += `<li ${custType.SType === 1 && `class="right_click" id="CustTypeID-${custType.CustTypeID}"`}> 

        ${custType.SType === 2 ? svgPerson("crimson"):pepole("crimson")}
        ${custType.CustTypeName}`;



        if (custType.Customers && custType.Customers.length > 0) {
          tree += recursion(custType.Customers);
        }
        tree += '</li>';
    }
  }
  tree += '</ul>';
  return tree;
}

var svgFolder = (color) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${color || "currentColor"} class="bi bi-folder" viewBox="0 0 16 16">
            <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
        </svg>

`
var svgFile = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="crimson" class="bi bi-file-earmark" viewBox="0 0 16 16">
            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
        </svg>
`

var svgPerson  = (color)=>`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${color || "currentColor"} class="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
</svg>
`

var pepole = (color)=>`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill=${color || "currentColor"} class="bi bi-people-fill" viewBox="0 0 16 16">
  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
</svg>

`
        // <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
        //     <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        // </svg>
