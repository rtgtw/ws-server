import http from 'http';
import crpyto from 'crypto';
import dotenv from 'dotenv'
//Creating a websocket server from scratch
//node.js comes w/ two modules http and crypt

//websocket lifecycle stages
    //HTTP handshake, http get -> upgrade to websocket
    // protocol upgrade
    //communication w/ websocket frames where the data is sent and received


//1. create an http server 
const server = http.createServer((req,res) => {
    res.writeHead(400, {'Content-Type' : 'text/plain'});
    res.end('Only accepts websocket connections');
});



//Listen for when a client wants to upgrade to a websocket connection
//listen for upgrade, look inside of the headers for sec-websocket-key, head is there if there are any extra headers
//server.on means the server has a listner for when someone sends an upgrade in the request body
//the tcp connection is the second parameter and we use that to essentially pass that to webSocket handler
//and keep the TCP connection alive
//This differs from an HTTP req/res because once the server responds it destroys the TCP connection (socket)
//however with WS we are keeping the connection alive
server.on('upgrade', (req, socket, head) => {

    const key = req.headers['sec-websocket-key'];

    //if there is no key close the socket (aka tcp connection) gets destroyed
    if(!key){
        socket.write('HTTP/1.1 400 Bad Request \r\n\r\n');
        socket.destroy();
        return;
    }


    //if its present generate a ws accept header
    //key + guid
    const acceptKey = crpyto.createHash('sha1').update(key +'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');

    //send a response through the tcp connection
    socket.write(`HTTP/1.1 101 Switching Protocols\r\n` +
        `Upgrade: websocket\r\n` +
        `Connection: Upgrade\r\n` +
        `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
    );


    //Handle Websocket communication
    handleWebSocket(socket);
});



//have the server listening on port 8080
