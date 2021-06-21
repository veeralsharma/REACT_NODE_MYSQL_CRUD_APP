import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import Grid from "@material-ui/core/Grid";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Api from '../../Axios'
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  submit: {
    marginTop: "2vh",
    color: "#FAFAFA",
    backgroundColor: "#1A2631",
    borderRadius: "24px",
    padding: "10px 0",
  },
  input: {
    marginTop: "2vh",
    marginBottom: "2vh",
    zIndex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Create() {
    const [startDate, setStartDate] = useState(null);
  const [loading,setLoading]=useState(false)
  const [endDate, setEndDate] = useState(null);
  const [participants, setParticipants] = useState("");

  function handleFormSubmit() {
      setLoading(true)
      if(startDate && endDate && participants ){
        if( endDate<startDate){
            alert("Select Valid Start and End date")
            setLoading(false)
        }else{
          var start_date=moment(startDate._d).format('YYYY-MM-DD HH:mm:ss')
          var end_date=moment(endDate._d).format('YYYY-MM-DD HH:mm:ss')
            var participant_list=participants.split(",")
            if(participant_list.length<2){
                alert("Minimum number of participatns should be 2")
                setLoading(false)
            }else{
                var body={
                    start_date:start_date,
                    end_date:end_date,
                    participants:participant_list
                }
                Api.post('/interview/create',body).then((res) => {
                  if(res.data.status==200){
                    setLoading(false)
                    window.location.href="/"
                  }else{
                    alert(res.data.message)
                    setLoading(false)
                  }
                })
            }
        }
      }else{
        alert("Complete the form and try again")
        setLoading(false)
      }    
  }

  const classes = useStyles();
  return (
    <div className="create-interviews">
      <h2 className="text">Create Interview</h2>
      <Backdrop className={classes.backdrop} open={loading} >
      <CircularProgress color="inherit" />
      </Backdrop>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              className={classes.input}
              type="text"
              label="Email Addresses "
              autoComplete="email"
              value={participants}
              onChange={(event) => setParticipants(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          Start Date Time
            <Datetime value={startDate} onChange={(e) => setStartDate(e)}  />
          </Grid>
          <Grid item xs={12} sm={6}>
          End Date Time
            <Datetime value={endDate} onChange={(e) => setEndDate(e) }  />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          className={classes.submit}
          onClick={handleFormSubmit}
        >
          Create Interview
        </Button>
      </form>
    </div>
  );
}

export default Create;
