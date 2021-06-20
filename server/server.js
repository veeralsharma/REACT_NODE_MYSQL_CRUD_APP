const express = require("express");
require('dotenv').config()
// Create connection
require("./db/database");

const app = express();

var cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

var Api = express.Router();

app.use("/", Api);
const params = {
  api: Api,
};

require("./routes/api")(params);

app.listen(process.env.PORT || "5000", () => {
  console.log("Server started on port 5000");
});

