import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button, Container, TextField, Typography} from "@material-ui/core";
import {ExitToApp, RemoveRedEyeRounded} from "@material-ui/icons";
import JobsDataService from '../services/jobs';
import {NavLink} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  dashboardContainer: {
    height: '100vh',
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  table: {
    minWidth: 650,
  },
  tableWrapper: {
    marginTop: 60,
    marginBottom: 15
  },
  header: {
    fontSize: 16,
    fontWeight: '600'
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperModal: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 400
  },

  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
    paddingBlock: 10
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },

}));

export default function JobsTable() {
  const classes = useStyles();
  const [tableData, setTableData] = useState([])
  const [search, setSearch] = useState('')
  const [defaultJobListings, setDefaultJobListings] = useState([])
  const {logout, currentUser} = useAuth();
  const history = useHistory()

  const getJobs = () => {
    JobsDataService.getAll().on('value', data => {
      const values = data.val();
      const newJobs = Object.entries(values).map(row => {
        return {
          id: row[0],
          title: row[1].title,
          description: row[1].description,
          date: row[1].date
        }
      })
      setTableData(newJobs)
      setDefaultJobListings(newJobs)
    });
  }

  async function handleLogout() {
    try {
      await logout()
      history.push('/authenticate')
    } catch (e) {
      console.log(e)
    }
  }

  const handleSearch = async (e) => {
    const {value} = e.target;
    const filtered = defaultJobListings.filter(job => {
      return job.title.toLowerCase().includes(value.toLowerCase())
    })
    setSearch(value)
    setTableData(filtered);
  }

  useEffect(() => {
    getJobs();
  }, [])
  return (
    <Container className={classes.dashboardContainer}>
      <Typography component="h4" variant="h5">
        Available jobs to apply
      </Typography>
      <Paper elevation={1} className={classes.paper}>
        <NavLink style={{textDecoration: 'none'}} to={`/profile/${currentUser.uid}`}>
          <Button style={{marginLeft: 10}}
                  variant="outlined"
                  color="primary"
                  className={classes.extendedIcon}
          >
            My Profile
          </Button>
        </NavLink>
        <TextField style={{width: '30%'}} value={search} color="primary" onChange={handleSearch}
                   label="Search Job Title"/>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.extendedIcon}
          startIcon={<ExitToApp/>}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Paper>
      <TableContainer className={classes.tableWrapper} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.header} align="center">Title</TableCell>
              <TableCell className={classes.header} align="center">Description</TableCell>
              <TableCell className={classes.header} align="center">Date</TableCell>
              <TableCell className={classes.header} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">
                  <NavLink to={`/job-listings/${row.id}`}>
                    <Button startIcon={<RemoveRedEyeRounded/>} variant="contained" color="primary">
                      View
                    </Button>
                  </NavLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
