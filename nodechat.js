/*
Copyright (c) Lightstreamer Srl

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
  net = require('./robustconnect'),
  inspect = require('util').inspect,
  commandLineArgs = require('command-line-args'),

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
  
  const optionDefinitions = [
    { name: 'host', type: String },
    { name: 'tls', type: Boolean, defaultOption: false },
    { name: 'metadata_rrport', type: Number },
    { name: 'data_rrport', type: Number },
    { name: 'data_notifport', type: Number },
    { name: 'user', type: String },
    { name: 'password', type: String }
  ];
  
  const options = commandLineArgs(optionDefinitions);

  var credentials;
  if (options.user != null) {
    credentials = { user: options.user, password: options.password };
  } else {
    credentials = null;
  }

// Create socket connections
net.createConnection(options.data_rrport, options.host, options.tls, function(stream) {
  reqRespStream = stream;
  if(notifyStream) {
    initDataProvider();
  }
});
net.createConnection(options.data_notifport, options.host, options.tls, function(stream) {
  notifyStream = stream;
  if(reqRespStream) {
    initDataProvider();
  }
});
net.createConnection(options.metadata_rrport, options.host, options.tls, function(stream) {
  metadataStream = stream;
  initMetadataProvider();
});


function initDataProvider() {
  //Create the data provider object from the lightstreamer module
  dataProvider = new DataProvider(reqRespStream, notifyStream, null, credentials);
    // the "credentials" parameter is ignored by SDK version prior to 1.5
  
  //Handle subscribe event
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
}

function initMetadataProvider() {
  // Create the metadata provider object from the lightstreamer module
  metadataProvider = new MetadataProvider(metadataStream, {
    distinctSnapLen: 30,
    itemAllowedModes: {distinct: true},
    userAllowedModes: {distinct: true},
  }, credentials);
    // the "credentials" parameter is ignored by SDK version prior to 1.5

  // The default management of getItems and getSchema, which treats
  // group and schema names as comma-separated lists, is suitable
  // for this demo

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

  // Handle any incoming message and push it to the chat_room item
  metadataProvider.on('notifyUserMessage', function(request, response) {
    console.log("New user message: " + inspect(request));
    if (!subscribed) {
      response.error("Unexpected message", "notification");
      return;
    }
    if (!sessions[request.sessionId]) {
      response.error("Session lost! Please reload the browser page(s).", "notification");
      return;
    }
    var session = sessions[request.sessionId];
    var userMessage = request.userMessage.split("|")[1];
    dataProvider.update("chat_room", false, {
      'raw_timestamp': new Date().getTime() + '',
      'IP': session.REMOTE_IP,
      'nick': session.USER_AGENT,
      'message': userMessage
    });
    response.success();
  });
}

