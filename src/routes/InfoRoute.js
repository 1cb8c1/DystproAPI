//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const xml = require("xml");

//SETTING UP ROUTER
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

//ROUTES
router.get("/", async (req, res, next) => {
  const xmlDoc = xml({
    info: [
      {
        authors: [
          {
            author: "BMotyl",
          },
          {
            author: "MMichalec",
          },
        ],
      },
      { version: ["1.0"] },
    ],
  });

  res.set("Content-type", "text/xml");
  res.send(xmlDoc);
});

//EXPORTS
module.exports = router;
