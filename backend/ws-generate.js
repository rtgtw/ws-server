//generating a Websocket frame outbound for the client 

const createWebSocketFrame = (message) => {

    //create a buffer to store the payload, this will be the size of the payload aka the message
    //we specify the character encoding as well to properly create the buffer
    const payload = Buffer.from(message, 'utf8');

    //now that we have the payload we create a frame from it, include 2 extra bits plus the payload to 
    //create a frame
    const frame = Buffer.alloc(2 + payload.length);

    //first bit is the Final Bit, give it 0x81
    frame[0] = 0x81;

    //second bit in the frame is the masking bit which should be the size of the payload
    frame[1] = payload.length;

    //copy the payload information into the frame with an offset of 2, since the first two bits are for
    //final and bit and then we can return the frame outbound to the clinet
    payload.copy(frame,2);

    return frame;
}

export default createWebSocketFrame;