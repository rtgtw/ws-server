//function to handle the websocket upgrade
import parseWebSocketFrame from './ws-parser.js';
import createWebSocketFrame from './ws-generate.js';
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

const handleWebSocket = (socket) => {

    console.log("Websocket connection established");


    //listen for server input

    //if server says exit
    rl.on("line", (input) => {
        if(input === "exit"){
            console.log("Closing connection...");
            socket.write(createWebSocketFrame("Server closing connection"));
            socket.end();
            r1.close();
            return;
        }


        //send input to the client
        const resposneFrame = createWebSocketFrame(input);
        socket.write(resposneFrame);
    });



    //listen for any messages sent by the client via data, receive a buffer as the object incoming
    socket.on('data', (buffer) => {


        //first we have to parse the websocket by passing in the buffer to the function
        //!! Very important, we need to extract the payload and the opcode from parseWebSocketFrame,
        //0x8 = a close frame and we have to handle that seperately and close the socket


        //lot of debugging here, created an object to get opcode and payload 
        const { opcode, payload } = parseWebSocketFrame(buffer);

       
        //close frame opcode, end the connection
        if (opcode === 0x8) {
            // console.log("Close frame received: ", payload.toString());
            socket.write(createWebSocketFrame("CLOSING!!!!!!!!!!!!!!!!"));
            socket.end();
        } else {

            // console.log('Received Message ', payload.toString());
            //now we respond to the message with whatever we'd like by creating a websocket frame to send back
            //this returns a buffer with the payload

            //response from the client
            console.log(payload);

            // const response = createWebSocketFrame(`Echo: ${payload}`);
            //write back to the socket w/ frame if the connection is open, if its false

            // socket.write(response);
            // rl.prompt();
        }

    });



    //handle when the client closes the connection
    socket.on('close', () => {

        console.log("ENTERED!");
        console.log('Websocket connection closed by client');
    });


    socket.on('error', (err) => {

        //surpress the error ERESETCONN

        if (err.code === 'ECONNRESET') {

            console.log('Socket connection reset by client ', err.message)
        } else {
            console.error('Socket error:', err.message);
        }
    });


}

export default handleWebSocket;