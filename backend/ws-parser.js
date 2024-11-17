//parses the inbound frame sent by the client via websocket

const parseWebSocketFrame = (buffer) => {

    
    //check the final bit
    const isFinalFrame = (buffer[0] & 0x80) === 0x80;

    //get opcode
    const opcode = buffer[0] & 0x0f;

    //check mask bit
    const masked = (buffer[1] & 0x80) === 0x80;

    //get the payloads length
    const payloadLength = buffer[1] & 0x7f;


    //if masked bit is false throw an error
    if(!masked){
        throw new error('Client must mask data');
    };

    //extract masking key
    const maskingKey = buffer.slice(2,6);

    //extract the payload
    const payload = buffer.slice(6,6 + payloadLength);

    //unmask the payload
    //allocate payload lengths side in buffer
    const decode = Buffer.alloc(payloadLength);

    //decode to string
    const decodeToString = decode.toString();


    //use a forloop to unmask the data, we use XOR (^) to unmask the data according to WS protocol
    //i % 4 ensures that the ith byte of the payload is unmasked using the correct byte of the 4th byte key,
    // cylcing through the key as needed
    //applying XOR twice with the same key restores the original value
    for(let i = 0; i < payloadLength; i++){
        decode[i] = payload[i] ^ maskingKey[i % 4];
    };


    //return the decoded payload as a string UTF8, right now it is a buffer object
    //buffer has a toString method to do this

    //return a full object with opcode and everything else
    return {
        opcode: opcode,

        payload: decode.toString('utf8')};
}

export default parseWebSocketFrame;