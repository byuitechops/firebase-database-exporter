const admin = require('firebase-admin');
const 
const serviceAccount = require('./auth.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://katana-24a36.firebaseio.com"
});

const ref = admin.firestore().collection('tool_logs').doc('0XgRpyLWtsKGuARzYZNK');

var query = ref.get()
               .then(snapshot => {
                console.log(`Data: ${JSON.stringify(snapshot._fieldsProto.course_id)}`);
               })
               .catch(err => console.log(`Error: ${err}`));

