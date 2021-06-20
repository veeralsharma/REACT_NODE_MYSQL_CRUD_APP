const db = require("../db/database");
var fetch = require("node-fetch");
var globals = require("../global");
var dateFormat = require("dateformat");
var email = require('../email')


module.exports = function (params) {
  const app = params.api;

  app.post("/create", async (req, res) => {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var participants = req.body.participants;
    console.log(req.body);
    var check = await checkAvailability(start_date, participants);
    if (!check) {
      res.send({
        status: 200,
        message: "Slots not available for selected participants",
      });
    } else {
      var interview_id = await createInterview(start_date, end_date);
      try {
        for (var i = 0; i < participants.length; i++) {
          await createInterviewForParticipant(interview_id, participants[i]);
        }
        res.send({
          status: 200,
          message: "Created",
        });
      } catch (error) {
        res.send({
          status: 500,
          message: error.message,
        });
      }
    }
  });

  app.post("/slot/exist", async (req, res) => {
    var start_date = req.body.start_date;
    var participant = req.body.participant;
    var sql = `SELECT * from interview_list JOIN interview ON interview_list.interview_id = interview.interview_id 
    WHERE user_id = ${participant}  and start_date <= '${start_date}' and end_date >= '${start_date}' `;
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        res.send({
          status: 200,
          message: result,
        });
      }
    });
  });

  app.post("/exist", async (req, res) => {
    var interview_id = req.body.interview_id;
    var participant = req.body.participant;
    var sql = `SELECT * from interview_list JOIN users on users.user_id = interview_list.user_id WHERE email = '${participant}'  and interview_id = ${interview_id} `;
    console.log(sql);
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        console.log(result);
        res.send({
          status: 200,
          message: result,
        });
      }
    });
  });

  app.post("/create/single", async (req, res) => {
    var startdate_slot = new Date(req.body.startdate);
    var enddate_slot = new Date(req.body.enddate);
    var start_date = dateFormat(startdate_slot, "yyyy-mm-dd HH:MM:ss");
    var end_date = dateFormat(enddate_slot, "yyyy-mm-dd HH:MM:ss");
    var sql = `INSERT INTO interview (start_date,end_date,status) value ('${start_date}','${end_date}','Scheduled' )`;
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        res.send({
          status: 200,
          message: result.insertId,
        });
      }
    });
  });

  app.put("/update", async (req, res) => {
    var startdate_slot = new Date(req.body.start_date);
    var enddate_slot = new Date(req.body.end_date);
    var start_date = dateFormat(startdate_slot, "yyyy-mm-dd HH:MM:ss");
    var end_date = dateFormat(enddate_slot, "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE interview set start_date='${start_date}',end_date='${end_date}' where interview_id = ${req.body.interview_id}`;
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        res.send({
          status: 200,
          message: "Updated",
        });
      }
    });
  });

  app.post("/create/list", async (req, res) => {
    var interview_id = req.body.interview_id;
    var participant_id = req.body.participant_id;
    console.log(req.body);
    var sql = `INSERT INTO interview_list (interview_id,user_id) value (${interview_id},${participant_id})`;
    db.query(sql, function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        res.send({
          status: 200,
          message: result.insertId,
        });
      }
    });
  });

  app.get("/listitem/:id", async (req, res) => {
    var sql = `SELECT * from interview_list JOIN users on interview_list.user_id = users.user_id where interview_id = ${req.params.id}`;
    db.query(sql, async function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        res.send({
          status: 200,
          message: result,
        });
      }
    });
  });

  app.get("/all", async (req, res) => {
    var date = Date.now();
    var current = dateFormat(date, "yyyy-mm-dd HH:MM:ss");
    var sql = `SELECT * from interview where start_date >= '${current}'`;
    db.query(sql, async function (err, result) {
      if (err) {
        console.log(err);
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        if (result.length == 0) {
          res.send({
            status: 200,
            message: "no interviews exist",
          });
        } else {
          var response = [];
          for (var i = 0; i < result.length; i++) {
            var interview_items = await findInterviewItems(
              result[i].interview_id
            );
            response.push({
              interview_id: result[i].interview_id,
              start_date:dateFormat(new Date(result[i].start_date), "yyyy-mm-dd HH:MM:ss"),
              end_date:dateFormat(new Date(result[i].end_date), "yyyy-mm-dd HH:MM:ss"),
              participants: interview_items,
            });
          }
          res.send({
            status: 200,
            message: response,
          });
        }
      }
    });
  });

  app.get("/all/:id", async (req, res) => {
    var date = Date.now();
    var current = dateFormat(date, "yyyy-mm-dd HH:MM:ss");
    var sql = `SELECT * from interview where interview_id=${req.params.id} and start_date >= '${current}'`;
    db.query(sql, async function (err, result) {
      if (err) {
        res.send({
          status: err.code,
          message: err.message,
        });
      } else {
        if (result.length == 0) {
          res.send({
            status: 200,
            message: "no interviews exist",
          });
        } else {
          var response = [];
          for (var i = 0; i < result.length; i++) {
            var interview_items = await findInterviewItems(
              result[i].interview_id
            );
            response.push({
              interview_id: result[i].interview_id,
              start_date:dateFormat(new Date(result[i].start_date), "yyyy-mm-dd HH:MM:ss"),
              end_date:dateFormat(new Date(result[i].end_date), "yyyy-mm-dd HH:MM:ss"),
              participants: interview_items,
            });
          }
          res.send({
            status: 200,
            message: response,
          });
        }
      }
    });
  });

  app.put("/edit", async (req, res) => {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var participants = req.body.participants;
    console.log(req.body);
    var check = await checkAvailability(start_date, participants);
    console.log("Availability issue "+check);
    if (!check) {
      res.send({
        status: 200,
        message: "Slots not available for selected participants",
      });
    } else {
      var interview_id = req.body.interview_id;
      for (var i = 0; i < participants.length; i++) {
        var check= await InterviewExist(participants[i], interview_id)
        console.log("For "+participants[i]+" "+check);
        if (!check) {
          console.log("here");
          await createInterviewForParticipant(interview_id, participants[i]);
        }
      }
      try {
        await updateInterview(interview_id, start_date, end_date);
        res.send({
          status: 204,
          message: "Update",
        });
      } catch (error) {
        res.send({
          status: 500,
          message: error.message,
        });
      }
    }
  });

  /////////////////////////////////////////////////////HELPER FUNCTIONS /////////////////////////////////////////////////////////

  async function findInterviewItems(interview_id) {
    var result = await fetch(
      `${globals.domainUrl}/interview/listitem/${interview_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    return result.message;
  }

  async function updateInterview(interview_id, start_date, end_date) {
    var obj = {
      interview_id: interview_id,
      start_date: start_date,
      end_date: end_date,
    };
    var result = await fetch(`${globals.domainUrl}/interview/update`, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    return result.message;
  }

  async function createParticipant(email, username) {
    var obj = {
      email: email,
      username: username,
    };
    var result = await fetch(`${globals.domainUrl}/user/add`, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    return result.message;
  }

  async function checkAvailability(start_date, participants) {
    for (var i = 0; i < participants.length; i++) {
      var p = await getParticipant(participants[i]);
      if (p) {
        var pid = p.user_id;
        var check = await slotExist(pid, start_date);
        if (check == true) {
          return false;
        }
      } else {
        var pid = await createParticipant(
          participants[i],
          participants[i].split("@")[0]
        );
      }
    }
    return true;
  }

  async function InterviewExist(participant, interview_id) {
    var itv = {
      participant: participant,
      interview_id: interview_id,
    };
    var result = await fetch(`${globals.domainUrl}/interview/exist`, {
      method: "POST",
      body: JSON.stringify(itv),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
      console.log("For "+participant);
      console.log(result);
    return result.message.length > 0 ? true : false;
  }

  async function slotExist(participant, start_date) {
    var itv = {
      start_date: start_date,
      participant: participant,
    };
    var result = await fetch(`${globals.domainUrl}/interview/slot/exist`, {
      method: "POST",
      body: JSON.stringify(itv),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    return result.message.length > 0 ? true : false;
  }

  async function createInterviewForParticipant(
    interview_id,
    participant_email
  ) {
    var p = await getParticipant(participant_email);
    var itv = {
      interview_id: interview_id,
      participant_id: p.user_id,
    };
    var result = await fetch(`${globals.domainUrl}/interview/create/list`, {
      method: "POST",
      body: JSON.stringify(itv),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    await email.data.sendConfirmationMail(p.email,p.username);
    return result.message;
  }

  app.get("/test",async (req,res) => {
    await email.data.sendConfirmationMail("veeralsharma0001@gmail.com","veeral")
    res.send("OK")
  })

  async function getParticipant(participant_email) {
    var body = {
      email: participant_email,
    };
    var result = await fetch(`${globals.domainUrl}/user/get/email`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    return result.message;
  }

  async function createInterview(start_date, end_date) {
    var itv = {
      startdate: start_date,
      enddate: end_date,
    };
    var result = await fetch(`${globals.domainUrl}/interview/create/single`, {
      method: "POST",
      body: JSON.stringify(itv),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    return result.message;
  }
};
