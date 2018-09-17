const COLLECTION = 'tool_logs';
const auth = require('./auth.json');
const filepath = `${__dirname}/backups`;

const admin = require('firebase-admin');
const fs = require('file-system');
const moment = require('moment');
const glob = require('glob');

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

        backup(request, (err) => {
          //test to see if we reached the end
          if (offset % 500 !== 0) stagger = false;

          //keep user up to date
          console.log((stagger) ? 'Batch completed.' : 'Backup completed.');
        });
      });
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

/**
 * backup()
 * @param {DocumentSnapshot} request specific document from collection
 * @param {callback} backupCallback callback
 * 
 * Every file on the database will need to be deleted but this function
 * ensures that the file is already backed up on the computer before 
 * deleting. This is how we are backing up the data on the database.
 **/
function backup(request, backupCallback) {
  glob(`backups/${request.id}_*.json`, (err, files) => {
    if (err) {
      backupCallback(err);
      return;
    }

    //file does not exist so write and delete.
    if (files.length < 1) {
      fs.writeFile(createName(request),
        JSON.stringify(request.data()),
        (err) => {
          if (err) throw err;
        });
      console.log(`${request.id} successfully backed up.`);
      //file exists so just delete.
    } else {
      console.log(`${request.id} already backed up so moving on to deletion.`);
    }

    request.ref.delete();
    console.log(`${request.id} successfully deleted.`);

    backupCallback(null);
  });
}

/**
 * createName()
 * @param {string} request formats the string for the filename in
 * 
 * This function returns the proper name for the file name to be stored
 * inside backups folder.
 **/
function createName(request) {
  return `${filepath}/${request.id}_${moment().format('ll')}.json`;
}

createBackups();