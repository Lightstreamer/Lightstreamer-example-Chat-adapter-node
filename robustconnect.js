var RETRY_TIMEOUT = 4000;

exports.createConnection = function(port,host,readyCb,timeout) {
  timeout = timeout ||  RETRY_TIMEOUT;
  
  var ready = false;
  
  var interval = setInterval(function(){
    if (ready) {
      clearInterval(interval);
    } else {
      var stream = require('net').connect(port,host,function() {
        ready = true;
        readyCb(stream);
      });
      
      stream.on("error",function() {
        //wait next interval
      });
    } 
  },RETRY_TIMEOUT);
};
    
    
   