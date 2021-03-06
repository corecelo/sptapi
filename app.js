const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cron = require("node-cron");
const TokenId = require("./model/tokenid");
const axios = require("axios");
const ip = require("ip");
const cors = require("cors");
const dbTokenId = require("./config/keys").dbTokenId;

const userIp = ip.address();

// Loading All Routes
const tokenIdRoute = require("./routes/api/tokenId");
const searchRoute = require("./routes/api/search");
const farerulesRoute = require("./routes/api/farerules");
const farequoteRoute = require("./routes/api/farequote");
const ssrRoute = require("./routes/api/ssr");
const bookRoute = require("./routes/api/book");
const ticketRoute = require("./routes/api/ticket");
const getbookingdetailsRoute = require("./routes/api/getbookingdetails");

const app = express();

// CORS
app.use(cors());

//body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// MongoDb Mlab Login Link (Not Required in production)
const db = require("./config/keys").mongoURI;

// Loading the connection of mongoose with mongo db
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("mongoDB Connected"))
  .catch(err => console.log(err));

// Cron Job for getting TokenId of agency
cron.schedule("*/120 * * * *", () => {
  // Finding the available TokenId from the database
  TokenId.findById(dbTokenId)
    .then(token => {
      // Authenticating Agegency (Secret value)
      const auth = {
        ClientId: "ApiIntegrationNew",
        UserName: "Save",
        Password: "Save@1234",
        EndUserIp: userIp
      };
      // Makeing the request for getting TokenId
      axios
        .post(
          "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
          auth
        )
        .then(response => {
          const newtoken = response.data.TokenId;
          token.tokenId = newtoken;
          // Saving the response to database again
          token.save().then(response => console.log(response));
        })
        .catch(err => console.log(err.response.data));
    })
    .catch(err => console.log(err));
});

// API Endpoinnt - /
// Type Of Request - get
// Access - Public
// Discription - Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Working Route With HTTPS, Project Will Get Compeleted Soon"
  });
});

// Getting the roites ready
// **Route For Developer only**
app.use("/api/tokenid", tokenIdRoute);
app.use("/api/search", searchRoute);
app.use("/api/farerules", farerulesRoute);
app.use("/api/farequote", farequoteRoute);
app.use("/api/ssr", ssrRoute);
app.use("/api/book", bookRoute);
app.use("/api/ticket", ticketRoute);
app.use("/api/getbookingdetails", getbookingdetailsRoute);

// Setting the port
const port = process.env.PORT || 5000;

// Firing the  Srever
app.listen(port, () => console.log(`Server is running on port ${port}`));
