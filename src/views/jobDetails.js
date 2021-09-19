import React, {useEffect, useState} from 'react'
import {Container, Paper, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {NavLink, useParams} from "react-router-dom";
import JobsDataService from "../services/jobs";
import AppliedJobsService from "../services/applied";
import FavouriteJobsService from "../services/favourite"
import {useAuth} from "../context/AuthContext";

const useStyles = makeStyles(theme=>({
  jobContainer: {
    height: '100vh',
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobPaper: {
    width: '100%',
    paddingInline:10,
    paddingBlock:25
  },
  actionBtn: {
    display:"flex",
    alignItems:"center",
    paddingTop:15
  }
}))

export default function JobDetails(props) {
  const classes = useStyles()
  const [job, setJob] = useState(null)
  const [isApplicant, setIsApplicant] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const {currentUser} = useAuth()

  const params = useParams();

  function getJob(){
    var data = JobsDataService.fetch(params.id);
    data.on('value', data => {
      setJob(data.val())
    })
  }

  function getHasAppliedToJob(){
    let applied = AppliedJobsService.jobApplicants(params.id);
    applied.on('value', response => {
      const data = response.val();
      if (!data) {
        return setIsApplicant(false)
      }
      const isApplicant = Object.values(data).find(application => {
        return application.user_id === currentUser.uid
      })
      setIsApplicant(!!isApplicant)
      getJob()
    })
  }

  function getHasIsFavourite(){
    let favourite = FavouriteJobsService.jobFavourites(params.id);
    favourite.on('value', response => {
      const data = response.val();
      if (!data) {
        return setIsFavourite(false)
      }
      const isFavourite = Object.values(data).find(application => {
        return application.user_id === currentUser.uid
      })
      setIsFavourite(!!isFavourite)
      getJob()
    })
  }

  const apply = () => {
    AppliedJobsService.create({
      user_id: currentUser.uid,
      job_id: params.id,
    })
      .then(() => {
        getHasAppliedToJob()
      })
      .catch((e) => {
        setIsApplicant(false);
      });
  }

  const applyFavourite = () => {
    FavouriteJobsService.create({
      user_id: currentUser.uid,
      job_id: params.id,
    })
      .then(() => {
        getHasIsFavourite()
      })
      .catch((e) => {
        setIsFavourite(false);
      });
  }

  useEffect(() => {
    getJob();
    getHasAppliedToJob();
    getHasIsFavourite()
  }, []);


  return job ? (
    <Container className={classes.jobContainer}>
      <NavLink to='/job-listings'>
        <Button style={{marginBottom:5}} color="primary" variant="contained">
          Go Back
        </Button>
      </NavLink>
      <Paper className={classes.jobPaper}>
        <Typography component="h4" variant="h5">
          {job.title}
        </Typography>
        <hr/>
        <div>
          <Typography component="p">
            {job.description}
          </Typography>
        </div>
        <hr/>
        <div className={classes.actionBtn}>
          <Button onClick={apply} disabled={isApplicant} style={{marginRight:10}} color="primary" variant="contained">
            { isApplicant ? 'Applied' : 'Apply'}
          </Button>
          <Button onClick={applyFavourite} disabled={isFavourite} color="secondary" variant="outlined">
            { isFavourite ? 'Already on favourite list' : 'Add to favourite'}
          </Button>
        </div>
      </Paper>
    </Container>
  ) : <></>
}
