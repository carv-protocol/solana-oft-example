const solana_web3 = require('@solana/web3.js');
const {Keypair} = require("@solana/web3.js");

const {
    SecretKey,
    DevNetConn
} = require("../common")

function main() {
    let account = solana_web3.Keypair.fromSecretKey(SecretKey)

    const lamports = 5*1000000000
    DevNetConn.requestAirdrop(account.publicKey, lamports).then(()=>{
        console.log("airdrop done")
    });
}
main()