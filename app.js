const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cron = require("node-cron");
const TokenId = require("./model/tokenid");
const axios = require("axios");
const dbTokenId = require("./config/keys").dbTokenId;

const tokenIdRoute = require("./routes/api/tokenId");
const searchRoute = require("./routes/api/search");

const app = express();

//body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("mongoDB Connected"))
  .catch(err => console.log(err));

cron.schedule("*/60 * * * *", () => {
  TokenId.findById(dbTokenId).then(token => {
    const auth = {
      ClientId: "ApiIntegrationNew",
      UserName: "Save",
      Password: "Save@1234",
      EndUserIp: "192.168.0.100"
    };
    axios
      .post(
        "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
        auth
      )
      .then(response => {
        const newtoken = response.data.TokenId;
        token.tokenId = newtoken;
        token.save().then(response => console.log(response));
      })
      .catch(err => console.log(err.response.data));
  });
});

app.use("/api/tokenid", tokenIdRoute);
app.use("/api/search", searchRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
