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
const port = process.env.PORT;
const audienceId = process.env.AUDIENCEID;

// Express app setup
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const run = async () => {
        const response = await client.lists.addListMember(audienceId, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          }
        });
        console.log(response);

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/public/success.html");
          }
          else {
            res.sendFile(__dirname + "/public/failure.html");
          }
      };  

      run();      
});

app.listen(port, function(){
    console.log(`Server started at port ${port}`);
});
