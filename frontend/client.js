//client to engage w/ server
import { WebSocket } from "ws";

//read line from the user
import readline from "readline";


//Create a new websocket object passing in the servers endpoint
const socket = new WebSocket(`ws://localhost:8080`);


//create a readline interface for useri nput
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//establish connection

socket.onopen = () => {
    console.log('Websocket connection established');


    //r1.on listens for an event, "line" is when the user presses enter
    //pass input into callback function
    //recursively call handle message

        rl.on("line", (input) => {

            if (input === "exit") {
                console.log("Closing connection...");
                socket.close(1000, "Client requested closure");
                rl.close();
            }
            else {
                socket.send(input);
                //recursively call itself to reprompt user
            //     rl.prompt();
            }
        });

    //call handleMessage
    // rl.prompt();

};


//when a message is received
socket.onmessage = (event) => {
    console.log( event.data);
};


//when the connection is closed
socket.onclose = () => {
    console.log('Websocket connection closed by the server.');
};



