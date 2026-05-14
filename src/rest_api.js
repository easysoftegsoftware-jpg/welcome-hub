import axios from "axios";



export const makeRequestApi =  (url, method, body)=>{
    const myHeaders = new Headers();
    const getToken = window.localStorage.getItem("token_auth");

    url = url.replace("http://localhost:1150/","https://medicalapi.easysofteg.com:56668/")
    if(getToken){
        myHeaders.append("Authorization",`Bearer ${getToken}`);
    }
    return axios({url, method, headers: myHeaders, data: body});
}