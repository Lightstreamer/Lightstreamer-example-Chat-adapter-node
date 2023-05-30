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

var RETRY_TIMEOUT = 4000;

exports.createConnection = function(port,host,isTls,readyCb,errorCb,timeout) {
  timeout = timeout ||  RETRY_TIMEOUT;
  
  var ready = false;
  
  var interval = setInterval(function(){
    if (ready) {
      clearInterval(interval);
    } else {
      var connector = (isTls ? require("tls") : require("net"));
      var stream = connector.connect(port,host,function() {
        ready = true;
        console.log("Connection ready on port " + port + ".");
        readyCb(stream);
      });
      
      stream.on("error",function(e) {
        if (errorCb) {
          errorCb(e);
        }
        if (ready) {
            // communication issue
            console.log("Connection closed on port " + port + ": " + e.message);
        } else {
            // connection issue
            console.log(e.message + "; will retry.");
            // wait next interval
        }
      });
    } 
  },RETRY_TIMEOUT);
};
    
    
   