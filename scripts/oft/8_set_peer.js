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


    const [oftConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from(OFT_SEED), TokenPubKey.toBuffer()],
        OftProgram.OFT_DEFAULT_PROGRAM_ID,
    );

    for (const peer of Peers) {
        const peerTransaction = new Transaction().add(
            await OftTools.createSetPeerIx(
                account.publicKey,
                oftConfig,
                peer.dstEid,
                peer.peerAddress,
            ),
        );

        const sig = await sendAndConfirmTransaction(TestNetConn, peerTransaction, [account]);
        console.log(
            `✅ You set ${await OftTools.getPeerAddress(TestNetConn, oftConfig, peer.dstEid)} for dstEid ${
                peer.dstEid
            }! View the transaction here: ${sig}`,
        );
    }
}

main().then(r => {})


