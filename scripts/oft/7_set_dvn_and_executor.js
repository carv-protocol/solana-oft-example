const {
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const { OftTools, OFT_SEED, OftProgram, SetConfigType } = require('@layerzerolabs/lz-solana-sdk-v2');

const { SecretKey, TestNetConn, TokenPubKey, Peers } = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);

    const publicExecutor = new PublicKey('AwrbHeCyniXaQhiJZkLhgWdUCteeWSGaSN1sTfLiY7xK')
    // LayerZero DVN
    const lzDVNProgramId = new PublicKey('HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW');
    const lzDVNConfigAccount = PublicKey.findProgramAddressSync([Buffer.from(DVN_CONFIG_SEED, 'utf8')], lzDVNProgramId)[0]; 
    console.log(`🔑LayerZero DVN config is: ${lzDVNConfigAccount.toBase58()}`,);

    const [oftConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from(OFT_SEED), TokenPubKey.toBuffer()],
        OftProgram.OFT_DEFAULT_PROGRAM_ID,
    );

    for (const peer of Peers) {
        // Set the Executor config for the pathway.
        const setExecutorConfigTransaction = new Transaction().add(
            await OftTools.createSetConfigIx(
                TestNetConn,
                account.publicKey,
                oftConfig,
                peer.dstEid,
                SetConfigType.EXECUTOR,
                {
                    executor: publicExecutor,
                    maxMessageSize: 10000,
                },
            ),
        );

        const setExecutorConfigSignature = await sendAndConfirmTransaction(
            TestNetConn,
            setExecutorConfigTransaction,
            [account],
        );
        console.log(
            `✅ Set executor configuration for dstEid ${peer.dstEid}! View the transaction here: ${setExecutorConfigSignature}`,
        );

        // Set the Executor config for the pathway.
        const setSendUlnConfigTransaction = new Transaction().add(
            await OftTools.createSetConfigIx(
                TestNetConn,
                account.publicKey,
                oftConfig,
                peer.dstEid,
                SetConfigType.SEND_ULN,
                {
                    confirmations: 10, // should be consistent with the target chain
                    requiredDvnCount: 1,
                    optionalDvnCount: 0,
                    optionalDvnThreshold: 0,
                    requiredDvns: [lzDVNConfigAccount].sort(),
                    optionalDvns: [],
                },
            ),
        );

        const setSendUlnConfigSignature = await sendAndConfirmTransaction(
            TestNetConn,
            setSendUlnConfigTransaction,
            [account],
        );
        console.log(
            `✅ Set send uln configuration for dstEid ${peer.dstEid}! View the transaction here: ${setSendUlnConfigSignature}`,
        );

        // Set the Executor config for the pathway.
        const setReceiveUlnConfigTransaction = new Transaction().add(
            await OftTools.createSetConfigIx(
                TestNetConn,
                account.publicKey,
                oftConfig,
                peer.dstEid,
                SetConfigType.RECEIVE_ULN,
                {
                    confirmations: 1, // should be consistent with the target chain
                    requiredDvnCount: 1,
                    optionalDvnCount: 0,
                    optionalDvnThreshold: 0,
                    requiredDvns: [lzDVNConfigAccount].sort(),
                    optionalDvns: [],
                },
            ),
        );

        const setReceiveUlnConfigSignature = await sendAndConfirmTransaction(
            TestNetConn,
            setReceiveUlnConfigTransaction,
            [account],
        );
        console.log(
            `✅ Set receive uln configuration for dstEid ${peer.dstEid}! View the transaction here: ${setReceiveUlnConfigSignature}`,
        );
    }
}

main().then(r => { })


