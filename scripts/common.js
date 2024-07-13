const {Connection, clusterApiUrl, PublicKey} = require("@solana/web3.js");
exports.SecretKey = Uint8Array.from([219,129,106,129,243,40,37,122,131,249,5,116,216,48,112,119,98,134,128,226,44,244,150,27,202,126,127,116,58,131,224,162,244,7,171,199,188,240,202,243,196,133,87,200,222,55,16,176,223,246,221,175,201,12,42,103,158,113,49,23,85,211,17,235]);
exports.SecretKey2 = Uint8Array.from([151,211,107,89,233,90,126,10,255,171,94,105,190,64,15,64,152,91,233,76,127,21,27,63,47,107,153,207,128,51,96,58,14,76,229,130,181,123,48,164,163,185,160,109,166,95,150,73,139,114,165,50,118,86,45,168,10,204,242,188,217,139,189,216]);

// devnet token contract
// exports.TokenPubKey = new PublicKey("D5V2mtWiujVkaMB3WjhBA6SAnfbZpKtfNoFXtBatDww4")

// testnet token contract
exports.TokenPubKey = new PublicKey("8tjXfjTu6k5Gze8EczH4rXCnw1JiJfrjeVy8dhpUGpqd")

exports.DevNetConn = new Connection(clusterApiUrl("devnet"), "confirmed");
exports.TestNetConn = new Connection(clusterApiUrl("testnet"), "confirmed");