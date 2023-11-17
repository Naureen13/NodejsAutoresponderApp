const { google } = require('googleapis');
const { gmail } = require('googleapis/build/src/apis/gmail');
const base64=require('base-64');
const utf8=require('utf8');

async function getMessages(oAuth2Client){
    try{
    const gmail =  google.gmail({ version: 'v1', auth: oAuth2Client });
    const userId='me';
    const res =  await gmail.users.threads.list({userId});    //https://developers.google.com/gmail/api/reference/rest/v1/users.threads
    // console.log(res.data);
    const allthreads= res.data.threads;
        if(allthreads.length){
            for(const thread of allthreads){
                const thread_id= thread.id;
                const response=await gmail.users.threads.get({userId,id:thread_id});// console.log(response.data); //returns all the gmail threads along with data          
                if (response.data.messages && response.data.messages.length==1) {
                    const labelsArray=response.data.messages[0].labelIds; 
                    // console.log(labelsArray);                                 // console.log(response.data.messages);                                                                                                    // console.log(labelsArray);
                        if(!isReplyByUser(labelsArray)){
                            console.log(response.data.messages[0].snippet);
                            await sendReply(gmail,userId,response);   
                        }      
                    }
                else{
                    console.log("This thread has replies. So skipping..");
                }
            };
           
        }else{
            console.log("No Messages Found");
        }

    }catch(error){
        console.error('Eror:', error.message);
      };
};


function isReplyByUser(labelsArray){
    if(labelsArray.includes('SENT')){
        return true;
    }
    return false;
}  

async function sendReply(gmail,userId,response){
    const thread_id=response.data.messages[0].threadId;
    const heads= response.data.messages[0].payload.headers;
    const toHeader=heads.find(h=>h.name==='To');
    const FromHeader=heads.find(h=>h.name==='From');
    const subjectHeader=heads.find(h=>h.name==='Subject');
    const inReplyTo=heads.find(h=>h.name==='Message-ID');

    const replyMessage="Thankyou for this opportunity. I really appreciate your time and effort";
    const replyTo= FromHeader.value;
    const replyFrom=toHeader.value;
    const replySubject=`${subjectHeader.value}`;
    const inreplytomsg=inReplyTo.value;
    const rawMessage= createmsg(replyTo,replyFrom,replySubject,inreplytomsg,replyMessage);
 
    const res = await gmail.users.messages.send({
        userId: userId,
        resource: {
            raw: rawMessage,
            threadId: thread_id,
        },
    });

    const msgId=res.data.id;
    const labelName='BDAY';

   
         await addLabel(gmail,msgId,labelName);
         console.log("The label is addeddd");
   
    // console.log(res.data);
}     

function createmsg(to,from,subject,inreplytomsg,body){
    const rawMessage = `In-Reply-To: ${inreplytomsg}\r\n` +
                       `References: ${inreplytomsg}\r\n`+
                       `From: ${from}\r\n` +
                       `Subject: ${subject}\r\n` +
                       `To: ${to}\r\n` +
                       'Content-Type: text/plain; charset=utf-8\r\n' +
                       '\r\n' +
                       `${body}`;

    const encodedMsg=Buffer.from(rawMessage).toString('base64');
    return encodedMsg;
}


async function addLabel(gmail, message_id, labelName) {
        const labels = await gmail.users.labels.list({ userId: 'me' }); 
        const label = labels.data.labels.find(l => l.name === labelName);
        
      // Create the label if it doesn't exist
        if (!label) {
          const createdLabel=await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
              name: labelName,
              labelListVisibility: 'labelShow',
              messageListVisibility: 'show',
            },
          });
          
          await gmail.users.messages.modify({
          userId: 'me',
          id: message_id,
          requestBody: {
            addLabelIds: [createdLabel.data.id],
          },
        });

        }else{
            await gmail.users.messages.modify({
                userId: 'me',
                id: message_id,
                requestBody: {
                    addLabelIds: [label.id],
                },
            });

            console.log('Label added:', labelName);
        }
      }
 

      function repeatSequence(oAuth2Client) {
        const interval = Math.floor(Math.random() * (120000 - 45000 + 1)) + 45000; // Random interval between 45 to 120 seconds
    
        setTimeout(async () => {
            await getMessages(oAuth2Client);
            repeatSequence(oAuth2Client);
        }, interval);
    }     


   
module.exports = {getMessages,repeatSequence};

















