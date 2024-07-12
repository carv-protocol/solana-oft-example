const {
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction, Connection, AccountMeta, TransactionInstruction,
} = require('@solana/web3.js');

const {getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID} = require("@solana/spl-token");
const {OftTools} = require('@layerzerolabs/lz-solana-sdk-v2');
const {addressToBytes32, Options } = require('@layerzerolabs/lz-v2-utilities');

const {SecretKey, TestNetConn, TokenPubKey} = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);

    const peer = {
        dstEid: 40231,
        peerAddress: addressToBytes32('0x8935Fa8Fa557D427317Dc05392ff6d7a5aC91D94'),
    };

    let ataAccount = await getOrCreateAssociatedTokenAccount(
        TestNetConn,
        account,
        TokenPubKey,
        account.publicKey,
        false,
        'confirmed',
        {},
        TOKEN_2022_PROGRAM_ID,
    )

    const receiver = addressToBytes32('0xAdB2b5B7bA93ABEE50cB4A7a063d826233137B65');
    const amountToSend = 10n;

    const fee = await OftTools.quoteWithUln(
        TestNetConn,
        account.publicKey,
        TokenPubKey,
        peer.dstEid,
        amountToSend,
        amountToSend,
        Options.newOptions().addExecutorLzReceiveOption(0, 0).toBytes(),
        Array.from(receiver),
    );

    const sendTransaction = new Transaction().add(
        await OftTools.sendWithUln(
            TestNetConn,
            account.publicKey,
            TokenPubKey,
            ataAccount.publicKey,
            peer.dstEid,
            amountToSend,
            amountToSend,
            Options.newOptions().addExecutorLzReceiveOption(0, 0).toBytes(),
            Array.from(receiver),
            fee.nativeFee
        ),
    );

    const sig = await sendAndConfirmTransaction(TestNetConn, sendTransaction, [account]);
    console.log(
        `✅ You sent ${amountToSend} to dstEid ${peer.dstEid}! View the transaction here: ${sig}`,
    );
}

main().then(r => {})


