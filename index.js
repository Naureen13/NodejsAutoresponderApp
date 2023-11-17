const express = require('express');
const { google } = require('googleapis');
const {authorize}=require('./auth');
const {web}=require('./credentials.js');
const dotenv=require('dotenv');
dotenv.config();


const app = express();

//Function to initialize the application
async function initialize(){
    try {
      //authorize the app using the provided credentials
      const oAuth2Client = authorize(web);
      
     //endpoint to handle callback from google oAuth2
      app.get('/oauth2callback', (req, res) => {
        const code = req.query.code;
        res.send(`Authorization code received: ${code}`);
      });
  
      
       console.log("Authorization done. Starting server.");
       app.listen(3000, () => {
        console.log(`Server is running on http://localhost:3000`);
      });


    } catch (err) {
      console.error('Error during initialization:', err);
    }
  };

//call the function to start the application
initialize();
