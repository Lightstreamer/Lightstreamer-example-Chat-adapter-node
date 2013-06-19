/*
Copyright 2013 Weswit s.r.l.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var 
  // Imports
  MetadataProvider = require('lightstreamer-adapter').MetadataProvider,
  DataProvider = require('lightstreamer-adapter').DataProvider,
  net = require('net'),
  inspect = require('util').inspect,

  // Remote proxy host and ports
  HOST = 'localhost',
  REQ_RESP_PORT = 8001,
  WRITE_PORT = 8002,
  META_PORT = 8003,

  // Request/response socket channel
  reqRespStream,

  // Push data socket channel
  notifyStream,

  // Metadata socket channel
  metadataStream,

  // The data provider object
  dataProvider,

  // The data provider object
  metadataProvider,

  // JS timer for the simulated data push 
  subscribed = false,

  // User data just for the demo
  sessions = [];

// Create socket connections
reqRespStream = net.createConnection(REQ_RESP_PORT, HOST);
notifyStream = net.createConnection(WRITE_PORT, HOST);
metadataStream = net.createConnection(META_PORT, HOST);

// Create the data provider object from the lightstreamer module
dataProvider = new DataProvider(reqRespStream, notifyStream);

// Create the metadata provider object from the lightstreamer module
metadataProvider = new MetadataProvider(metadataStream, {
  distinctSnapLen: 30,
  itemAllowedModes: {distinct: true},
  userAllowedModes: {distinct: true},
});

// Handle subscribe event
dataProvider.on('subscribe', function(itemName, response) {
  console.log("Subcribed item: " + itemName);
  if (itemName === "chat_room") {
    subscribed = true;
    response.success();    
  } else {
    response.error("No such item", "subscription");
  }
});

// Handle unsubscribe event
dataProvider.on('unsubscribe', function(itemName, response) {
  console.log("Unsubscribed item: " + itemName);
  if (itemName === "chat_room") {
    subscribed = false;
    response.success();
  } else {
    response.error("No such item", "subscription");
  }
});

// Handle new session event and store user session data
metadataProvider.on('notifyNewSession', function(request, response) {
  console.log("New session: " + inspect(request));
  sessions[request.sessionId] = request.contextProperties;
  response.success();    
});

// Handle close session event and remove stored session data
metadataProvider.on('notifySessionClose', function(request, response) {
  console.log("Close session: " + inspect(request));
  delete(sessions[request.sessionId]);
  response.success();    
});

// Handle and incoming message and push it to the chat_room item
metadataProvider.on('notifyUserMessage', function(request, response) {
  console.log("New user message: " + inspect(request));
  if (!subscribed) {
    response.error("Unexpected message", "notification");
  }
  if (!sessions[request.sessionId]) {
    response.error("Session lost! Please reload the browser page(s).", "notification");
  }
  var session = sessions[request.sessionId];
  var userMessage = request.userMessage.split("|")[1];
  dataProvider.update("chat_room", false, {
    'timestamp': new Date().getTime() + '',
    'IP': session.REMOTE_IP,
    'nick': session.USER_AGENT,
    'message': userMessage
  });
  response.success();
});

