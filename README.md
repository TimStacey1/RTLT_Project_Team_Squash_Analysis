# squash-match-analysis

The application consists of an Express server (analysis-tool-server) and a React client (analysis-tool-front-end).

## Prerequisites:
* The server requires a .env environment file with a single variable, 'MONGO_URI', to which a MongoDB application URI is required to be assigned. Ex: MONGO_URI='your_mongo_db_uri'.
* The server has been configured to run on port 3001 and the client on port 3000. These ports would need to be free of any other process in order to run the applications. Alternatively, both applications can be configured to run on a custom port.

## Installation steps:
* Clone the repository onto your device.

### Server:
* Run the command 'npm install' at the root of the server, 'analysis-tool-server'.
* Once all dependencies are done installing, run 'npm start' to start up the server on port 3001.

### Client:
* Run the command 'npm install' at the root of the client, 'analysis-tool-front-end'.
* Once all dependencies are done installing, run 'npm start' to start up the server on port 3000.
* On server start, you should be automatically navigated to the application in your browser. If this does not occur, open up your browser and navigate to [http://localhost:3000](http://localhost:3000).
