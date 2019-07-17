const express = require("express");
const router = express.Router();
const axios = require("axios");
const ip = require("ip");
const dbTokenId = require("../../config/keys").dbTokenId;
// Token Id for Main Db
const dbTokenIdDEV = require("../../config/keys").dbTokenIdDEV;

// Loading the module TokenId
const TokenId = require("../../model/tokenid");

// API Endpoinnt - api/search
// Type Of Request - POST
// Access - Public
router.post("/", (req, res) => {
  TokenId.findById(dbTokenIdDEV).then(token => {
    req.body.EndUserIp = ip.address();
    req.body.TokenId = token.tokenId;
    console.log('Request Started');
    axios
      .post(
        "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
        req.body
      )
      .then(response => {
        console.log('Request Ended');
        res.json(response.data)
      })
      .catch(err => res.status(404).json(err.response.data));
  });
});

module.exports = router;
