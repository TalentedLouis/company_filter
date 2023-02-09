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

import SimpleReactValidator from 'simple-react-validator';

import { FaYenSign } from "react-icons/fa"
import { IoMdRemoveCircle, IoMdAddCircle } from "react-icons/io"

import CreatePayment from '../../components/CreatePayment'

import './Company.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

const Company = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [page, setPage] = useState('list')
  const [companies, setCompanies] = useState([])
  const [editCompany, setEditCompany] = useState({})
  const [addCompany, setAddCompany] = useState({
    name: '', 
    bank_account_holder: '', 
    bank_account_number: '', 
    bank_branch_code: '', 
    bank_branch_name: '',
    bank_code: '',
    bank_deposit_type_id: 1,
    bank_name: '',
    transfer_fee_id: 1
  })


  const companyColumns = [
    {
      label: 'Id',
      dataField: 'id',
      dataType: 'number',
      width: 100
    }, {
      label: 'Company Name',
      dataField: 'name',
      dataType: 'string'
    }, {
      label: 'Detail',
      dataField: '',
      width: 100,
      allowSort: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_company_detail_btn" data-id={settings.data.id}>Detail</a>);
      }
    }
  ];
  
  const companyData = new Smart.DataAdapter({
		dataSource: companies,
		dataFields: [
			'id: number',
			'name: string',
			'bank_code: string',
      'bank_name: string',
      'bank_branch_code: string',
      'bank_branch_name: string',
      'bank_deposit_type_id: number',
      'bank_account_number: string',
      'bank_account_holder: string',
      'supplier: number',
      'subcontractor: number',
      'transfer_fee_id: number',
		]
	});

  async function getCompanyData() {
    dispatch(startAction())
    try {
      const resCompany = await agent.common.getCompany()
      console.log('resCompany data=', resCompany.data.data)
      // if (resCompany.data.success) {
        setCompanies([...resCompany.data.data])
      // }
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

  useEffect(() => {
    
    getCompanyData()
  }, [])

  const clickSearchBtn = () => {
    console.log('click search btn')
  }

  

  const handleCompanyTableClick = (event) => {
    const detail_btn = event.target.closest('.table_company_detail_btn')

    if(detail_btn) {
      goCompanyEdit(detail_btn.getAttribute('data-id'))
    }
	}

  const goCompanyAdd = () => {
    setAddCompany({
      name: '', 
      bank_account_holder: '', 
      bank_account_number: '', 
      bank_branch_code: '', 
      bank_branch_name: '',
      bank_code: '',
      bank_deposit_type_id: 1,
      bank_name: '',
      transfer_fee_id: 1
    })
    setPage('add')
  }

  const goCompanyEdit = (company_id) => {
    const result = companies.find(company => {
      return company.id == company_id;
    });
    if (result !== undefined) {
      setEditCompany({...result})
      setPage('edit')
    }
  }

  const clickSaveBtn = async() => {
    dispatch(startAction())
		const res = await agent.common.editCompany(
      editCompany.id, 
      editCompany.name,
      editCompany.bank_code, 
      editCompany.bank_name, 
      editCompany.bank_branch_code, 
      editCompany.bank_branch_name, 
      editCompany.bank_deposit_type_id, 
      editCompany.bank_account_number, 
      editCompany.bank_account_holder, 
      editCompany.transfer_fee_id
    )
		if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      getCompanyData()
      setPage('list')
    } else dispatch(showToast('error', res.data.message))
		dispatch(endAction())
  }

  const clickAddSubmitBtn = async() => {
    dispatch(startAction())
		const res = await agent.common.addCompany(
      addCompany.name,
      addCompany.bank_code, 
      addCompany.bank_name, 
      addCompany.bank_branch_code, 
      addCompany.bank_branch_name, 
      addCompany.bank_deposit_type_id, 
      addCompany.bank_account_number, 
      addCompany.bank_account_holder, 
      addCompany.transfer_fee_id
    )
		if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      getCompanyData()
      setPage('list')
    } else dispatch(showToast('error', res.data.message))
		dispatch(endAction())
  }

  const clickCancelBtn = () => {
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
                    <h5 className="m-b-10">Company list </h5>
                }
                {
                  page == 'edit' &&
                    <h5 className="m-b-10">Company edit </h5>
                }
                {
                  page == 'add' &&
                    <h5 className="m-b-10">Company add </h5>
                }
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/"><i className="feather icon-home"></i></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#!">Vendor management</a>
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
                      <a href="/article">Company edit</a>
                    </li>
                }
                {
                  page == 'add' &&
                    <li className="breadcrumb-item">
                      <a href="/article">Company add</a>
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
                            <label className="form-label">Merchant ID</label>
                            <input className="form-control" type="text" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">company name</label>
                            <input className="form-control" type="text" />
                          </div>
                          <hr />
                          <button type="button" className="btn btn-primary" onClick={() => clickSearchBtn()}>Search</button>
                        </div>
                        <div className="col-md-9">
                          <div className="table_container">
                            <Table 
                              dataSource={companyData} 
                              // keyboardNavigation 
                              paging
                              filtering
                              // tooltip={tooltip}
                              columns={companyColumns} 
                              columnMenu
                              // editing
                              sortMode='many'
                              onClick={(e) => handleCompanyTableClick(e)}
                            />
                            <button type="button" className="btn btn-primary table_btn" onClick={() => goCompanyAdd()}>Create</button>
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
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Company Name</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={editCompany.name} onChange={(e) => setEditCompany({...editCompany, name: e.target.value})} />
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Remittance bank</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={editCompany.bank_code} onChange={(e) => setEditCompany({...editCompany, bank_code: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Remittance bank</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text"  defaultValue={editCompany.bank_name} onChange={(e) => setEditCompany({...editCompany, bank_name: e.target.value})}/>
                                  <small className="text-muted form-text">Please enter in half-width katakana</small>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Branch number</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text"  defaultValue={editCompany.bank_branch_code} onChange={(e) => setEditCompany({...editCompany, bank_branch_code: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Branch</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text"  defaultValue={editCompany.bank_branch_name} onChange={(e) => setEditCompany({...editCompany, bank_branch_name: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Deposit</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio21" className="custom-control-input" defaultChecked={editCompany.bank_deposit_type_id == 1} onChange={() => setEditCompany({...editCompany, bank_deposit_type_id: 1})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio21" className="custom-control-label">Savings account</label>
                                  </div>
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio22" className="custom-control-input" defaultChecked={editCompany.bank_deposit_type_id == 2} onChange={() => setEditCompany({...editCompany, bank_deposit_type_id: 2})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio22" className="custom-control-label">current account</label>
                                  </div>
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio23" className="custom-control-input" defaultChecked={editCompany.bank_deposit_type_id == 3} onChange={() => setEditCompany({...editCompany, bank_deposit_type_id: 3})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio23" className="custom-control-label">others</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">account</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={editCompany.bank_account_number} onChange={(e) => setEditCompany({...editCompany, bank_account_number: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Beneficiary</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={editCompany.bank_account_holder} onChange={(e) => setEditCompany({...editCompany, bank_account_holder: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Transfer fee</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" defaultChecked={editCompany.transfer_fee_id == 2} onChange={(e) => setEditCompany({...editCompany, transfer_fee_id: e.target.checked ? 2 : 1})}/>
                                    <label title="" type="checkbox" className="form-check-label">Self-pay</label>
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
                                  <label className="form-label">Company Name</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={addCompany.name} onChange={(e) => setAddCompany({...addCompany, name: e.target.value})} />
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Remittance bank</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={addCompany.bank_code} onChange={(e) => setAddCompany({...addCompany, bank_code: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Remittance bank</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text"  defaultValue={addCompany.bank_name} onChange={(e) => setAddCompany({...addCompany, bank_name: e.target.value})}/>
                                  <small className="text-muted form-text">Please enter in half-width katakana</small>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Branch number</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text"  defaultValue={addCompany.bank_branch_code} onChange={(e) => setAddCompany({...addCompany, bank_branch_code: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Branch</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text"  defaultValue={addCompany.bank_branch_name} onChange={(e) => setAddCompany({...addCompany, bank_branch_name: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Deposit</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio21" className="custom-control-input" defaultChecked={addCompany.bank_deposit_type_id == 1} onChange={() => setAddCompany({...addCompany, bank_deposit_type_id: 1})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio21" className="custom-control-label">Savings account</label>
                                  </div>
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio22" className="custom-control-input" defaultChecked={addCompany.bank_deposit_type_id == 2} onChange={() => setAddCompany({...addCompany, bank_deposit_type_id: 2})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio22" className="custom-control-label">current account</label>
                                  </div>
                                  <div className="custom-control custom-radio custom-control-inline">
                                    <input name="supportedRadio" type="radio" id="supportedRadio23" className="custom-control-input" defaultChecked={addCompany.bank_deposit_type_id == 3} onChange={() => setAddCompany({...addCompany, bank_deposit_type_id: 3})}/>
                                    <label title="" type="checkbox" htmlFor="supportedRadio23" className="custom-control-label">others</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">account</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={addCompany.bank_account_number} onChange={(e) => setAddCompany({...addCompany, bank_account_number: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Beneficiary</label>
                                </div>
                                <div className="col-md-6">
                                  <input className="form-control" type="text" defaultValue={addCompany.bank_account_holder} onChange={(e) => setAddCompany({...addCompany, bank_account_holder: e.target.value})}/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-md-3 inline_label">
                                  <label className="form-label">Transfer fee</label>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" defaultChecked={addCompany.transfer_fee_id == 2} onChange={(e) => setAddCompany({...addCompany, transfer_fee_id: e.target.checked ? 2 : 1})}/>
                                    <label title="" type="checkbox" className="form-check-label">Self-pay</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="action_btn_group">
                              <button type="button" className="btn btn-secondary" onClick={() => clickCancelBtn()}>Cancel</button>
                              <button type="button" className="btn btn-primary" onClick={() => clickAddSubmitBtn()}>Add</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Company