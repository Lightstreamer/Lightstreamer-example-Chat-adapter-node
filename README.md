# Lightstreamer - Basic Chat Demo - Node.js Adapter #
<!-- START DESCRIPTION lightstreamer-example-chat-adapter-node -->

The *Lightstreamer Basic Chat Demo* is a very simple chat application, based on [Lightstreamer](http://www.lightstreamer.com) for its real-time communication needs.

This project is a [Node.js](http://nodejs.org/) port of the [Lightstreamer - Basic Chat Demo - Java Adapter](https://github.com/Weswit/Lightstreamer-example-Chat-adapter-java), 
and contains the source code and all the resources needed to deploy on a Node.js instance the Remote Adapters for the "Hello World" Tutorial.

As an example of a client using this adapter, you may refer to the [Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-chat-client-javascript) and view the corresponding [Live Demo](http://demos.lightstreamer.com/ChatDemo/).

## Details

This project shows the use of DataProvider and MetadataProvider classes provided in the [Lightstreamer SDK for Node Adapters](https://github.com/Weswit/Lightstreamer-lib-node-adapter). For more details, see [Node.js Interfaces](https://github.com/Weswit/Lightstreamer-example-HelloWorld-adapter-node#nodejs-interfaces) in [Lightstreamer - "Hello World" Tutorial - Node.js Adapter](https://github.com/Weswit/Lightstreamer-example-HelloWorld-adapter-node) 

### Dig the Code

The project consists of two JavaScript source files:
* `nodechat.js`, contains the code for the Chat Data and Metadata Adapter;
* `robustconnect.js`, manages the connection to the Proxy Adapter.

#### The Adapter Set Configuration
This Adapter Set is configured and will be referenced by the clients as `PROXY_NODECHAT`.
As *Proxy Data Adapter* and *Proxy MetaData Adapter*, you may configure also the robust versions. The *Robust Proxy Data Adapter* and *Robust Proxy MetaData Adapter* have some recovery capabilities and avoid to terminate the Lightstreamer Server process, so it can handle the case in which a Remote Data Adapter is missing or fails, by suspending the data flow and trying to connect to a new Remote Data Adapter instance. Full details on the recovery behavior of the Robust Data Adapter are available as inline comments within the `DOCS-SDKs/sdk_adapter_remoting_infrastructure/conf/sockets(robust)/adapters.xml` file in your Lightstreamer Server installation.

The `adapters.xml` file for this demo should look like:

```xml
<?xml version="1.0"?>

<adapters_conf id="PROXY_NODECHAT">
    <metadata_provider>
        <adapter_class>com.lightstreamer.adapters.remote.metadata.RobustNetworkedMetadataProvider</adapter_class>
        <classloader>log-enabled</classloader>
        <param name="request_reply_port">8003</param>
        <param name="timeout">36000000</param>
    </metadata_provider>
    
    <data_provider name="CHAT_ROOM">
        <adapter_class>com.lightstreamer.adapters.remote.data.RobustNetworkedDataProvider</adapter_class>
        <classloader>log-enabled</classloader>
        <param name="request_reply_port">8001</param>
        <param name="notify_port">8002</param>
        <param name="timeout">36000000</param>
    </data_provider>
</adapters_conf>
```

<!-- END DESCRIPTION lightstreamer-example-chat-adapter-node -->

## Install
If you want to install a version of this demo in your local Lightstreamer Server, follow these steps:
* Download *Lightstreamer Server* (Lightstreamer Server comes with a free non-expiring demo license for 20 connected users) from [Lightstreamer Download page](http://www.lightstreamer.com/download.htm), and install it, as explained in the `GETTING_STARTED.TXT` file in the installation home directory.
* Get the `deploy.zip` file for the Lightstreamer version you have installed from [releases](https://github.com/Weswit/Lightstreamer-example-chat-adapter-node/releases) and unzip it, obtaining the `deployment` folder.
* Plug the Proxy Data Adapter into the Server: go to the `deployment/Deployment_LS` folder and copy the `ChatAdapterNode` directory and all of its files to the `adapters` folder of your Lightstreamer Server installation.
* Alternatively, you may plug the *robust* versions of the Proxy Data Adapter: go to the `deployment/Deployment_LS(robust)` folder and copy the `ChatAdapterNode` directory and all of its files into the `adapters` folder.
* Install the lightstreamer-adapter module. 
    * Create a directory where to deploy the Node.js Remote Adapter and let call it `Deployment_Node_Remote_Adapter`.
    * Go to the `Deployment_Node_Remote_Adapter` folder and launch the command:<BR/>
    `> npm install lightstreamer-adapter`<BR/>
    * Download the `nodechat.js` and the `robustconnect.js` files from this project and copy them into the `Deployment_Node_Remote_Adapter` folder.
* Launch Lightstreamer Server. The Server startup will complete only after a successful connection between the Proxy Data Adapter and the Remote Data Adapter.
* Launch the Node.js Remote Adapter: go to the `Deployment_Node_Remote_Adapter` folder and launch:<BR/>
`> node nodechat.js`<BR/>
* Test the Adapter, launching the [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-Chat-client-javascript) listed in [Clients Using This Adapter](https://github.com/Weswit/Lightstreamer-example-Chat-adapter-node#clients-using-this-adapter).
    * To make the [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-Chat-client-javascript) front-end pages get data from the newly installed Adapter Set, you need to modify the front-end pages and set the required Adapter Set name to PROXY_NODECHAT when creating the LightstreamerClient instance. So edit the `lsClient.js` file of the *Basic Chat Demo* front-end deployed under `Lightstreamer/pages/ChatDemo` and replace:<BR/>
`var lsClient = new LightstreamerClient(protocolToUse+"//localhost:"+portToUse,"CHAT");`<BR/>
with:<BR/>
`var lsClient = new LightstreamerClient(protocolToUse+"//localhost:"+portToUse,"PROXY_NODECHAT");`<BR/>
(you don't need to reconfigure the Data Adapter name, as it is the same in both Adapter Sets).
    * As the referred Adapter Set has changed, make sure that the front-end no longer shares the Engine with other demos.
So a line like this:<BR/>
`lsClient.connectionSharing.enableSharing("ChatDemoCommonConnection", "ATTACH", "CREATE");`<BR/>
should become like this:<BR/>
`lsClient.connectionSharing.enableSharing("RemoteChatDemoConnection", "ATTACH", "CREATE");`
    * Open a browser window and go to: [http://localhost:8080/ChatDemo](http://localhost:8080/ChatDemo)

## See Also

*    [Lightstreamer SDK for Node Adapters](https://github.com/Weswit/Lightstreamer-lib-node-adapter "Lightstreamer SDK for Node Adapters")

### Clients Using This Adapter
<!-- START RELATED_ENTRIES -->

*    [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-Chat-client-javascript)

<!-- END RELATED_ENTRIES -->

### Related Projects

*    [Lightstreamer - Basic Chat Demo - Java Adapter](https://github.com/Weswit/Lightstreamer-example-Chat-adapter-java)
*    [Lightstreamer - "Hello World" Tutorial - Node.js Adapter](https://github.com/Weswit/Lightstreamer-example-HelloWorld-adapter-node)

## Lightstreamer Compatibility Notes
Compatible with Lightstreamer SDK for Node Adapters since 1.1.1
