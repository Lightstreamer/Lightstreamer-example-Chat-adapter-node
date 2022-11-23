# Lightstreamer - Basic Chat Demo - Node.js Adapter #
<!-- START DESCRIPTION lightstreamer-example-chat-adapter-node -->

The *Lightstreamer Basic Chat Demo* is a very simple chat application, based on [Lightstreamer](http://www.lightstreamer.com) for its real-time communication needs.

This project contains the source code and all the resources needed to deploy on a [Node.js](http://nodejs.org/) instance the Node.js port of the [Lightstreamer - Basic Chat Demo - Java Adapter](https://github.com/Lightstreamer/Lightstreamer-example-Chat-adapter-java).

As an example of a client using this adapter, you may refer to the [Basic Chat Demo - HTML Client](https://github.com/Lightstreamer/Lightstreamer-example-chat-client-javascript) and view the corresponding [Live Demo](http://demos.lightstreamer.com/ChatDemo/).

## Details

This project shows the use of DataProvider and MetadataProvider classes provided in the [Lightstreamer SDK for Node Adapters](https://github.com/Lightstreamer/Lightstreamer-lib-node-adapter). For more details, see [Node.js Interfaces](https://github.com/Lightstreamer/Lightstreamer-example-HelloWorld-adapter-node#nodejs-interfaces) in [Lightstreamer - "Hello World" Tutorial - Node.js Adapter](https://github.com/Lightstreamer/Lightstreamer-example-HelloWorld-adapter-node) 

### Dig the Code

The project consists of two JavaScript source files:
* `nodechat.js`, contains the code for the Chat Data and Metadata Adapter;
* `robustconnect.js`, manages the connection to the Proxy Adapter.

#### The Adapter Set Configuration
This Adapter Set is configured and will be referenced by the clients as `PROXY_NODECHAT`.
As *Proxy Data Adapter* and *Proxy MetaData Adapter*, you may configure also the robust versions. The *Robust Proxy Data Adapter* and *Robust Proxy MetaData Adapter* have some recovery capabilities and avoid to terminate the Lightstreamer Server process, so it can handle the case in which a Remote Data Adapter is missing or fails, by suspending the data flow and trying to connect to a new Remote Data Adapter instance. Full details on the recovery behavior of the Robust Data Adapter are available as inline comments within the [provided template](https://lightstreamer.com/docs/ls-ARI/latest/adapter_robust_conf_template/adapters.xml).

The `adapters.xml` file for this demo should look like:

```xml
<?xml version="1.0"?>

<adapters_conf id="PROXY_NODECHAT">
    <metadata_adapter_initialised_first>N</metadata_adapter_initialised_first>
    
    <metadata_provider>
        <adapter_class>ROBUST_PROXY_FOR_REMOTE_ADAPTER</adapter_class>
        <classloader>log-enabled</classloader>
        <param name="request_reply_port">8003</param>
        <param name="timeout">36000000</param>
    </metadata_provider>
    
    <data_provider name="CHAT_ROOM">
        <adapter_class>ROBUST_PROXY_FOR_REMOTE_ADAPTER</adapter_class>
        <classloader>log-enabled</classloader>
        <param name="request_reply_port">8001</param>
        <param name="notify_port">8002</param>
        <param name="timeout">36000000</param>
    </data_provider>
</adapters_conf>
```

<i>NOTE: not all configuration options of a Proxy Adapter are exposed by the file suggested above.
You can easily expand your configurations using the generic template
for [basic](https://lightstreamer.com/docs/ls-ARI/latest/adapter_conf_template/adapters.xml) and [robust](https://lightstreamer.com/docs/ls-ARI/latest/adapter_robust_conf_template/adapters.xml) Proxy Adapters as a reference.</i>

<!-- END DESCRIPTION lightstreamer-example-chat-adapter-node -->

## Install
If you want to install a version of this demo in your local Lightstreamer Server, follow these steps:
* Download *Lightstreamer Server* (Lightstreamer Server comes with a free non-expiring demo license for 20 connected users) from [Lightstreamer Download page](https://lightstreamer.com/download/), and install it, as explained in the `GETTING_STARTED.TXT` file in the installation home directory.
* Get the `deploy.zip` file for the Lightstreamer version you have installed from [releases](https://github.com/Lightstreamer/Lightstreamer-example-chat-adapter-node/releases) and unzip it, obtaining the `deployment` folder.
* Plug the Proxy Data Adapter into the Server: go to the `deployment/Deployment_LS` folder and copy the `ChatAdapterNode` directory and all of its files to the `adapters` folder of your Lightstreamer Server installation.
* Alternatively, you may plug the *robust* versions of the Proxy Data Adapter: go to the `deployment/Deployment_LS(robust)` folder and copy the `ChatAdapterNode` directory and all of its files into the `adapters` folder.
* Install the lightstreamer-adapter module. 
    * Create a directory where to deploy the Node.js Remote Adapter and let call it `Deployment_Node_Remote_Adapter`.
    * Go to the `Deployment_Node_Remote_Adapter` folder and launch the commands:<BR/>
    `> npm install lightstreamer-adapter`<BR/>
    `> npm install command-line-args`<BR/>
    * Download the `nodechat.js` and the `robustconnect.js` files from this project and copy them into the `Deployment_Node_Remote_Adapter` folder.
* Launch Lightstreamer Server. The Server startup will complete only after a successful connection between the Proxy Data Adapter and the Remote Data Adapter.
* Launch the Node.js Remote Adapter: go to the `Deployment_Node_Remote_Adapter` folder and launch:<BR/>
`> node nodechat.js --host localhost --metadata_rrport 8003 --data_rrport 8001 --data_notifport 8002`<BR/>
* Test the Adapter, launching the [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Lightstreamer/Lightstreamer-example-Chat-client-javascript) listed in [Clients Using This Adapter](https://github.com/Lightstreamer/Lightstreamer-example-Chat-adapter-node#clients-using-this-adapter).
    * To make the [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Lightstreamer/Lightstreamer-example-Chat-client-javascript) front-end pages get data from the newly installed Adapter Set, you need to modify the front-end pages and set the required Adapter Set name to PROXY_NODECHAT when creating the LightstreamerClient instance. So edit the `lsClient.js` file of the *Basic Chat Demo* front-end deployed under `Lightstreamer/pages/ChatDemo` and replace:<BR/>
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

### Available improvements

#### Add Encryption

This feature requires Server version 7.1.0 (which corresponded to Adapter Remoting Infrastructure, i.e. Proxy Adapters, 1.9.6) or newer.

Each TCP connection from a Remote Adapter can be encrypted via TLS. To have the Proxy Adapters accept only TLS connections, a suitable configuration should be added in adapters.xml in the <data_provider> block, like this:
```xml
  <data_provider>
    ...
    <param name="tls">Y</param>
    <param name="tls.keystore.type">JKS</param>
    <param name="tls.keystore.keystore_file">./myserver.keystore</param>
    <param name="tls.keystore.keystore_password.type">text</param>
    <param name="tls.keystore.keystore_password">xxxxxxxxxx</param>
    ...
  </data_provider>
```
and the same should be added in the <metadata_provider> block.

This requires that a suitable keystore with a valid certificate is provided. See the configuration details in the [provided template](https://lightstreamer.com/docs/ls-ARI/latest/adapter_robust_conf_template/adapters.xml).
NOTE: For your experiments, you can configure the adapters.xml to use the same JKS keystore "myserver.keystore" provided out of the box in the Lightstreamer distribution. Since this keystore contains an invalid certificate, remember to configure your local environment to "trust" it.
The provided source code is already predisposed for TLS connection on all ports. You can rerun the Node.js Remote Adapter with the new configuration by going to the `Deployment_Node_Remote_Adapter` folder and launching:<BR/>
`> node nodechat.js --host xxxxxxxx --tls --metadata_rrport 8003 --data_rrport 8001 --data_notifport 8002`<BR/>
where the same hostname supported by the provided certificate must be supplied.

#### Add Authentication

This feature is only available in SDK for Node.js Adapters version 1.5 or newer and requires Server version 7.1.0 (which corresponded to Adapter Remoting Infrastructure, i.e. Proxy Adapters, 1.9.6) or newer.

Each TCP connection from a Remote Adapter can be subject to Remote Adapter authentication through the submission of user/password credentials. To enforce credential check on the Proxy Adapters, a suitable configuration should be added in adapters.xml in the <data_provider> block, like this:
```xml
  <data_provider>
    ...
    <param name="auth">Y</param>
    <param name="auth.credentials.1.user">user1</param>
    <param name="auth.credentials.1.password">pwd1</param>
    ...
  </data_provider>
```
and the same should be added in the <metadata_provider> block.

See the configuration details in the [provided template](https://lightstreamer.com/docs/ls-ARI/latest/adapter_robust_conf_template/adapters.xml).
The provided source code is already predisposed for credential submission on both adapters. You can rerun the Node.js Remote Adapter with the new configuration by going to the `Deployment_Node_Remote_Adapter` folder and launching:<BR/>
`> node nodechat.js --host localhost --user user1 --password pwd1 --metadata_rrport 8003 --data_rrport 8001 --data_notifport 8002`<BR/>

Authentication can (and should) be combined with TLS encryption.

## See Also

*    [Lightstreamer SDK for Node Adapters](https://github.com/Lightstreamer/Lightstreamer-lib-node-adapter "Lightstreamer SDK for Node Adapters")

### Clients Using This Adapter
<!-- START RELATED_ENTRIES -->

*    [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Lightstreamer/Lightstreamer-example-Chat-client-javascript)

<!-- END RELATED_ENTRIES -->

### Related Projects

*    [Lightstreamer - Basic Chat Demo - Java Adapter](https://github.com/Lightstreamer/Lightstreamer-example-Chat-adapter-java)
*    [Lightstreamer - "Hello World" Tutorial - Node.js Adapter](https://github.com/Lightstreamer/Lightstreamer-example-HelloWorld-adapter-node)

## Lightstreamer Compatibility Notes

* Compatible with Lightstreamer SDK for Node.js Adapters version 1.3 or newer
- For a version of this example compatible with Lightstreamer SDK for Node.js Adapters version 1.0, please refer to [this tag](https://github.com/Lightstreamer/Lightstreamer-example-Chat-adapter-node/tree/for_Lightstreamer_5.1).
