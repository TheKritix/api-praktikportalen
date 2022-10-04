const express = require('express');

const router = express.Router();

router.get('/test', async (req, res, next) => {
    try {
      console.log(req.headers["x-real-ip"])
      let results = "this is text message"
      res.json(results);
  
    }
    catch(e){
      console.log(e)
      res.sendStatus(500)
    }
  });

  module.exports = router;