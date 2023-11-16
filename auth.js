const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const { OAuth2Client } = require('google-auth-library');
const {getMessages}=require('./gmail');


const {web}=require('./credentials.js');

const TOKEN_PATH='token.json';    //Place where access tokens will be stored
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];  //https://developers.google.com/gmail/api/auth/scopes  


// https://github.com/googleapis/google-api-nodejs-client#authentication-and-authorization
async function authorize(credentials){
    console.log(credentials);
    const { client_id, client_secret,redirect_uris} = web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret, 
        redirect_uris
      );

      try {;
        const token = await new Promise((resolve, reject) => {
            fs.readFile(TOKEN_PATH, 'utf8',(err,data)=>{
                if (err) reject(err);
                else resolve(data);
            });
        });
        if (!token.trim()) {
          console.log("Token file is empty. Getting access token.");
          return getAccessToken(oAuth2Client);
        }
    
        const parsedToken = JSON.parse(token);
        oAuth2Client.setCredentials(parsedToken);
        console.log("Credentials set from token file.");
        return getMessages(oAuth2Client);
      }
      catch (err) {
        if (err.code === 'ENOENT') {
          console.log("Token file not found. Getting access token.");
          return getAccessToken(oAuth2Client);
        } else {
          console.error('Error reading token file', err);
          throw err;
        }
      }
    }


       


async function getAccessToken(oAuth2Client){
    const authUrl= oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope:SCOPES,
    });
    console.log('Authorize this app by visiting this url',authUrl);

    const rl=readline.createInterface({      //creates a readline interface to get input from the user through cmd
        input:process.stdin,
        output:process.stdout
    });
    const code = await new Promise((resolve) => {
        rl.question('Enter the code from the page here:', (input) => {
          rl.close();
          resolve(input);
        });
      });
      
        // Exchange authorizatuon code for access token
        try {
            const {tokens}  = await oAuth2Client.getToken(code);
            console.log('Token retrieved:', tokens);
        
            oAuth2Client.setCredentials(tokens);
            await fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('Token stored to', TOKEN_PATH);
            return getMessages(oAuth2Client);
          } catch (err) {
            console.error('Error retrieving access token', err);
            throw err;
          }
        
    
}


module.exports={
    authorize
};
