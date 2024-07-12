const {
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_2022_PROGRAM_ID
} = require('@solana/spl-token');

const {
    SecretKey,
    SecretKey2,
    DevNetConn,
    TokenPubKey
} = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);

    let receiver = Keypair.fromSecretKey(SecretKey2)
    console.log(`🔑Receiver public key is: ${receiver.publicKey.toBase58()}`,);

    let ataAccount = await getOrCreateAssociatedTokenAccount(
        DevNetConn,
        account,
        TokenPubKey,
        account.publicKey,
        false,
        'confirmed',
        {},
        TOKEN_2022_PROGRAM_ID,
    )
    console.log(ataAccount.address.toBase58())

    let receiverAtaAccount = await getOrCreateAssociatedTokenAccount(
        DevNetConn,
        receiver,
        TokenPubKey,
        receiver.publicKey,
        false,
        'confirmed',
        {},
        TOKEN_2022_PROGRAM_ID,
    )
    console.log(receiverAtaAccount.address.toBase58())

    let transaction = new Transaction().add(
        createTransferInstruction(
            ataAccount.address,
            receiverAtaAccount.address,
            account.publicKey,
            10000000,
            [account],
            TOKEN_2022_PROGRAM_ID
        )
    );
    const signature = await sendAndConfirmTransaction(DevNetConn, transaction, [account]);
    console.log(`✅ Transfer Complete! View the transaction here: ${signature}`);
}

main().then(r => {})