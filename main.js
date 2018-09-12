const COLLECTION = 'tool_logs';
const auth = require('./auth.json');
const filepath = `${__dirname}/backups`;

const admin = require('firebase-admin');
const fs = require('file-system');
const moment = require('moment');

admin.initializeApp({
  credential: admin.credential.cert(auth),
  databaseURL: "https://katana-24a36.firebaseio.com"
});

// Backwards compatability with Firestore's new timestamp storage rules
admin.firestore().settings({
  timestampsInSnapshots: true
});

const collectionRef = admin.firestore().collection(COLLECTION);

/**
 * createBackups()
 * 
 * This function makes the api calls needed to obtain the stuff needed.
 * and stores them in a specific directory
 **/
async function createBackups() {
  let offset = 0;
  let stagger = true;

  try {
    //stagger the backup of the entire database - don't want to overflow the server with requests
    //offset allows us to continue at the spot where we end the previous request
    while (stagger) {
      console.log(`Retrieving...`);
      let requests = await collectionRef.limit(500).offset(offset).get();

      //process each document and write them as json file in computer
      requests.forEach(request => {
        offset++;
        fs.writeFile(createName(request),
          JSON.stringify(request.data()),
          (err) => {
            if (err) throw err;
          });
        console.log(`${request.id} successfully written. Offset: ${offset}.`);
      });
      //test to see if we reached the end
      if (offset % 500 !== 0) stagger = false;

      //keep user up to date
      console.log((stagger) ? 'Batch completed.' : 'Backup completed.');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

/**
 * createBackups()
 * @param {string} request formats the string for the filename in
 * 
 * This function makes the api calls needed to obtain the stuff needed.
 * and stores them in a specific directory
 **/
function createName(request) {
  return `${filepath}/${request.id}_${moment().format('ll')}.json`;
}

//start here
createBackups();