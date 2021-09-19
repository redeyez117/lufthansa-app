import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Copyright from "../components/Copyright";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function Auth() {
  let [signIn, setSignIn] = React.useState(true)

  const handleFormSwitch = (payload) => {
    setSignIn(payload)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      {signIn && <SignIn viewSwitch={handleFormSwitch}/>}
      {!signIn && <SignUp viewSwitch={handleFormSwitch}/>}
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
}
