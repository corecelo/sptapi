const express = require("express");
const router = express.Router();
const axios = require("axios");
const ip = require("ip");
const dbTokenId = require("../../config/keys").dbTokenId;

// Loading the module TokenId
const TokenId = require("../../model/tokenid");

// API Endpoinnt - api/farequote
// Type Of Request - POST
// Access - Public
router.post("/", (req, res) => {
  TokenId.findById(dbTokenId).then(token => {
    req.body.EndUserIp = ip.address();
    req.body.TokenId = token.tokenId;
    console.log(req.body);
    axios
      .post(
        "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote",
        req.body
      )
      .then(response => {
        res.json(response.data);
      })
      .catch(err => {
        console.log(err.response.data);
        res.status(404).json(err.response.data);
      });
  });
});

module.exports = router;
