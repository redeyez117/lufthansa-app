import React, {useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Backdrop, Button, Modal, TextField} from "@material-ui/core";
import {Delete, EditSharp} from "@material-ui/icons";
import JobsDataService from '../services/jobs';

const useStyles = makeStyles(theme=>({
  table: {
    minWidth: 650,
  },
  tableWrapper: {
    marginTop: 60,
    marginBottom:15
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
    width:400
  },
}));

export default function JobsTable({tableData}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobId, setJobId] = useState('');

  const handleOpen = (item) => {
    setTitle(item.title)
    setDescription(item.description)
    setJobId(item.id)
    setOpen(true)
  };

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setOpen(false);
  };

  const handleUpdate = () => {
    JobsDataService.update(jobId,{title,description}).then(res=>{{
      if(res) {
        console.log(res)
      }

      handleClose()
    }})
  }

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete the listing?')){
      JobsDataService.delete(id).then(res=>{
        if(res) {
          console.log(res)
        }
      })
    }
  }
  return (
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
                <Button onClick={()=>{
                  handleOpen(row)
                }} startIcon={<EditSharp/>} variant="outlined" color="primary">Edit</Button>
                <Button onClick={()=>{
                  handleDelete(row.id)
                }} style={{marginLeft:5}} startIcon={<Delete/>} color="secondary" variant="outlined">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paperModal}>
          <h2 id="transition-modal-title">Update job listing</h2>
          <TextField style={{marginBottom:10}} value={title} onChange={(e) => setTitle(e.target.value)} id="title" label="Title" variant="outlined" />
          <TextField multiline rows={6} value={description} onChange={(e) => setDescription(e.target.value)} id="description" label="Description" variant="outlined" />
          <Button
            style={{marginTop:10}}
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            Update Job
          </Button>
        </div>
      </Modal>
    </TableContainer>
  );
}
