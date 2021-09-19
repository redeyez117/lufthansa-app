import React, {useEffect, useRef, useState} from 'react'
import {Backdrop, Container, Fade, Modal, Paper, Snackbar, TextField, Typography} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {useAuth} from "../context/AuthContext";
import {makeStyles} from "@material-ui/core/styles";
import JobsTable from "../components/JobsTable";
import Button from "@material-ui/core/Button";
import moment from 'moment'
import {ExitToApp} from "@material-ui/icons";
import {useHistory} from 'react-router-dom'
import JobsDataService from '../services/jobs'
import {Alert} from "@material-ui/lab";

export default function Dashboard() {
  const {currentUser, logout} = useAuth()
  const [error, setError] = useState("")
  const [tableData, setTableData] = useState([])
  const titleRef = useRef("")
  const descriptionRef = useRef("")
  const [search, setSearch] = useState('')
  const [defaultJobListings, setDefaultJobListings] = useState([])
  const date = moment().format('MMMM Do YYYY')
  const history = useHistory()
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false)
  const useStyles = makeStyles((theme) => ({
    dashboardContainer: {
      height: '100vh',
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
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
  }))

  const styles = useStyles()

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

  useEffect(() => {
    getJobs();
  }, [])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const handleSearch = async (e) => {
    const {value} = e.target;
    const filtered = defaultJobListings.filter(job => {
      return job.title.toLowerCase().includes(value.toLowerCase())
    })
    setSearch(value)
    setTableData(filtered);
  }

  const handleCreateJob = () => {
    JobsDataService.create({
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      date
    })
      .then(() => {
        handleOpenSnack()
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose()
  }

  async function handleLogout() {
    try {
      setError('')
      await logout()
      history.push('/authenticate')
    } catch {
      setError('Failed to logout')
    }
  }

  return (
    <Container className={styles.dashboardContainer}>
      <Typography component='h2' variant='h5'>
        Welcome {currentUser.email}
      </Typography>
      <Paper elevation={1} className={styles.paper}>
        <Button
          style={{marginLeft: 10}}
          variant="outlined"
          color="primary"
          className={styles.extendedIcon}
          startIcon={<AddIcon/>}
          onClick={handleOpen}
        >
          Create Job
        </Button>
        <TextField style={{width: '30%'}} value={search} color="primary" onChange={handleSearch}
                   label="Search Job Title"/>
        <Button
          variant="outlined"
          color="secondary"
          className={styles.extendedIcon}
          startIcon={<ExitToApp/>}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Paper>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          Job listed successfully!
        </Alert>
      </Snackbar>
      <JobsTable tableData={tableData}/>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={styles.paperModal}>
          <h2 id="transition-modal-title">Create a job listing</h2>
          <TextField style={{marginBottom: 10}} inputRef={titleRef} id="title" label="Title" variant="outlined"/>
          <TextField multiline rows={6} inputRef={descriptionRef} id="description" label="Description"
                     variant="outlined"/>
          <Button
            style={{marginTop: 10}}
            variant="contained"
            color="primary"
            onClick={handleCreateJob}
          >
            Create
          </Button>
        </div>
      </Modal>
    </Container>
  )
}
