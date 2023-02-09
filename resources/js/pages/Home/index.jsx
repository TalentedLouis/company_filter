import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import {MenuItem, Select, FormControl, InputLabel, TextField, Box} from '@mui/material';

import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid } from '@mui/x-data-grid';

import { Table } from 'smart-webcomponents-react/table';

import { startAction, endAction, showToast } from '../../actions/common'

import agent from '../../api/'

// import styles from './Home.module.scss';

const JP_TEXT = {
  // Column menu text
  columnMenuUnsort: 'ソート解除', // Unsort
  columnMenuSortAsc: 'ASC で並べ替え', // Sort by ASC
  columnMenuSortDesc: 'DESCで並べ替え', // Sort by DESC
  columnMenuFilter: 'フィルター', // Filter
  columnMenuHideColumn: '列を非表示', // Hide column
  columnMenuShowColumns: '列を表示', // Show columns, 

  // Columns panel text
  columnsPanelTextFieldLabel: '列を検索', //Find column
  columnsPanelTextFieldPlaceholder: 'コラムのタイトル', //Column title
  columnsPanelShowAllButton: 'すべて表示する', //Show all
  columnsPanelHideAllButton: 'すべて非表示', // Hide all

  // Filter panel text
  filterPanelColumns: 'コラム', //Columns
  filterPanelOperators: 'オペレーター', // Operator
  filterPanelInputLabel: '価値', // Value
  filterPanelInputPlaceholder: 'フィルター値', // Filter value

  // Filter operators text
  filterOperatorContains: '含む', // contains
  filterOperatorEquals: '等しい', // equals
  filterOperatorStartsWith: 'で始まる', // starts with
  filterOperatorEndsWith: 'で終わる', // ends with
  filterOperatorIsEmpty: '空です', //is empty
  filterOperatorIsNotEmpty: '空ではありません', // is not empty
  filterOperatorIsAnyOf: 'のいずれかです', // is any of
};


const columns = [
  // { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'furi', headerName: 'Furi', width: 200 },
  { field: 'en_name', headerName: 'En Name', width: 200 },
  { field: 'category_id', headerName: 'Category Id', width: 150 },
  { field: 'url', headerName: 'URL', width: 300 },
  { field: 'contact_url', headerName: 'Contact URL', width: 300 },
  { field: 'zip', headerName: 'Zip', width: 100 },
  { field: 'pref', headerName: 'Pref', width: 80 },
  { field: 'address', headerName: 'Address', width: 300 },
  { field: 'tel', headerName: 'Tel', width: 150 },
  { field: 'dainame', headerName: 'Dainame', width: 150 },
  { field: 'corporate_number', headerName: 'Corporate Number', width: 150 },
  { field: 'established', headerName: 'Established', width: 150 },
  { field: 'capital', headerName: 'Capital', width: 150 },
  { field: 'earnings', headerName: 'Earnings', width: 150 },
  { field: 'employees', headerName: 'Employees', width: 100 },
  { field: 'category_txt', headerName: 'Category TXT', width: 200 },
  { field: 'houjin_flg', headerName: 'Houjin Flg', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'created', headerName: 'Created', width: 150 },
  { field: 'modified', headerName: 'Modified', width: 150 },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


const Home = (props) => {
  const dispatch = useDispatch()
  const [age, setAge] = useState('');
  const [value, setValue] = useState('');
  const [companies, setCompanies] = useState([]);
  
  useEffect(() => {
    getCompanyData()
  }, [])

  const getCompanyData = async() => {
    dispatch(startAction())
    try {
      const resCompanies = await agent.common.getCompanies()
      console.log('--- get company data ---');
      console.log(resCompanies);
      if (resCompanies.data.success) {
        setCompanies([...resCompanies.data.data])
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

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
    <div className="page-header">
      <div className="page-block">
        <div className="row align-items-center">
          <div className="col-md-12">
            {/* <div className="page-header-title">
              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">都道府県</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="都道府県"
                  onChange={handleChange}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">業種</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="業種"
                  onChange={handleChange}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">サイトURL</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="サイトURL"
                  onChange={handleChange}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">資本金</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="資本金"
                  onChange={handleChange}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">売上高</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="売上高"
                  onChange={handleChange}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <TextField id="outlined-basic" label="フリーキーワード" variant="outlined" />
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </div> */}
            <ul className="breadcrumb">
              
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
                <h5 className="card-title">Company List</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="table_container">
                    <Box sx={{ height: 600, width: '100%' }}>
                      <DataGrid
                        localeText={JP_TEXT}
                        rows={companies}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5]}
                        // checkboxSelection
                      />
                      </Box>
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

export default Home