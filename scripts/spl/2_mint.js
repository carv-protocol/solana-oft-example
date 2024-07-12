const {
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {
    createMintToInstruction,
    getOrCreateAssociatedTokenAccount,
    TOKEN_2022_PROGRAM_ID
} = require('@solana/spl-token');

const {
    SecretKey,
    DevNetConn,
    TokenPubKey
} = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);

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

    let transaction = new Transaction().add(
        createMintToInstruction(
            TokenPubKey,
            ataAccount.address,
            account.publicKey,
            100000000,
            [account],
            TOKEN_2022_PROGRAM_ID
        )
    );
    const signature = await sendAndConfirmTransaction(DevNetConn, transaction, [account]);
    console.log(`✅ Mint Complete! View the transaction here: ${signature}`);
}

main().then(r => {})