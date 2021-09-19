import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import * as PropTypes from "prop-types";

const useStyles = makeStyles(theme=>({
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
}))
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function ProfileTabs({appliedJobs, favouriteJobs}) {
  const [value, setValue] = React.useState(0);
  const classes = useStyles()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs style={{marginTop:15}} centered value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Applied Jobs" {...a11yProps(0)} />
          <Tab label="Favourite Jobs" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TableContainer className={classes.tableWrapper} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={1} className={classes.header} align="center">Title</TableCell>
                <TableCell colSpan={1} className={classes.header} align="center">Description</TableCell>
                <TableCell colSpan={1} className={classes.header} align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!appliedJobs.length && <TableRow>
                <TableCell colSpan={3}>
                  <Typography component="h3">
                    No Applied Jobs Yet
                  </Typography>
                </TableCell>
              </TableRow>}
              {appliedJobs.map((row,index) => (
                <TableRow key={index}>
                  <TableCell align="center" component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TableContainer className={classes.tableWrapper} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.header} align="center">Title</TableCell>
                <TableCell className={classes.header} align="center">Description</TableCell>
                <TableCell className={classes.header} align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!favouriteJobs.length && <TableRow>
                <TableCell colSpan={3}>
                  <Typography component="h3">
                    No Favourite Jobs Yet
                  </Typography>
                </TableCell>
              </TableRow>}
              {favouriteJobs.map((row,index) => (
                <TableRow key={index}>
                  <TableCell align="center" component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}
