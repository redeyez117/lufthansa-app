import React from 'react'
import {useAuth} from '../context/AuthContext'
import {Route , Redirect} from 'react-router-dom'

export default function AdminRoute ({component:Component, ...rest}) {
  const {currentUser} = useAuth()
  console.log(currentUser.email)
  return(
    <Route
      {...rest}
      render={props=>{
        return currentUser.email.includes('admin') ? <Component {...props}/> : <Redirect to="/job-listings"/>
      }}
    >
    </Route>
  )

}
