require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const { url } = require("inspector");

// MailChimp setup
client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us21"
  });

const app = express();

// Express app setup
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const run = async () => {
        const response = await client.lists.addListMember("a2306b861c", {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          }
        });
        console.log(response);
      };
      
      run();      
});

app.listen(3030, function(){
    console.log("Server started at port 3030");
});
