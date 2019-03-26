const express = require("express");
const router = express.Router();
const axios = require("axios");

const TokenId = require("../../model/tokenid");

router.post("/", (req, res) => {
  axios
    .post(
      "http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
      req.body
    )
    .then(response => {
      const newtokenid = new TokenId({
        tokenId: response.data.TokenId
      });
      newtokenid.save().then(response => res.json({ response }));
    })
    .catch(err => console.log(err));
});

module.exports = router;
