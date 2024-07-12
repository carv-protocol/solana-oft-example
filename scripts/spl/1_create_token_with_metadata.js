const {
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram,
} = require('@solana/web3.js');

const {
    pack,
} = require("@solana/spl-token-metadata");

const {
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
    LENGTH_SIZE,
    getMintLen,
    ExtensionType,
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    createInitializeInstruction,
    createUpdateFieldInstruction
} = require("@solana/spl-token");

const {
    SecretKey,
    DevNetConn
} = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);

    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const decimals = 2;
    const mintAuthority = account.publicKey;
    const updateAuthority = account.publicKey;
    const metaData = {
        updateAuthority: updateAuthority,
        mint: mint,
        name: "Test",
        symbol: "T",
        uri: "test-url",
        additionalMetadata: [["description", "Test On Solana"]],
    };

    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    const metadataLen = pack(metaData).length;
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const lamports = await DevNetConn.getMinimumBalanceForRentExemption(
        mintLen + metadataExtension + metadataLen,
    );

    const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: account.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
    });
    const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
        mint,
        updateAuthority,
        mint,
        TOKEN_2022_PROGRAM_ID,
    );
    const initializeMintInstruction = createInitializeMintInstruction(
        mint,
        decimals,
        mintAuthority,
        null,
        TOKEN_2022_PROGRAM_ID,
    );
    const initializeMetadataInstruction = createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mint,
        updateAuthority: updateAuthority,
        mint: mint,
        mintAuthority: mintAuthority,
        name: metaData.name,
        symbol: metaData.symbol,
        uri: metaData.uri,
    });
    const updateFieldInstruction = createUpdateFieldInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mint,
        updateAuthority: updateAuthority,
        field: metaData.additionalMetadata[0][0],
        value: metaData.additionalMetadata[0][1],
    });

    let transaction = new Transaction().add(
        createAccountInstruction,
        initializeMetadataPointerInstruction,
        initializeMintInstruction,
        initializeMetadataInstruction,
        updateFieldInstruction,
    );

    let sig = await sendAndConfirmTransaction(
        DevNetConn,
        transaction,
        [account, mintKeypair],
    );

    console.log(`create token ${mintKeypair.publicKey} OK: ${sig}`)
}

main().then(r => {})