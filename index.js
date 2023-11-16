const express = require('express');

const {authorize}=require('./auth');
const {credentials}=require('./credentials.js');
const dotenv=require('dotenv');
dotenv.config();


const app = express();

async function initialize(){
    try {
      const oAuth2Client = authorize(credentials);
      
  
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
 
initialize();
