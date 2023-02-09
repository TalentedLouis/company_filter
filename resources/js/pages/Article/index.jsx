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
import Select from 'react-select';

import SimpleReactValidator from 'simple-react-validator';

import { FaYenSign } from "react-icons/fa"
import { IoMdRemoveCircle, IoMdAddCircle } from "react-icons/io"

import CreatePayment from '../../components/CreatePayment'
import UpdateHistory from "../../components/UpdateHistory";
import FilterSelect from "../../components/FilterSelect";

import {useWindowDimensions} from '../../utils/Helper'

import './Article.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

let editable_data = {}

const Article = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const budgetEditTable = useRef()
  const budgetAddTable = useRef()

  const { width } = useWindowDimensions()

  const [page, setPage] = useState('list')
  const [articles, setArticles] = useState([])
  const [constructions, setConstructions] = useState([])
  const [editArticle, setEditArticle] = useState({})
  const [addArticle, setAddArticle] = useState({name: '', contract_amount: 0, is_house: 1, ended: 0})
  const [paymentArticle, setPaymentArticle] = useState({})
  const [budgets, setBudgets] = useState([])
  const [addBudget, setAddBudget] = useState({})
  const [budgetRowCount, setBudgetRowCount] = useState(0)

  const [loadBudgetTable, setLoadBudgetTable] = useState(false)

  const articleColumns = [
    {
      label: 'Id',
      dataField: 'id',
      dataType: 'number',
      width: 100
    }, {
      label: 'Object Name',
      dataField: 'name',
      dataType: 'string'
    }, {
      label: 'Is house',
      dataField: 'is_house',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = settings.data.is_house == 0 ? 'Building' : 'House'
      }
    }, {
      label: 'Detail',
      dataField: '',
      width: 100,
      allowSort: false,
      allowMenu: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_article_edit_btn" data-id={settings.data.id}>Detail</a>);
      }
    }, {
      label: 'Money',
      dataField: '',
      width: 100,
      allowSort: false,
      allowMenu: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_article_payment_btn" data-id={settings.data.id}>Input</a>);
      }
    }
  ];
  
  const articleData = new Smart.DataAdapter({
		dataSource: articles,
		dataFields: [
			'id: number',
			'name: string',
			'is_house: number',
      'ended: number',
			'contract_amount: number',
      'budget: array',
      'created_user_id: number',
      'created_user_name: string',
      'created_at: string',
      'updated_user_id: number',
      'updated_user_name: string',
      'updated_at: string',
		]
	});

  const budgetColumns = [
    {
      label: 'Construction',
      dataField: 'construction_name',
      dataType: 'string',
      editor: {
			  template: renderToString(<div id="edit_budget_construction_container"></div>),
        onInit(row, column, editor, value) {
          editable_data = {value: budgets[row].construction_id, label: budgets[row].construction_name}
          ReactDOM.render(
            <FilterSelect 
              id="edit_construction_input"
              options={constructions} 
              // value={editable_data}
              defaultValue={editable_data}
              onChange={(val) => {
                // let r_budgets = [...budgets]
                // r_budgets[row].construction_id = val.value
                // r_budgets[row].construction_name = val.label
                editable_data = {value: val.value, label:val.label}
                console.log('auto construction on change function=', editable_data)
                // setBudgets([...r_budgets])
              }}
            />, editor
          )
        },
        onRender(row, column, editor, value) {
          console.log('onRender data=', row)
        }
      }
    }, {
      label: 'Budget',
      dataField: 'cost',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = renderToString(<div data-field="cost" data-id={settings.data.id}>{settings.value.toLocaleString("en-US")}</div>)
      }
    }, {
      label: 'Contract Amount',
      dataField: 'contract_amount',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = renderToString(<div data-field="contract_amount" data-id={settings.data.id}>{settings.value.toLocaleString("en-US")}</div>)
      }
    }, {
      label: 'Change Amount',
      dataField: 'change_amount',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = renderToString(<div data-field="change_amount" data-id={settings.data.id}>{settings.value.toLocaleString("en-US")}</div>)
      }
    }, {
      label: 'Delete',
      dataField: '',
      width: 100,
      allowSort: false,
      allowEdit: false,
      allowMenu: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_budget_delete_btn" data-id={settings.data.id}><IoMdRemoveCircle /></a>);
      }
    }
  ];

  const budgetData = new Smart.DataAdapter({
		dataSource: budgets,
		dataFields: [
      'id: number',
      'construction_id: number',
			'construction_name: string',
			'cost: number',
			'contract_amount: number',
      'change_amount: number'
		]
	});

  useEffect(() => {
    getArticleData()
    getConstructionOptions()
  }, [])

  useEffect(() => {
    if(loadBudgetTable) {
      const construction_add_input_width = document.querySelector(`#construction_add_input`).offsetWidth
      const cost_add_input_width = document.querySelector(`#cost_add_input`).offsetWidth
      const contract_add_input_width = document.querySelector(`#contract_add_input`).offsetWidth
      const change_add_input_width = document.querySelector(`#change_add_input`).offsetWidth
      const budget_add_btn_width = document.querySelector(`#budget_add_btn`).offsetWidth
      document.querySelector(`#add_construction_input`).style = 'width: ' + (construction_add_input_width - 24) +'px'
      document.querySelector(`#add_cost_input`).style = 'width: ' + (cost_add_input_width - 24) + 'px;' + 'left: ' + construction_add_input_width + 'px'
      document.querySelector(`#add_contract_input`).style = 'width: ' + (contract_add_input_width - 24) + 'px;' + 'left: ' + (construction_add_input_width + cost_add_input_width) + 'px'
      document.querySelector(`#add_change_input`).style = 'width: ' + (change_add_input_width - 24) + 'px;' + 'left: ' + (construction_add_input_width + cost_add_input_width + contract_add_input_width) + 'px'
      document.querySelector(`#add_submit_btn`).style = 'width: ' + (budget_add_btn_width - 24) + 'px;' + 'left: ' + (construction_add_input_width + cost_add_input_width + contract_add_input_width + change_add_input_width) + 'px'
    }
  }, [width, loadBudgetTable])

  useEffect(() => {
    if(page == 'add') {
      budgetAddTableInit()
    } else if(page == 'edit') {
      budgetEditTableInit()
    }
  }, [budgets])

  const budgetAddTableInit = () => {
    const footerTemplate = document.createElement('template'),
			headerTemplate = document.createElement('template');
    footerTemplate.id = 'budgetFooter';
		headerTemplate.id = 'budgetHeader';
    footerTemplate.innerHTML = renderToString(
			<tr>
				<td>Total</td>
				<td id="totalBudget"></td>
        <td id="totalContract"></td>
        <td id="totalChange"></td>
        <td></td>
			</tr>
    )

		headerTemplate.innerHTML = renderToString(
      <tr>
				<th id="construction_add_input"></th>
				<th id="cost_add_input"></th>
				<th id="contract_add_input"></th>
				<th id="change_add_input"></th>
				<th id="budget_add_btn"></th>
			</tr>
    )

    document.body.appendChild(footerTemplate);
		document.body.appendChild(headerTemplate);

		budgetAddTable.current.footerRow = footerTemplate.id;
		budgetAddTable.current.headerRow = headerTemplate.id;

    let total_cost = 0
    let total_contract_amount = 0
    let total_change_amount = 0
    budgets.map((budget) => {
      total_cost += budget.cost
      total_contract_amount += budget.contract_amount
      total_change_amount += budget.change_amount
    })

    document.querySelector(`#totalBudget`).innerHTML = total_cost.toLocaleString("en-US")
    document.querySelector(`#totalContract`).innerHTML = total_contract_amount.toLocaleString("en-US")
    document.querySelector(`#totalChange`).innerHTML = total_change_amount.toLocaleString("en-US")
    setLoadBudgetTable(true)
  }

  const budgetEditTableInit = () => {
    const footerTemplate = document.createElement('template'),
			headerTemplate = document.createElement('template');
    footerTemplate.id = 'budgetFooter';
		headerTemplate.id = 'budgetHeader';
    footerTemplate.innerHTML = renderToString(
			<tr>
				<td>Total</td>
				<td id="totalBudget"></td>
        <td id="totalContract"></td>
        <td id="totalChange"></td>
        <td></td>
			</tr>
    )

		headerTemplate.innerHTML = renderToString(
      <tr>
				<th id="construction_add_input"></th>
				<th id="cost_add_input"></th>
				<th id="contract_add_input"></th>
				<th id="change_add_input"></th>
				<th id="budget_add_btn"></th>
			</tr>
    )

    document.body.appendChild(footerTemplate);
		document.body.appendChild(headerTemplate);

		budgetEditTable.current.footerRow = footerTemplate.id;
		budgetEditTable.current.headerRow = headerTemplate.id;

    let total_cost = 0
    let total_contract_amount = 0
    let total_change_amount = 0
    budgets.map((budget) => {
      total_cost += budget.cost
      total_contract_amount += budget.contract_amount
      total_change_amount += budget.change_amount
    })

    document.querySelector(`#totalBudget`).innerHTML = total_cost.toLocaleString("en-US")
    document.querySelector(`#totalContract`).innerHTML = total_contract_amount.toLocaleString("en-US")
    document.querySelector(`#totalChange`).innerHTML = total_change_amount.toLocaleString("en-US")

    setLoadBudgetTable(true)
    // setFirstLoadTable(false)
  }

  const handleArticleTableClick = (event) => {
    const edit_btn = event.target.closest('.table_article_edit_btn')
    const input_btn = event.target.closest('.table_article_payment_btn')

    if(edit_btn) {
      goArticleEdit(edit_btn.getAttribute('data-id'))
    } else if(input_btn) {
      goArticlePayment(input_btn.getAttribute('data-id'))
    }
	}

  const handleBudgetTableClick = (event) => {
    const delete_btn = event.target.closest('.table_budget_delete_btn')
    if(delete_btn) {
      deleteBudget(delete_btn.getAttribute('data-id'))
    }
  }

  const handleBudgetTableKeyPressed = (event) => {
    if(event.key == 'Enter') {
      console.log('etner pressed.')
    }
  }

  const handleBudgetEdited = async(event) => {
    const changed_data = event.detail.row
    console.log('handleBudgetEdited data=', changed_data)
    if(page == 'add') {
      let r_budgets = [...budgets]
      var index = r_budgets.map(function(e) { return e.id; }).indexOf(changed_data.id);
      r_budgets[index] = {
        id: changed_data.id,
        construction_id: editable_data.value,
        construction_name: editable_data.label,
        cost: changed_data.cost, 
        contract_amount: changed_data.contract_amount, 
        change_amount: changed_data.change_amount
      }
      setBudgets([...r_budgets])
    } else if(page == 'edit') {
      dispatch(startAction())
      const res = await agent.common.editBudgets(changed_data.id, editArticle.id, editable_data.value, changed_data.cost, changed_data.contract_amount, changed_data.change_amount)
      if (res.data.success) {
        dispatch(showToast('success', res.data.message))
        setBudgets([...res.data.data])
      }
      else dispatch(showToast('error', res.data.message))
      dispatch(endAction())
    }
  }

  const getArticleData = async() => {
    dispatch(startAction())
    try {
      const resArticle = await agent.common.getAllArticle()
      if (resArticle.data.success) {
        setArticles([...resArticle.data.data])
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

  const getConstructionOptions = async() => {
    dispatch(startAction())
    try {
      const resAutoConstruction = await agent.common.getAutoConstruction()

      if(resAutoConstruction.data.success) {
        let constructionOptions = []
        resAutoConstruction.data.data.map((item) => {
          constructionOptions.push({
            value: item.id,
            label: item.name
          })
        })
        setConstructions([...constructionOptions])
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

  const clickSaveBtn = async() => {
    dispatch(startAction())
		const res = await agent.common.editArticle(editArticle.id, editArticle.name, editArticle.contract_amount, editArticle.is_house, editArticle.ended)
		if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      getArticleData()
      setPage('list')
      setLoadBudgetTable(false)
    }
		else dispatch(showToast('error', res.data.message))
		dispatch(endAction())
  }

  const clickAddArticleBtn = async() => {
    dispatch(startAction())
    let param_budgets = []
    budgets.map((budget) => {
      param_budgets.push({construction_id: budget.construction_id, cost: budget.cost, contract_amount: budget.contract_amount, change_amount: budget.change_amount})
    })
    const res = await agent.common.addArticle(addArticle.name, addArticle.contract_amount, addArticle.is_house, addArticle.ended, param_budgets)
    if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      getArticleData()
      setPage('list')
      setLoadBudgetTable(false)
      setBudgetRowCount(0)
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
    console.log('click add submit btn=', addArticle)
    console.log('budgets=', budgets)
  }

  const clickAddBudgetBtn = async() => {
    if(page == 'add') {
      console.log('add budget data=', addBudget)
      setBudgets([...budgets, {id: budgetRowCount, construction_id: addBudget.construction.value, construction_name: addBudget.construction.label, cost: addBudget.cost, contract_amount: addBudget.contract_amount, change_amount: addBudget.change_amount}])
      setAddBudget({construction: {...constructions[0]}, cost: 0, contract_amount: 0, change_amount: 0})
      setBudgetRowCount(budgetRowCount + 1)
    } else if(page == 'edit') {
      dispatch(startAction())
      const res = await agent.common.addBudget(Number(addBudget.article_id), Number(addBudget.construction.value), Number(addBudget.cost), Number(addBudget.contract_amount), Number(addBudget.change_amount))
      if (res.data.success) {
        setBudgets([...budgets, {id: res.data.data.id, construction_id: res.data.data.construction_id, construction_name: addBudget.construction.label, cost: res.data.data.cost, contract_amount: res.data.data.contract_amount, change_amount: res.data.data.change_amount}])
        setAddBudget({...addBudget, construction: {...constructions[0]}, cost: 0, contract_amount: 0, change_amount: 0})
        getArticleData()
        dispatch(showToast('success', res.data.message))
      }
      else dispatch(showToast('error', res.data.message))
      dispatch(endAction())
    }
  }

  const deleteBudget = async(budget_id) => {
    if(page == 'add') {
      const r_budgets = budgets.filter((el) => {
        return el.id != budget_id;
      });
      setBudgets([...r_budgets])
    } else if(page == 'edit') {
      dispatch(startAction())
      const res = await agent.common.deleteBudget(budget_id)
      if (res.data.success) {
        const r_budgets = budgets.filter((el) => {
          return el.id != budget_id;
        });
        setBudgets([...r_budgets])
        setAddBudget({...addBudget, construction: {...constructions[0]}, cost: 0, contract_amount: 0, change_amount: 0})
        getArticleData()
        dispatch(showToast('success', res.data.message))
      }
      else dispatch(showToast('error', res.data.message))
      dispatch(endAction())
    }
  }

  const clickSearchBtn = () => {
    console.log()
  }

  const goArticleEdit = (article_id) => {
    const result = articles.find(article => {
      return article.id == article_id;
    });
    if (result !== undefined) {
      setEditArticle({...result})
      setBudgets([...result.budget])
      setAddBudget({...addBudget, article_id: Number(article_id), construction: {...constructions[0]}, cost: 0, contract_amount: 0, change_amount: 0})
      setPage('edit')
    }
  }

  const goArticleAdd = () => {
    setAddArticle({name: '', contract_amount: 0, is_house: 1, ended: 0})
    setBudgets([])
    setAddBudget({construction: {...constructions[0]}, cost: 0, contract_amount: 0, change_amount: 0})
    setPage('add')
    setBudgetRowCount(0)
  }

  const goArticlePayment = (article_id) => {
    const result = articles.find(article => {
      return article.id == article_id;
    });
    setPaymentArticle({...result})
    setPage('payment')
  }

  const clickCancelBtn = () => {
    setLoadBudgetTable(false)
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
                {
                  page == 'add' &&
                    <h5 className="m-b-10">Property registration</h5>
                }
                {
                  page == 'payment' &&
                    <h5 className="m-b-10">Enter amount</h5>
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
                {
                  page == 'add' &&
                    <li className="breadcrumb-item">
                      <a href="/article">Property registration</a>
                    </li>
                }
                {
                  page == 'payment' &&
                    <li className="breadcrumb-item">
                      <a href="/article">Enter amount</a>
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
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">list</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="form-label">Property ID</label>
                            <input className="form-control" type="text" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">object name</label>
                            <input className="form-control" type="text" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Property type</label>
                            <div className="form-check">
                              <input type="checkbox" className="form-check-input" />
                              <label title="" type="checkbox" className="form-check-label">housing</label>
                            </div>
                            <div className="form-check">
                              <input type="checkbox" className="form-check-input" />
                              <label title="" type="checkbox" className="form-check-label">building</label>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="formBasicEmail" className="form-label">express</label>
                            <div className="form-check">
                              <input type="checkbox" className="form-check-input" />
                              <label title="" type="checkbox" className="form-check-label">Show hidden properties</label>
                            </div>
                          </div>
                          <hr />
                          <button type="button" className="btn btn-primary" onClick={() => clickSearchBtn()}>Search</button>
                        </div>
                        <div className="col-md-9">
                          <div className="table_container">
                            <Table 
                              dataSource={articleData} 
                              // keyboardNavigation
                              paging
                              filtering
                              // tooltip={tooltip}
                              columns={articleColumns} 
                              columnMenu
                              // editing
                              sortMode='many'
                              onClick={(e) => handleArticleTableClick(e)}
                            />
                            <button type="button" className="btn btn-primary table_btn" onClick={() => goArticleAdd()}>Create</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              {
                (page == 'edit') &&
                  <>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">basic information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <UpdateHistory 
                              id={editArticle.id} 
                              created_user_name={editArticle.created_user_name} 
                              created_at={editArticle.created_at} 
                              updated_user_name={editArticle.updated_user_name} 
                              updated_at={editArticle.updated_at} 
                            />
                            <hr />
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">object name</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={editArticle.name} onChange={(e) => setEditArticle({...editArticle, name: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Contract</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text"><FaYenSign /></span>
                                    </div>
                                    <input className="form-control" type="text" defaultValue={editArticle.contract_amount} onChange={(e) => setEditArticle({...editArticle, contract_amount: e.target.value})}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Type</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio21" className="custom-control-input" defaultChecked = {editArticle.is_house == 1 ? true : false} onChange={(e) => setEditArticle({...editArticle, is_house: 1})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio21" className="custom-control-label">housing</label>
                                  </div>
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio22" className="custom-control-input"  defaultChecked = {editArticle.is_house == 0 ? true : false} onChange={(e) => setEditArticle({...editArticle, is_house: 0})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio22" className="custom-control-label">building</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Non-representation</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" defaultChecked={editArticle.ended == 0 ? false : true} onChange={(e) => setEditArticle({...editArticle, ended: e.target.checked ? 1 : 0})}/>
                                    <label title="" type="checkbox" className="form-check-label">Show hidden properties</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="action_btn_group">
                              <button type="button" className="btn btn-secondary" onClick={() => clickCancelBtn()}>Cancel</button>
                              <button type="button" className="btn btn-primary" onClick={() => clickSaveBtn()}>Save</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">budget data</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="input_table_container">
                              <FilterSelect 
                                id="add_construction_input"
                                options={constructions} 
                                value={addBudget.construction}
                                onChange={(val) => {
                                  setAddBudget({...addBudget, construction: {...val}});
                                }}
                              />
                              <input id="add_cost_input" className="form-control table_add_input" type="text" value={addBudget.cost} onChange={(e) => setAddBudget({...addBudget, cost: Number(e.target.value)})}/>
                              <input id="add_contract_input" className="form-control table_add_input" type="text" value={addBudget.contract_amount} onChange={(e) => setAddBudget({...addBudget, contract_amount: Number(e.target.value)})}/>
                              <input id="add_change_input" className="form-control table_add_input" type="text" value={addBudget.change_amount} onChange={(e) => setAddBudget({...addBudget, change_amount: Number(e.target.value)})}/>
                              <a id="add_submit_btn" className="budget_add_submit_btn" onClick={() => clickAddBudgetBtn()}><IoMdAddCircle /></a>
                              <Table 
                                id="budget_edit_table"
                                ref={budgetEditTable}
                                dataSource={budgetData} 
                                // keyboardNavigation
                                paging
                                // filtering
                                // tooltip={tooltip}
                                freezeHeader
                                // freezeFooter
                                columns={budgetColumns} 
                                columnMenu
                                editing
                                editMode="row"
                                sortMode='many'
                                onClick={(e) => handleBudgetTableClick(e)}
                                // onChange = {(e) => handleBudgetTableChange(e)}
                                onLoad={() => budgetEditTableInit()}
                                onRowEndEdit={(e) => handleBudgetEdited(e)}
                                // onKeyUp={(e) => handleBudgetTableKeyPressed(e)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
              {
                (page == 'add') &&
                  <>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">basic information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">object name</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" value={addArticle.name} onChange={(e) => setAddArticle({...addArticle, name: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Contract</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text"><FaYenSign /></span>
                                    </div>
                                    <input className="form-control" type="text" value={addArticle.contract_amount} onChange={(e) => setAddArticle({...addArticle, contract_amount: e.target.value})}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Type</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio21" className="custom-control-input" checked={addArticle.is_house == 1 ? true : false} onChange={() => setAddArticle({...addArticle, is_house: 1})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio21" className="custom-control-label">housing</label>
                                  </div>
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio22" className="custom-control-input" checked={addArticle.is_house == 1 ? false : true} onChange={() => setAddArticle({...addArticle, is_house: 0})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio22" className="custom-control-label">building</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Non-representation</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" checked={addArticle.ended == 1 ? true : false} onChange={(e) => setAddArticle({...addArticle, ended: e.target.checked ? 1 : 0})}/>
                                    <label title="" type="checkbox" className="form-check-label">Show hidden properties</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="action_btn_group">
                              <button type="button" className="btn btn-secondary" onClick={() => clickCancelBtn()}>Cancel</button>
                              <button type="button" className="btn btn-primary" onClick={() => clickAddArticleBtn()}>Add</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">budget data</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="input_table_container">
                              <FilterSelect 
                                id="add_construction_input"
                                options={constructions}
                                value={addBudget.construction}
                                onChange={(val) => {
                                  setAddBudget({...addBudget, construction: {...val}});
                                }}
                              />
                              <input id="add_cost_input" className="form-control table_add_input" type="text" value={addBudget.cost} onChange={(e) => setAddBudget({...addBudget, cost: Number(e.target.value)})}/>
                              <input id="add_contract_input" className="form-control table_add_input" type="text" value={addBudget.contract_amount} onChange={(e) => setAddBudget({...addBudget, contract_amount: Number(e.target.value)})}/>
                              <input id="add_change_input" className="form-control table_add_input" type="text" value={addBudget.change_amount} onChange={(e) => setAddBudget({...addBudget, change_amount: Number(e.target.value)})}/>
                              <a id="add_submit_btn" className="budget_add_submit_btn" onClick={() => clickAddBudgetBtn()}><IoMdAddCircle /></a>
                              <Table 
                                id="budget_add_table"
                                ref={budgetAddTable}
                                dataSource={budgetData} 
                                // keyboardNavigation
                                paging
                                // filtering
                                // tooltip={tooltip}
                                freezeHeader
                                freezeFooter
                                columns={budgetColumns} 
                                // columnMenu
                                editing
                                editMode="row"
                                sortMode='many'
                                onClick={(e) => handleBudgetTableClick(e)}
                                onRowEndEdit={(e) => handleBudgetEdited(e)}
                                onLoad={() => budgetAddTableInit()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
              {
                page == 'payment' &&
                  <CreatePayment clickCancelBtn={clickCancelBtn} setPage={setPage} paymentArticle={paymentArticle}/>
              }
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Article