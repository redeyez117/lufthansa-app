import React, {useRef, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {makeStyles} from "@material-ui/core/styles";
import {useAuth} from "../context/AuthContext";
import {Alert} from "@material-ui/lab";
import { useHistory } from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    cursor: 'pointer'
  }
}));

export default function SignIn(props) {
  const classes = useStyles()
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const handleSwitch = () => {
    props.viewSwitch(false)
  }

  const { signin } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    if(!emailRef.current.value || !passwordRef.current.value) {
      return setError('Please fill the empty fields!')
    }

    try {
      setError('')
      setLoading(true)
      await signin(emailRef.current.value, passwordRef.current.value).then(res=>{
        const admin = res.user.email.includes('admin')
        if(admin){
          return history.push('/')
        }
        history.push('/job-listings')
      })
    }
    catch (error) {
      console.log(error)
      if(error.code === 'auth/user-not-found') {
        setError('This email address does not exist')
      }else if(error.code === 'auth/wrong-password') {
        setError('Password not correct')
      }
      else {
        setError('Something went wrong, please try again later!')
      }
    }
    setLoading(false)
  }
  return(
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form onSubmit={handleSubmit} className={classes.form} noValidate>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          inputRef={emailRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          inputRef={passwordRef}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link className={classes.link} onClick={handleSwitch} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}
