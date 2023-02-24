import axios from "axios";

import { API_URL } from "../constants/";

const authHeader = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};

const commonApi = {
    getCompanies: (params) =>
        axios.post(`${API_URL}/companies`, params,  {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params,
    }),

    getUsers: () =>
        axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),

    updateAccountStatus: (id, disabled) =>
        axios.put(
            `${API_URL}/users/${id}`,
            {
                disabled,
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
    changePassword: (old_pwd, new_pwd) =>
        axios.post(
            `${API_URL}/changePwd`,
            {
                old_pwd,
                new_pwd,
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
};

export default commonApi;
