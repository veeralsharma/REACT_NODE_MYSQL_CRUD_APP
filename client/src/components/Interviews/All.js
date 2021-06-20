import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./Interview.css"
import Api from '../../Axios'
import Backdrop from '@material-ui/core/Backdrop';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function All() {
 const classes = useStyles();
 const [loading,setLoading]=useState(true)
 const [state,setState] = useState([])

 useEffect(() => {
    Api.get('/interview/all').then((res) => {
      setLoading(false)
      console.log(res.data.message);
      setState(res.data.message)
    })
 },[])

 function getString(participants){
    var str=""
     for(var i =0;i<participants.length;i++){
         str+=participants[i].email+", \n"
     }
     return str
 }

 return (
    <div className="all-interviews">
        <Backdrop className={classes.backdrop} open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell >Interview Id </TableCell>
              <TableCell >Start Date</TableCell>
              <TableCell >End Date</TableCell>
              <TableCell >Participants</TableCell>
              <TableCell >Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.interview_id}
                </TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.end_date}</TableCell>
                <TableCell>{getString(row.participants)}</TableCell>
                <TableCell><IconButton onClick={() => {window.location.href=`/edit/${row.interview_id}`}}><EditIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default All;
