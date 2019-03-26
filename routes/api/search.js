const express = require("express");
const router = express.Router();
const axios = require("axios");
const dbTokenId = require("../../config/keys").dbTokenId;

const TokenId = require("../../model/tokenid");

router.post("/", (req, res) => {
  TokenId.findById(dbTokenId).then(token => {
    req.body.TokenId = token.tokenId;
    axios
      .post(
        "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
        req.body
      )
      .then(response => res.json(response.data))
      .catch(err => res.status(404).json(err.response.data));
  });
});

module.exports = router;
