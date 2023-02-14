import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux'

import { useTheme } from '@mui/material/styles';

import {MenuItem, Select, FormControl, InputLabel, TextField, Box, Table, TableHead, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, IconButton, Typography} from '@mui/material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { startAction, endAction, showToast } from '../../actions/common';

import agent from '../../api/';

import { CSVLink } from "react-csv";

const columns = [ 
  { id: 'name', label: '会社名', minWidth: 200, align: 'center' },
  // { id: 'furi', label: 'Furi', minWidth: 200, align: 'center' },
  { id: 'en_name', label: '英文名', minWidth: 200, align: 'center' },
  { id: 'category_id', label: '業種', minWidth: 150, align: 'center' },
  { id: 'url', label: 'URL', minWidth: 200, align: 'center' },
  { id: 'contact_url', label: 'お問い合わせフォーム', minWidth: 200, align: 'center' },
  // { id: 'zip', label: 'Zip', minWidth: 100, align: 'center' },
  // { id: 'pref', label: 'Pref', minWidth: 80, align: 'center' },
  { id: 'address', label: '住所', minWidth: 200, align: 'center' },
  { id: 'tel', label: 'TEL', minWidth: 150, align: 'center' },
  // { id: 'dainame', label: 'Dainame', minWidth: 150, align: 'center' },
  // { id: 'corporate_number', label: 'Corporate Number', minWidth: 150, align: 'center' },
  { id: 'established', label: '設立年月日', minWidth: 150, align: 'center' },
  { id: 'capital', label: '資本金', minWidth: 150, align: 'center' },
  { id: 'earnings', label: '売上高', minWidth: 150, align: 'center' },
  // { id: 'employees', label: 'Employees', minWidth: 100, align: 'center' },
  { id: 'category_txt', label: 'フリーキーワード', minWidth: 200, align: 'center' },
  // { id: 'houjin_flg', label: 'Houjin Flg', minWidth: 150, align: 'center' },
  // { id: 'status', label: 'Status', minWidth: 150, align: 'center' },
  // { id: 'created', label: 'Created', minWidth: 150, align: 'center' },
  // { id: 'modified', label: 'Modified', minWidth: 150, align: 'center' },
];

const headers = [
  { label: '会社名', key: 'name'},
  { label: 'Furi', key: 'furi'},
  { label: '英文名', key: 'en_name'},
  { label: '業種', key: 'category_id'},
  { label: 'URL', key: 'url'},
  { label: 'お問い合わせフォーム', key: 'contact_url'},
  { label: 'Zip', key: 'zip'},
  { label: 'Pref', key: 'pref'},
  { label: '住所', key: 'address'},
  { label: 'TEL', key: 'tel'},
  { label: 'Dainame', key: 'dainame'},
  { label: 'Corporate Number', key: 'corporate_number'},
  { label: '設立年月日', key: 'established'},
  { label: '資本金', key: 'capital'},
  { label: '売上高', key: 'earnings'},
  { label: 'Employees', key: 'employees'},
  { label: 'フリーキーワード', key: 'category_txt'},
  { label: 'Houjin Flg', key: 'houjin_flg'},
  { label: 'Status', key: 'status'},
  { label: 'Created', key: 'created'},
  { label: 'Modified', key: 'modified'}
];

const units = [
  {id: 0, label: '全部'},
  {id: 1, label: '5000万円以下'},
  {id: 2, label: '5000万円以上'},
  {id: 3, label: '1億円以上'},
  {id: 4, label: '10億円以上'},
  {id: 5, label: '50億円以上'}
]

const prefecturesList = [
  {label: "全部", value: 0 },
  {label: "北海道", value: "北海道" },
  {label: "青森県", value: "青森県" },
  {label: "岩手県", value: "岩手県" },
  {label: "宮城県", value: "宮城県" },
  {label: "秋田県", value: "秋田県" },
  {label: "山形県", value: "山形県" },
  {label: "福島県", value: "福島県" },
  {label: "茨城県", value: "茨城県" },
  {label: "栃木県", value: "栃木県" },
  {label: "群馬県", value: "群馬県" },
  {label: "埼玉県", value: "埼玉県" },
  {label: "千葉県", value: "千葉県" },
  {label: "東京都", value: "東京都" },
  {label: "神奈川県", value: "神奈川県" },
  {label: "新潟県", value: "新潟県" },
  {label: "富山県", value: "富山県" },
  {label: "石川県", value: "石川県" },
  {label: "福井県", value: "福井県" },
  {label: "山梨県", value: "山梨県" },
  {label: "長野県", value: "長野県" },
  {label: "岐阜県", value: "岐阜県" },
  {label: "静岡県", value: "静岡県" },
  {label: "愛知県", value: "愛知県" },
  {label: "三重県", value: "三重県" },
  {label: "滋賀県", value: "滋賀県" },
  {label: "京都府", value: "京都府" },
  {label: "大阪府", value: "大阪府" },
  {label: "兵庫県", value: "兵庫県" },
  {label: "奈良県", value: "奈良県" },
  {label: "和歌山県", value: "和歌山県" },
  {label: "鳥取県", value: "鳥取県" },
  {label: "島根県", value: "島根県" },
  {label: "岡山県", value: "岡山県" },
  {label: "広島県", value: "広島県" },
  {label: "山口県", value: "山口県" },
  {label: "徳島県", value: "徳島県" },
  {label: "香川県", value: "香川県" },
  {label: "愛媛県", value: "愛媛県" },
  {label: "高知県", value: "高知県" },
  {label: "福岡県", value: "福岡県" },
  {label: "佐賀県", value: "佐賀県" },
  {label: "長崎県", value: "長崎県" },
  {label: "熊本県", value: "熊本県" },
  {label: "大分県", value: "大分県" },
  {label: "宮崎県", value: "宮崎県" },
  {label: "鹿児島県", value: "鹿児島県" },
  {label: "沖縄県", value: "沖縄県" }
];

const industryList = [
  {id: 0, label: '全部', value: 0 },
  {id: 1, label: 'エンタメ業界', value: 'エンタメ業界' },
  {id: 2, label: 'IT業界', value: 'IT業界'},
  {id: 3, label: 'アパレル・美容業界', value: 'アパレル・美容業界'},
  {id: 4, label: '建設・工事業界', value: '建設・工事業界'},
  {id: 5, label: 'コンサルティング業界の会社', value: 'コンサルティング業界の会社'}
];

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

const Home = (props) => {
  const dispatch = useDispatch()
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalCount, setTotalCount]=useState(0);
  
  // search params
  const [searchParams, setSearchParams] = useState({
    prefectures : 0,
    industry : 0,
    siteUrl : 0,
    capital : 0,
    amountOfSales : '',
    freeKeyword : '',
    establishDateFrom: '',
    establishDateTo: ''
  });

  useEffect(() => {
    fectchCompanyData()
  }, [])

  useEffect(() => {
    fectchCompanyData()
  }, [searchParams, page, rowsPerPage])
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fectchCompanyData = async() => {
    console.log('--- fetch company data ---')
    searchParams.page = Number(page) + 1;
    searchParams.rowsPerPage = rowsPerPage;
    dispatch(startAction())
    try {
      const resCompanies = await agent.common.getCompanies(searchParams)
      if (resCompanies.data.success) {
        console.log('--- fetch company data success ---')
        console.log(resCompanies.data.total_data)
        setCompanies(resCompanies.data.data.data);
        // setAllCompanies(resCompanies.data.total_data)
        setTotalCount(resCompanies.data.data.total)
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
    setSearchParams({...searchParams, [event.target.name]: event.target.value});
  };

  const downdloadCsv = () => {
    // searchParams.page = Number(page) + 1;
    // searchParams.rowsPerPage = rowsPerPage;
    // window.location.href = (API_URL + "/companies/export_csv?" + searchParams) ;
  }

  return (
    <>
    <div className="page-header">
      <div className="page-block">
        <div className="row align-items-center">
          <div className="col-md-10">
            <div className="page-header-title">
              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">都道府県</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="prefectures"
                  value={searchParams.prefectures}
                  label="都道府県"
                  onChange={handleChange}
                >
                   {prefecturesList.map((item, index )=> {
                      return (
                        <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">業種</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="industry"
                  value={searchParams.industry}
                  label="業種"
                  onChange={handleChange}
                >
                  {industryList.map((item, index) => {
                      return (
                        <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">サイトURL</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="siteUrl"
                  value={searchParams.siteUrl}
                  label="サイトURL"
                  onChange={handleChange}
                >
                  <MenuItem value={0}>全部</MenuItem>
                  <MenuItem value={1}>有り</MenuItem>
                  <MenuItem value={2}>無し</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">資本金</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="capital"
                  value={searchParams.capital}
                  label="資本金"
                  onChange={handleChange}
                >
                  {units.map((unit, index)=>{
                      return (
                        <MenuItem value={unit.id} key={index}>{unit.label}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="demo-simple-select-label">売上高</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="amountOfSales"
                  value={searchParams.amountOfSales}
                  label="売上高"
                  onChange={handleChange}
                >
                 {units.map((unit, index)=>{
                      return (
                        <MenuItem value={unit.id} key={index}>{unit.label}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <TextField
                  id="date"
                  label="設立年月日"
                  type="date"
                  name="establishDateFrom"
                  defaultValue={searchParams.establishDateFrom}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <TextField
                  id="date"
                  label="設立年月日"
                  type="date"
                  name="establishDateTo"
                  defaultValue={searchParams.establishDateTo}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 250 }}>
                <TextField id="outlined-basic" label="フリーキーワード" name="freeKeyword" variant="outlined" value={searchParams.freeKeyword} onChange={handleChange} />
              </FormControl>
            </div>
          </div>
          <div className="col-md-2 text-center">
            <Typography variant="h5" gutterBottom>該当件数</Typography>
            <Typography variant="h3">{totalCount}<span style={{fontSize: '15px'}}>件</span></Typography>
          </div>
        </div>
      </div>
    </div>
    <div className="main-body">
      <div className="page-wrapper">
        <div className="row"> 
          <div className="col">
            <div className="card">
              <div className="card-header" style={{display: 'flex', justifyContent:'space-between'}}>
                <h5 className="card-title">企業リスト</h5>
                {
                  companies && <CSVLink data={companies} headers={headers} filename={"企業リスト.csv"}>
                    <FileDownloadIcon />CSV File
                    {/* <img src='/assets/image/icon_csv.png' style={{width:'30px', height: '30px'}} alt="csv_icon" /> */}
                  </CSVLink>
                }
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
                              {companies
                                .map((item) => {
                                  return (
                                    <TableRow key={item.id}>
                                      {columns.map((column) => {
                                        const value = item[column.id];
                                        return (
                                          <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number'
                                              ? column.format(value)
                                              : value}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, 100]}
                          component="div"
                          count={totalCount}
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



export default Home