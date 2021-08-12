const express = require("express");
const request = require("request");
const https = require("https");
require('dotenv').config()

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use('*/css', express.static('public/css'));
app.use('*/images', express.static('public/images'));
//app.use('*/css', express.static('public/css'));

app.get("/", function (req, res) {
   res.sendFile(__dirname + "/signup.html");
});

app.post("", function (req, res) {
   const fname = req.body.fname;
   const lname = req.body.lname;
   const email = req.body.email;

   const data = {
      members: [
         {
            email_address: email,
            status: "subscribed",
            merge_feilds: {
               FNAME: fname,
               LNAME: lname
            }
         }
      ]
   }

   const jasonData = JSON.stringify(data);
   const api_key = process.env.API_KEY;
   const list_id = process.env.LIST_ID;

   const url = "https://us5.api.mailchimp.com/3.0/lists/" + list_id;

   const options = {
      method: "POST",
      auth: "nishant:" + api_key
   }

   const request = https.request(url, options, function (response) {

      var check = response.statusCode;
      if (check === 200){
         res.sendFile(__dirname + "/success.html");
      }
      else
         res.sendFile(__dirname + "/failure.html")

      response.on("data", function (data) {
         console.log(JSON.parse(data));

      });
   });
   request.write(jasonData);
   request.end();
});

app.listen(process.env.PORT || 3000, function () {
   console.log("Server started");
});
