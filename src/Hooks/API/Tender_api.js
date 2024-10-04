// import React from 'react'
import axios from "axios";
// import { ADDRESSES } from "../../Routes/Addresses";
import { loginStorage } from "../../storage/appStorage";

function Tender_api() {
    const handleGetGst = async () => {
        // const loginData = JSON.parse(loginStorage.getString("login-data"));
        return new Promise((resolve, reject) => {
            axios.post(ADDRESSES.GST_LIST,
                {},
                {
                    headers: {
                        Authorization: loginData.token,
                    },
                },).then(res => {
                    resolve(res.data.data.msg);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    return { handleGetGst };
}

export default Tender_api


