const {
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {OftTools, OFT_SEED, OftProgram} = require('@layerzerolabs/lz-solana-sdk-v2');

const {SecretKey, TestNetConn, TokenPubKey, Peers} = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);


    // ulnProgramID from LayerZero
    const uln = new PublicKey('7a4WjyR8VZ7yZz5XJAKm39BUGn5iT9CKcv2pmG9tdXVH');

    const [oftConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from(OFT_SEED), TokenPubKey.toBuffer()],
        OftProgram.OFT_DEFAULT_PROGRAM_ID,
    );

    console.log(`🔑Token public key is: ${TokenPubKey}`,);
    console.log(`OFT Config is: ${oftConfig}`,);

    for (const peer of Peers) {
        console.log(`Processing configurations for dstEid: ${peer.dstEid}`);
    
        // Initialize the send library for the pathway.
        const initSendLibraryTransaction = new Transaction().add(
            await OftTools.createInitSendLibraryIx(account.publicKey, oftConfig, peer.dstEid),
        );
    
        const initSendLibrarySignature = await sendAndConfirmTransaction(
            TestNetConn,
            initSendLibraryTransaction,
            [account],
        );
        console.log(
            `✅ You initialized the send library for dstEid ${peer.dstEid}! View the transaction here: ${initSendLibrarySignature}`,
        );
    
        // Set the send library for the pathway.
        const setSendLibraryTransaction = new Transaction().add(
            await OftTools.createSetSendLibraryIx(account.publicKey, oftConfig, uln, peer.dstEid),
        );
    
        const setSendLibrarySignature = await sendAndConfirmTransaction(
            TestNetConn,
            setSendLibraryTransaction,
            [account],
        );
        console.log(
            `✅ You set the send library for dstEid ${peer.dstEid}! View the transaction here: ${setSendLibrarySignature}`,
        );
    
        // Initialize the receive library for the pathway.
        const initReceiveLibraryTransaction = new Transaction().add(
            await OftTools.createInitReceiveLibraryIx(account.publicKey, oftConfig, peer.dstEid),
        );
    
        const initReceiveLibrarySignature = await sendAndConfirmTransaction(
            TestNetConn,
            initReceiveLibraryTransaction,
            [account],
        );
        console.log(
            `✅ You initialized the receive library for dstEid ${peer.dstEid}! View the transaction here: ${initReceiveLibrarySignature}`,
        );

        // Set the receive library for the pathway.
        const setReceiveLibraryTransaction = new Transaction().add(
            await OftTools.createSetReceiveLibraryIx(account.publicKey, oftConfig, uln, peer.dstEid, 0n),
        );

        const setReceiveLibrarySignature = await sendAndConfirmTransaction(
            TestNetConn,
            setReceiveLibraryTransaction,
            [account],
        );
        console.log(
            `✅ You set the receive library for dstEid ${peer.dstEid}! View the transaction here: ${setReceiveLibrarySignature}`,
        );
    }
}

main().then(r => {})


