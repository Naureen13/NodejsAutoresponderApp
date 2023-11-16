const { google } = require('googleapis');
const { gmail } = require('googleapis/build/src/apis/gmail');
const base64=require('base-64');
const utf8=require('utf8');

async function getMessages(oAuth2Client){
    try{
    const gmail =  google.gmail({ version: 'v1', auth: oAuth2Client });
    const userId='me';
    const res =  await gmail.users.threads.list({userId});
    // console.log(res.data);
    const allthreads= res.data.threads;
        if(allthreads.length){
            for(const thread of allthreads){
                const thread_id= thread.id;
                const response=await gmail.users.threads.get({userId,id:thread_id});                   // console.log(response.data); //returns all the gmail threads along with data          
                if (response.data.messages && response.data.messages.length==1) {
                    const labelsArray=response.data.messages[0].labelIds;                                                                                    // console.log(response.data.messages);                                                                                                    // console.log(labelsArray);
                        if(!isReplyByUser(labelsArray)){
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
//     const heads= response.data.messages[0].payload.headers;
//     // const label = labels.data.labels.find(l => l.name === labelName);
//     const toHeader=heads.find(h=>h.name==='To');
//     const FromHeader=heads.find(h=>h.name==='From');
//     const subjectHeader=heads.find(h=>h.name==='Subject');
//     const inReplyTo=heads.find(h=>h.name==='Message-ID');

//     const replyMessage="India VS New Zealand";
//     const replyTo= FromHeader.value;
//     const replyFrom=toHeader.value;
//     const replySubject=`${subjectHeader.value}`;
//     const inreplytomsg=inReplyTo.value;
//     const rawMessage= createmsg(replyTo,replyFrom,replySubject,inreplytomsg,replyMessage);
    

//     // console.log(toHeader.value);
//     // console.log(FromHeader.value);
//     // console.log(subjectHeader.value);
//     const res = await gmail.users.messages.send({
//         userId: userId,
//         resource: {
//             raw: rawMessage,
//             threadId: thread_id,
//         },
//     });

//     console.log(res.data);
    
// }     

// function createmsg(to,from,subject,inreplytomsg,body){
//     const rawMessage = `In-Reply-To: ${inreplytomsg}\r\n` +
//                        `References: ${inreplytomsg}\r\n`+
//                        `From: ${from}\r\n` +
//                        `Subject: ${subject}\r\n` +
//                        `To: ${to}\r\n` +
//                        'Content-Type: text/plain; charset=utf-8\r\n' +
//                        '\r\n' +
//                        `${body}`;

//     const encodedMsg=Buffer.from(rawMessage).toString('base64');
//     return encodedMsg;
}
 








// async function addLabel(gmail, message_id, labelName) {
//         // Create the label if it doesn't exist
//         const labels = await gmail.users.labels.list({ userId: 'me' });
//         const label = labels.data.labels.find(l => l.name === labelName);
      
//         if (!label) {
//           await gmail.users.labels.create({
//             userId: 'me',
//             requestBody: {
//               name: labelName,
//               labelListVisibility: 'labelShow',
//               messageListVisibility: 'show',
//             },
//           });
//         }
      
//         // Add label to the email
//         await gmail.users.messages.modify({
//           userId: 'me',
//           id: message_id,
//           requestBody: {
//             addLabelIds: [labelName],
//           },
//         });
      
//         console.log('Label added:', labelName);
//       }


   
module.exports = {getMessages};
