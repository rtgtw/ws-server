//function to handle the websocket upgrade
import parseWebSocketFrame from './ws-parser.js';
import createWebSocketFrame from './ws-generate.js';

export default handleWebSocket = (socket) => {

    console.log("Websocket connection established");

    //listen for any messages sent by the client via data, receive a buffer as the object incoming
    socket.on('data', (buffer) => {
        //first we have to parse the websocket by passing in the buffer to the function
        const message = parseWebSocketFrame(buffer);
        console.log('Received Message ', message);


    //now we respond to the message with whatever we'd like by creating a websocket frame to send back
    //this returns a buffer with the payload
    const response = createWebSocketFrame(`Echo: ${message}`);
    
    //write back to the socket w/ frame
    socket.write(response);
    });



    //handle when the client closes the connection
    socket.on('close', () => {
        console.log('Websocket connection closed by client');
    });

}