const COLLECTION = 'tool_logs';

const admin = require('firebase-admin');
const fs = require('file-system');
const moment = require('moment');
const auth = require('./auth.json');
const filepath = `${__dirname}/backups`;

admin.initializeApp({
  credential: admin.credential.cert(auth),
  databaseURL: "https://katana-24a36.firebaseio.com"
});

const collectionRef = admin.firestore().collection(COLLECTION);

//TODO: remove backups folder to get updated copies

async function createBackups() {
  let offset = 0;
  let stagger = true;

  try {
    while (stagger) {
      console.log(`Retrieving...`);
      let requests = await collectionRef.limit(500).offset(offset).get();

      requests.forEach(request => {
        offset++;
        fs.writeFile(createName(request),
          JSON.stringify(request.data()),
          (err) => {
            if (err) throw err;
          });
        // console.log(`${request.id} successfully written. Offset: ${offset}.`);
      });
      if (offset % 500 !== 0) stagger = false;

      console.log((stagger) ? 'Batch completed.' : 'Backup completed.');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

function createName(snapshot) {
  return `${filepath}/${snapshot.id} ${moment().format('ll')}.json`;
}

createBackups();