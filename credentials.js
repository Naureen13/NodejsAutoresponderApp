require('dotenv').config();

const clientId = process.env.CLIENT_ID; // Fix the typo
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;


        
    const web={
        "client_id":clientId,
        project_id:"openinapp-404707",
        auth_uri:"https://accounts.google.com/o/oauth2/auth",
        token_uri:"https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
        client_secret:clientSecret,
        redirect_uris:["http://localhost:3000/oauth2callback"],
        javascript_origins:["http://localhost:3000"]
        }


module.exports={web};