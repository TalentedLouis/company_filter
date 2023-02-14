import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { renderToString } from "react-dom/server";

import { useTheme } from '@mui/material/styles';

import {MenuItem, Select, FormControl, InputLabel, TextField, Box, Table, TableHead, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, IconButton, Typography} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import './Users.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Users = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalCount, setTotalCount]=useState(0);

  useEffect(() => {
    getUsersData()
  }, [])

  const columns = [ 
    { id: 'id', label: 'Id', minWidth: 200, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 200, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 150, align: 'center' },
    // { id: 'phone', label: 'Phone', minWidth: 200, align: 'center' },
    { id: 'password', label: 'Password', minWidth: 200, align: 'center' },
    { id: 'disabled', label: 'Status', minWidth: 200, align: 'center' },
  ];

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="page-header">
        {/* <div className="page-block">
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
        </div> */}
      </div>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">使用者管理</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table_container">
                        <Paper sx={{ width: '100%' }}>
                          <TableContainer sx={{ maxHeight: 500 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  {columns.map((column) => (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                    >
                                      {column.label}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {users
                                  .map((item, index) => {
                                    return (
                                      <TableRow key={item.id}>
                                        <TableCell align='center'>{index + 1}</TableCell>
                                        <TableCell align='center'>{item.first_name + item.last_name}</TableCell>
                                        <TableCell align='center'>{item.email}</TableCell>
                                        <TableCell align='center'>{item.password}</TableCell>
                                        <TableCell align='center'>{item.disabled === 0 ? 'Enabled' : 'disabled'}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={users.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                          />
                        </Paper>
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