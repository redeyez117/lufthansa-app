import React, {useEffect, useState} from "react";
import {Avatar, Container, Paper} from "@material-ui/core";
import ProfileTabs from "../components/ProfileTabs";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {NavLink, useHistory, useParams} from "react-router-dom";
import JobsDataService from "../services/jobs";
import UserService from "../services/user";
import AppliedJobsService from "../services/applied";
import FavouriteJobsService from "../services/favourite";
import {useAuth} from "../context/AuthContext";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    marginTop: 25,
    paddingBlock: 10
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700'
  }
}))

export default function Profile() {
  const classes = useStyles()
  const [appliedJobIds, setAppliedJobIds] = useState([])
  const [appliedJobs, setAppliedJobs] = useState([])
  const [favouriteJobIds, setFavouriteJobIds] = useState([])
  const [favouriteJobs, setFavouriteJobs] = useState([])
  const [userInfo, setUserInfo] = useState([])
  const {currentUser} = useAuth();
  const params = useParams();

  function fetchJobApplications() {
    let data = AppliedJobsService.fetchJobApplications(currentUser.uid);
    data.on('value', response => {
      const data = response.val();
      if (!data) {
        return setAppliedJobIds([])
      }
      const values = Object.values(data).map(record => record.job_id);
      setAppliedJobIds(values);
    })
  }

  function fetchUserInfo() {
    let user = UserService.fetchUser(currentUser.email)
    user.on('value', response => {
      const data = response.val();
      if (!data) {
        return setAppliedJobIds([])
      }
      const values = Object.values(data);
      setUserInfo(values);
    })

  }

  function fetchJobFavourites() {
    let data = FavouriteJobsService.fetchJobFavourites(currentUser.uid);
    data.on('value', response => {
      const data = response.val();

      if (!data) {
        return setFavouriteJobIds([])
      }
      const values = Object.values(data).map(record => record.job_id);
      setFavouriteJobIds(values);
    })
  }

  function getJobs() {
    let data = JobsDataService.getAll();
    data.on('value', response => {
      const data = response.val();

      const filteredAppliedJobs = Object.entries(data).filter(data => {
        return appliedJobIds.includes(data[0])
      })

      const filteredFavouriteJobs = Object.entries(data).filter(data => {
        return favouriteJobIds.includes(data[0])
      })

      const mappedAppliedJobs = filteredAppliedJobs.map(data => {
        return data[1]
      });

      const mappedFavouriteJobs = filteredFavouriteJobs.map(data => {
        console.log(data)

        return data[1]
      });
      setAppliedJobs(mappedAppliedJobs)
      setFavouriteJobs(mappedFavouriteJobs)
    })
  }

  useEffect(async () => {
    await fetchJobApplications();
    await fetchJobFavourites();
  }, []);

  useEffect(() => {
    fetchUserInfo()
  }, [])

  useEffect(async () => {
    await getJobs()
  }, [appliedJobIds, favouriteJobIds]);

  return (
    <Container>
      <Paper className={classes.paper}>
        <Avatar></Avatar>
        <div style={{marginTop: 10}}>
          {userInfo.length && <div>
            <Typography component="h5">
              <span className={classes.infoTitle}>Fullname: </span>
              {userInfo[0].fullname}
            </Typography>
            <Typography component="p">
              <span className={classes.infoTitle}>Age: </span>
              {userInfo[0].age}
            </Typography>
            <Typography component="p">
              <span className={classes.infoTitle}>Email: </span>
              {userInfo[0].email}
            </Typography>
            <Typography component="p">
              <span className={classes.infoTitle}>Phone: </span>
              {userInfo[0].phone}
            </Typography>
          </div>}
          {!userInfo.length && <Typography component="h3">
            No Info Available
          </Typography>}
        </div>
        <NavLink style={{marginTop: 10, textDecoration: 'none'}} to='/job-listings'>
          <Button color="primary" variant="contained">
            Go Back
          </Button>
        </NavLink>
        <ProfileTabs favouriteJobs={favouriteJobs} appliedJobs={appliedJobs}/>
      </Paper>
    </Container>
  )
}
