const {Connection, clusterApiUrl, PublicKey} = require("@solana/web3.js");
const {addressToBytes32, } = require('@layerzerolabs/lz-v2-utilities');

// test secret key for creating contracts
exports.SecretKey = Uint8Array.from([]);
// test secret key for receive test funds
exports.SecretKey2 = Uint8Array.from([]);

// testnet token contract
exports.TokenPubKey = new PublicKey("")

exports.DevNetConn = new Connection(clusterApiUrl("devnet"), "confirmed");
exports.TestNetConn = new Connection(clusterApiUrl("testnet"), "confirmed");

// Eids: https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
// peerAddress: your other OFT contracts on destination Eid chain.
exports.Peers = [
    {dstEid: 40231, peerAddress: addressToBytes32('')},
    // {dstEid: 40202, peerAddress: addressToBytes32('0x531DD61c620bD76aC6fA4f7217bc4654EdB3C353')},
];