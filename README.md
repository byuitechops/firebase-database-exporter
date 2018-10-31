# Firebase Database Exporter

## Process

This file executes API calls for Google Cloud Firestore that ends up backing up our files on their databases to our computers. This
file checks to see if it already exists on the computer and then either write it to the computer if it doesn't exist or move onto deletion.
In either case, it will delete the file after checking to see if the file exists.

The `repeat-timer` module has already been added so please refer to [this link](https://github.com/byuitechops/repeat-timer) for more information.

## Setup

To setup and run an instance of firebase-database-explorer, please do the following:

1. In the terminal, execute `npm install`.

2. Retrieve Katana serviceKey.json and rename it to auth.json.

3. In the terminal, execute `npm start`.

