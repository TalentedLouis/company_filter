import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom'
import { renderToString } from "react-dom/server";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { Table } from 'smart-webcomponents-react/table';
import { CheckBox } from 'smart-webcomponents-react/checkbox';
import { Smart, Form, FormGroup, FormControl } from 'smart-webcomponents-react/form';
import { DropDownList, ListItem } from 'smart-webcomponents-react/dropdownlist';
import { NumberInput } from 'smart-webcomponents-react/numberinput';
import { Input } from 'smart-webcomponents-react/input';
import { RadioButton } from 'smart-webcomponents-react/radiobutton';
import { Button } from  'smart-webcomponents-react/button';
import { DateInput } from 'smart-webcomponents-react/dateinput';
import Select from 'react-select';

import SimpleReactValidator from 'simple-react-validator';

import { FaYenSign } from "react-icons/fa"
import { IoMdRemoveCircle, IoMdAddCircle } from "react-icons/io"

import CreatePayment from '../../components/CreatePayment'
import UpdatePayment from '../../components/UpdatePayment'
import UpdateHistory from "../../components/UpdateHistory";
import FilterSelect from "../../components/FilterSelect";
import UpdateArticle from "../../components/UpdateArticle";

import {useWindowDimensions} from '../../utils/Helper'

import './Payment.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

let editable_data = {}
let editArticleId = 0

const fake_data = [
  {
    id: 1,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'srehserh',
    construction_id: 1,
    construction_name: 'drtjdrthd',
    is_house: 1,
    company_id: 1,
    company_name: 'drtjd',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 100,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 2,
    pay_date: '2023-2',
    article_id: 1,
    article_name: 'dtjtyj',
    construction_id: 0,
    construction_name: 'ftyj',
    is_house: 1,
    company_id: 1,
    company_name: 'drtjd',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 500,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 3,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'ftyjfty',
    construction_id: 3,
    construction_name: 'tyj',
    is_house: 1,
    company_id: 2,
    company_name: 'drtjd',
    budget_cost: 10000,
    contract_amount: 10000,
    change_amount: 0,
    cost: 5000,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 4,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'rdth',
    construction_id: 6,
    construction_name: 'sregh',
    is_house: 1,
    company_id: 1,
    company_name: 'drth',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 100,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 5,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'srehserh',
    construction_id: 5,
    construction_name: 'hrthdr',
    is_house: 0,
    company_id: 2,
    company_name: 'drtjd',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 100,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 6,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'erg',
    construction_id: 1,
    construction_name: 'serg',
    is_house: 1,
    company_id: 1,
    company_name: 'drtjd',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 100,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 7,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'srehserh',
    construction_id: 1,
    construction_name: 'drtjdrthd',
    is_house: 1,
    company_id: 1,
    company_name: 'drtjd',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 5000,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
  {
    id: 8,
    pay_date: '2023-1',
    article_id: 1,
    article_name: 'drt',
    construction_id: 1,
    construction_name: 'drt',
    is_house: 1,
    company_id: 1,
    company_name: 'drtjd',
    budget_cost: 5000,
    contract_amount: 5000,
    change_amount: 0,
    cost: 400,
    is_cash: 1,
    created_user_id: 1,
    created_user_name: 'drthdth',
    created_at: '2022-11-12',
    updated_user_id: 1,
    updated_user_name: 'serg',
    updated_at: '2022-11-12'
  },
]

const dateFormatting = (date) => {
  var m = new Date(date);
  var dateString = m.getFullYear() +"-"+ (m.getMonth()+1) +"-"+ m.getDate()
  return dateString
}

const monthDateFormatting = (date) => {
  var m = new Date(date);
  var dateString = m.getFullYear() +"-"+ (m.getMonth()+1)
  return dateString
}

const Payment = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [page, setPage] = useState('list')

  const [payments, setPayments] = useState([])
  const [editPayment, setEditPayment] = useState({})
  const [filterData, setFilterData] = useState({date: dateFormatting(new Date()), article: {}})
  const [articleOptions, setArticleOptions] = useState([])


  const paymentColumns = [
    {
      label: 'Id',
      dataField: 'id',
      dataType: 'number',
      width: 50
    }, {
      label: 'Date',
      dataField: 'pay_date',
      dataType: 'string'
    }, {
      label: 'Article',
      dataField: 'article_name',
      dataType: 'string',
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_article_btn" data-id={settings.data.article_id}>{settings.value}</a>);
      }
    }, {
      label: 'Construction',
      dataField: 'construction_name',
      dataType: 'string'
    }, {
      label: 'house/building',
      dataField: 'is_house',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = settings.data.is_house == 0 ? 'Building' : 'House'
      }
    }, {
      label: 'trader name',
      dataField: 'company_name',
      dataType: 'string',
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_company_btn" data-id={settings.data.company_id}>{settings.value}</a>);
      }
    }, {
      label: 'budget',
      dataField: 'budget_cost',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = settings.value.toLocaleString("en-US")
      }
    }, {
      label: 'Contract amount',
      dataField: 'contract_amount',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = settings.value.toLocaleString("en-US")
      }
    }, {
      label: 'Change amount',
      dataField: 'change_amount',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = settings.value.toLocaleString("en-US")
      }
    }, {
      label: 'Amount of money',
      dataField: 'cost',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = settings.value.toLocaleString("en-US")
      }
    }, {
      label: 'Detail',
      dataField: '',
      allowSort: false,
      allowMenu: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_payment_edit_btn" data-id={settings.data.id}>Detail</a>);
      }
    }, {
      label: 'Delete',
      dataField: '',
      allowSort: false,
      allowMenu: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_payment_delete_btn" data-id={settings.data.id}><IoMdRemoveCircle /></a>);
      }
    }
  ];
  
  const paymentData = new Smart.DataAdapter({
		dataSource: payments,
		dataFields: [
			'id: number',
			'pay_date: string',
			'article_id: number',
      'article_name: string',
			'construction_id: number',
      'construction_name: string',
      'is_house: number',
      'company_id: number',
      'company_name: string',
      'budget_cost: number',
      'contract_amount: number',
      'change_amount: number',
      'cost: number',
      'is_cash: number',
      'created_user_id: number',
      'created_user_name: string',
      'created_at: string',
      'updated_user_id: number',
      'updated_user_name: string',
      'updated_at: string',
		]
	});

  useEffect(() => {
    getArticleOptions()
    getPaymentData()
  }, [])

  const getPaymentData = async() => {
    dispatch(startAction())
    try {
      const resPayment = await agent.common.getPayment(filterData.date, filterData.article.value||null)
      if (resPayment.data.success) {
        setPayments([...resPayment.data.data])
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction())
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/')
        }
      }
    }
  }

  const getArticleOptions = async() => {
    dispatch(startAction())
    try {
      const resAutoArticle = await agent.common.getAutoArticle()

      if(resAutoArticle.data.success) {
        let ArticleOptions = []
        resAutoArticle.data.data.map((item) => {
          ArticleOptions.push({
            value: item.id,
            label: item.name
          })
        })
        setArticleOptions([...ArticleOptions])
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction())
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/')
        }
      }
    }
  }

  const handlePaymentTableClick = (event) => {
    const edit_btn = event.target.closest('.table_payment_edit_btn')
    const delete_btn = event.target.closest('.table_payment_delete_btn')
    const article_btn = event.target.closest('.table_article_btn')
    const company_btn = event.target.closest('.table_company_btn')

    if(edit_btn) {
      goPaymentEdit(edit_btn.getAttribute('data-id'))
    } else if(delete_btn) {
      deletePayment(delete_btn.getAttribute('data-id'))
    } else if(article_btn) {
      goArticleEdit(article_btn.getAttribute('data-id'))
    } else if(company_btn) {
      goCompanyEdit(company_btn.getAttribute('data-id'))
    }
	}

  const goPaymentEdit = (payment_id) => {
    setEditPayment({...payments[payment_id]})
    setPage('edit')
  }

  const goArticleEdit = (article_id) => {
    setPage('editArticle')
    editArticleId = article_id
  }

  const goCompanyEdit = (company_id) => {

  }

  const deletePayment = async(payment_id) => {
    dispatch(startAction())
    const res = await agent.common.deletePayment(payment_id)
    if (res.data.success) {
      const r_payments = payments.filter((el) => {
        return el.id != payment_id;
      });
      setPayments([...r_payments])
      // getPaymentData()
      dispatch(showToast('success', res.data.message))
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  const clickSearchBtn = () => {
    getPaymentData()
  }

  const clickPaymentCancelBtn = () => {
    // getPaymentData()
    setPage('list')
  }

  const clickEditArticleSaveBtn = () => {
    // getPaymentData()
    setPage('list')
  }

  const clickEditArticleCancelBtn = () => {
    // getPaymentData()
    setPage('list')
  }

  

  return (
    <>
      <div className="page-header">
        <div className="page-block">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="page-header-title">
                {
                  page == 'list' &&
                    <h5 className="m-b-10">List of Properties</h5>
                }
                {
                  page == 'edit' &&
                    <h5 className="m-b-10">property change</h5>
                }
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/"><i className="feather icon-home"></i></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#!">Object Management</a>
                </li>
                {
                  page == 'list' &&
                    <li className="breadcrumb-item">
                      <a href="/article">List of Properties</a>
                    </li>
                }
                {
                  page == 'edit' &&
                    <li className="breadcrumb-item">
                      <a href="/article">property change</a>
                    </li>
                }
                
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              {
                page == 'list' && 
                  <>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Search</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Date</label>
                                </div>
                                <div className="col-md-6">
                                  <DateInput className="custom_date_input" placeholder="" formatString="yyyy-MM-dd" value={filterData.date} onChange={(e) => setFilterData({...filterData, date: dateFormatting(e.detail.value)})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Property</label>
                                </div>
                                <div className="col-md-6">
                                  <FilterSelect 
                                    id="search_article_input"
                                    options={articleOptions} 
                                    value={filterData.article}
                                    onChange={(val) => {
                                      setFilterData({...filterData, article_id: val.value})
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="action_btn_group">
                              <button type="button" className="btn btn-primary" onClick={() => clickSearchBtn()}>Search</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">list</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <Table
                              dataSource={paymentData} 
                              paging
                              filtering
                              columns={paymentColumns} 
                              columnMenu
                              sortMode='many'
                              onClick={(e) => handlePaymentTableClick(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
              {
                (page == 'edit') &&
                  <UpdatePayment payment={editPayment} setPage={setPage} clickCancelBtn={clickPaymentCancelBtn}/>
              }
              {
                (page == "editArticle") &&
                  <UpdateArticle article_id={editArticleId} clickSaveBtn={clickEditArticleSaveBtn} clickCancelBtn={clickEditArticleCancelBtn}/>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Payment