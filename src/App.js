import './App.css';
import Auth from "./views/auth";
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter as Router , Route , Switch} from "react-router-dom";
import Dashboard from "./views/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Client from './views/client'
import JobDetails from "./views/jobDetails";
import AdminRoute from "./components/AdminRoute";
import Profile from "./views/profile";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <AdminRoute exact component={Dashboard} path="/"/>
          <Route exact component={Auth} path="/authenticate"/>
          <PrivateRoute exact component={Client} path="/job-listings"/>
          <Route exact component={JobDetails} path="/job-listings/:id"/>
          <Route exact component={Profile} path="/profile/:id"/>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
