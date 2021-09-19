import React, {useRef, useState} from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useAuth} from "../context/AuthContext";
import {useHistory} from 'react-router-dom'
import UserService from "../services/user";

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  link: {
    cursor: 'pointer'
  }
}));

export default function SignUp(props) {
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const confirmPasswordRef = useRef('')
  const fullnameRef = useRef('')
  const ageRef = useRef('')
  const phoneRef = useRef('')
  const classes = useStyles()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const handleSwitch = () => {
    props.viewSwitch(true)
  }
  const { signup, currentUser } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    if(passwordRef.current.value !== confirmPasswordRef.current.value){
      return setError('Password do not match!')
    }

    if(!emailRef.current.value || !passwordRef.current.value || !fullnameRef.current.value) {
      return setError('Please fill the empty fields!')
    }

    try {
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      await UserService.create({
        email: emailRef.current.value,
        fullname: fullnameRef.current.value,
        age: ageRef.current.value,
        phone: phoneRef.current.value

      })
      history.push('/')
    }
    catch (error) {
      if(error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters')
      }else {
        setError('Something went wrong, please try again later!')
        console.log(error)
      }
    }
    setLoading(false)
  }
  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Fullname"
          name="name"
          autoFocus
          inputRef={fullnameRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="age"
          label="Age"
          name="age"
          autoFocus
          inputRef={ageRef}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="phone"
          label="Phone Number"
          name="phone"
          autoFocus
          inputRef={phoneRef}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
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
          inputRef={passwordRef}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirm-password"
          label="Confirm Password"
          type="password"
          id="confirm-password"
          inputRef={confirmPasswordRef}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
        <Grid container>
          <Grid item>
            <Link className={classes.link} onClick={handleSwitch}
                  variant="body2">
              {"Already have an account! Sign In"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}
