# Lightstreamer - Basic Chat Demo - Node.js Adapter #
<!-- START DESCRIPTION lightstreamer-example-chat-adapter-node -->

The Lightstreamer Basic Chat Demo is a very simple chat application based on Lightstreamer.
This project includes an example Lightstreamer remote chat adapter to be deployed on a node instance.

## Details
As example of a client using this adapter, you may refer to the [Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-chat-client-javascript) and view the corresponding [Live Demo](http://demos.lightstreamer.com/ChatDemo/).

This project shows the use of DataProvider and MetadataProvider classes provided in the [lightstreamer-adapter node module](https://github.com/Weswit/Lightstreamer-lib-node-adapter).

The project includes:
* *nodechat.js* - Contains the JavaScript code for the Chat Data and Metadata Adapter.
* *robustconnect.js* - Contains the JavaScript code that manages the connection to the Proxy Adapter.

<!-- END DESCRIPTION lightstreamer-example-chat-adapter-node -->

## Install
The following steps assume that Lightstreamer Server, Adapter and Client are launched on the same machine. Adapt hosts accordingly when separating the pieces across different machines.

### Prepare Lightstreamer

1. Download and install Lightstreamer
2. Go to the `adapters` folder of your Lightstreamer Server installation. Create a new folder and call it `ChatAdapterNode`. Create a `lib` folder inside it.
3. Copy the `ls-proxy-adapters.jar` file from `Lightstreamer/DOCS-SDKs/sdk_adapter_remoting_infrastructure/lib` in the newly created `lib` folder.
4. Create an `adapters.xml` file inside the `ChatAdapterNode` folder and use the following contents:

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

5. Launch Lightstreamer.

### Prepare the Remote Adapter

1. From the command line go to the folder of this project and call
```shell
> npm install lightstreamer-adapter
```
2. Run the adapter using
```Shell
> node nodechat.js
```

### Prepare the Client

1. Please refer to the [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-Chat-client-javascript) project
2. Edit the `js/lsClient.js` file: in the LightstreamerClient instantiation and replace the `CHAT` string with `PROXY_NODECHAT`
```
new LightstreamerClient(hostToUse,"PROXY_NODECHAT");
```
3. Open the index.html file in one or more browsers. You can either launch the file using the file:/// protocol (i.e.: by double-clicking the file on most systems) or by deploying the folder on a local webserver (you may use Lightstreamer internal webserver).

## See Also

*    [Lightstreamer SDK for Node Adapters](https://github.com/Weswit/Lightstreamer-lib-node-adapter "Lightstreamer SDK for Node Adapters")

### Clients Using This Adapter
<!-- START RELATED_ENTRIES -->

*    [Lightstreamer - Basic Chat Demo - HTML Client](https://github.com/Weswit/Lightstreamer-example-Chat-client-javascript)

<!-- END RELATED_ENTRIES -->

### Related Projects

*    [Lightstreamer - Basic Chat Demo - Java Adapter](https://github.com/Weswit/Lightstreamer-example-Chat-adapter-java)

## Lightstreamer Compatibility Notes
Compatible with Lightstreamer SDK for Node Adapters since 1.1.1
