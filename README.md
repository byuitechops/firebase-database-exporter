# Firebase Database Exporter

## Description

This file executes API calls for Google Cloud Firestore that ends up backing up our files on their databases to our computers. This
file checks to see if it already exists on the computer and then either write it to the computer if it doesn't exist or move onto deletion.
In either case, it will delete the file after checking to see if the file exists.

The `repeat-timer` module has already been added so please refer to [this link](https://github.com/byuitechops/repeat-timer) for more information.

## To Install

Execute `npm install git+https://github.com/byuitechops/firebase-database-exporter.git`.

## Setup

To setup and run an instance of `firebase-database-explorer`, please do the following:

1. Clone the repository, `https://github.com/byuitechops/firebase-database-exporter.git` to desktop.

2. Execute `cd firebase-database-exporter`.

2. In the terminal, execute `npm install`.

3. Retrieve Katana `serviceKey.json` and rename it to `auth.json`. Make sure that `auth.json` lives in the same folder as `main.js`.

4. In the terminal, execute `npm start`.