import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { renderToString } from "react-dom/server";

import { Table } from 'smart-webcomponents-react/table';

import './Users.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

const Users = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsersData()
  }, [])

  const userColumns = [
    {
      label: 'Id',
      dataField: 'id',
      dataType: 'number',
      width: 100
    }, {
      label: 'Name',
      dataField: '',
      dataType: 'string',
      formatFunction(settings) {
        settings.template = settings.data.first_name + ' ' + settings.data.last_name;
      }
    }, {
      label: 'User ID',
      dataField: 'uid',
      dataType: 'string',
    }, {
      label: 'Email',
      dataField: 'email',
      dataType: 'string',
    }, {
      label: 'Role',
      dataField: 'role',
      dataType: 'string',
      formatFunction(settings) {
        settings.template = settings.data.role == 1 ? 'Admin' : 'User'
      }
    }, {
      label: 'Status',
      dataField: 'disabled',
      dataType: 'string',
      formatFunction(settings) {
        settings.template = settings.data.disabled == 1 ? 
          renderToString(<a className="table_user_disable_edit_btn" data-id={settings.data.id}>Disabled</a>)
          :
          renderToString(<a className="table_user_enable_edit_btn" data-id={settings.data.id}>Enabled</a>)
      }
    }
  ];
  
  const userData = new Smart.DataAdapter({
		dataSource: users,
		dataFields: [
			'id: number',
			'first_name: string',
			'last_name: string',
      'uid: string',
      'email: string',
      'disabled: number',
      'role: number'
		]
	});

  async function getUsersData() {
      dispatch(startAction())
      try {
        const resUsers = await agent.common.getUsers()
        console.log('resUsers data=', resUsers.data.data)
        if (resUsers.data.success) {
          setUsers([...resUsers.data.data])
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

  const handleUserTableClick = (event) => {
    const disable_edit_btn = event.target.closest('.table_user_disable_edit_btn')
    const enable_edit_btn = event.target.closest('.table_user_enable_edit_btn')

    if(disable_edit_btn) {
      updateAccountStatus(disable_edit_btn.getAttribute('data-id'), 0)
    } else if(enable_edit_btn) {
      updateAccountStatus(enable_edit_btn.getAttribute('data-id'), 1)
    }
	}

  const updateAccountStatus = async(user_id, disabled) => {
    dispatch(startAction())
		const res = await agent.common.updateAccountStatus(
      user_id, 
      disabled
    )
		if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      getUsersData()
      setPage('list')
    } else dispatch(showToast('error', res.data.message))
		dispatch(endAction())
  }

  return (
    <>
      <div className="page-header">
        <div className="page-block">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="page-header-title">
                <h5 className="m-b-10">User list </h5>
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/"><i className="feather icon-home"></i></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#!">User management</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">list</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table_container">
                        <Table 
                          dataSource={userData} 
                          // keyboardNavigation 
                          paging
                          // filtering
                          // tooltip={tooltip}
                          columns={userColumns} 
                          columnMenu
                          // editing
                          sortMode='many'
                          onClick={(e) => handleUserTableClick(e)}
                        />
                        <button type="button" className="btn btn-primary table_btn" onClick={() => goCompanyAdd()}>Create</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users