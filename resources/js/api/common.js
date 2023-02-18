import axios from "axios";

import { API_URL } from "../constants/";

const authHeader = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};

const commonApi = {
    // getAllArticle: () =>
    //     axios.get(`${API_URL}/articles`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // getArticleById: (id) =>
    //     axios.get(`${API_URL}/articles?id=` + id, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // addArticle: (name, contract_amount, is_house, ended, budgets) =>
    //     axios.post(
    //         `${API_URL}/articles`,
    //         {
    //             name,
    //             contract_amount,
    //             is_house,
    //             ended,
    //             budgets,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // editArticle: (article_id, name, contract_amount, is_house, ended) =>
    //     axios.put(
    //         `${API_URL}/articles/${article_id}`,
    //         {
    //             name,
    //             is_house,
    //             ended,
    //             contract_amount,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // addBudget: (
    //     article_id,
    //     construction_id,
    //     cost,
    //     contract_amount,
    //     change_amount
    // ) =>
    //     axios.post(
    //         `${API_URL}/budgets`,
    //         {
    //             article_id,
    //             construction_id,
    //             cost,
    //             contract_amount,
    //             change_amount,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // editBudgets: (
    //     id,
    //     article_id,
    //     construction_id,
    //     cost,
    //     contract_amount,
    //     change_amount
    // ) =>
    //     axios.put(
    //         `${API_URL}/budgets/${id}`,
    //         {
    //             article_id,
    //             construction_id,
    //             cost,
    //             contract_amount,
    //             change_amount,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // deleteBudget: (budget_id) =>
    //     axios.delete(`${API_URL}/budgets/${budget_id}`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    getCompanies: (params) =>
        axios.post(`${API_URL}/companies`, params,  {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            params,
    }),
    // getCompany: () =>
    //     axios.get(`${API_URL}/companies`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // addCompany: (
    //     name,
    //     bank_code,
    //     bank_name,
    //     bank_branch_code,
    //     bank_branch_name,
    //     bank_deposit_type_id,
    //     bank_account_number,
    //     bank_account_holder,
    //     transfer_fee_id
    // ) =>
    //     axios.post(
    //         `${API_URL}/companies`,
    //         {
    //             name,
    //             bank_code,
    //             bank_name,
    //             bank_branch_code,
    //             bank_branch_name,
    //             bank_deposit_type_id,
    //             bank_account_number,
    //             bank_account_holder,
    //             transfer_fee_id,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // editCompany: (
    //     id,
    //     name,
    //     bank_code,
    //     bank_name,
    //     bank_branch_code,
    //     bank_branch_name,
    //     bank_deposit_type_id,
    //     bank_account_number,
    //     bank_account_holder,
    //     transfer_fee_id
    // ) =>
    //     axios.put(
    //         `${API_URL}/companies/${id}`,
    //         {
    //             name,
    //             bank_code,
    //             bank_name,
    //             bank_branch_code,
    //             bank_branch_name,
    //             bank_deposit_type_id,
    //             bank_account_number,
    //             bank_account_holder,
    //             transfer_fee_id,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // getConstruction: (house) =>
    //     axios.get(`${API_URL}/constructions?house=` + house, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // addConstruction: (name, house) =>
    //     axios.post(
    //         `${API_URL}/constructions`,
    //         {
    //             name,
    //             house,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // editConstruction: (id, name, sort) =>
    //     axios.put(
    //         `${API_URL}/constructions/${id}`,
    //         {
    //             name,
    //             sort,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // deleteConstruction: (construction_id) =>
    //     axios.delete(`${API_URL}/constructions/${construction_id}`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // getPayment: (date, article_id = null) =>
    //     axios.get(
    //         `${API_URL}/payments?pay_date=` +
    //             date +
    //             (article_id != null ? `&article_id=${article_id}` : ``),
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // addPayment: (
    //     pay_date,
    //     article_id,
    //     company_id,
    //     construction_id,
    //     cost,
    //     is_cash
    // ) =>
    //     axios.post(
    //         `${API_URL}/payments`,
    //         {
    //             pay_date,
    //             article_id,
    //             company_id,
    //             construction_id,
    //             cost,
    //             is_cash,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // editPayment: (
    //     id,
    //     pay_date,
    //     article_id,
    //     construction_id,
    //     company_id,
    //     cost,
    //     is_cash
    // ) =>
    //     axios.put(
    //         `${API_URL}/payments/${id}`,
    //         {
    //             pay_date,
    //             article_id,
    //             construction_id,
    //             company_id,
    //             cost,
    //             is_cash,
    //         },
    //         {
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     ),

    // deletePayment: (payment_id) =>
    //     axios.delete(`${API_URL}/payments/${payment_id}`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // getAutoConstruction: () =>
    //     axios.get(`${API_URL}/constructions/autocomplete`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // getAutoArticle: () =>
    //     axios.get(`${API_URL}/articles/autocomplete`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //     }),

    // getAutoCompany: () =>
    //     axios.get(`${API_URL}/companies/autocomplete`, {
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    // }),

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
};

export default commonApi;
