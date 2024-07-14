const {
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const { OftTools, EXECUTOR_CONFIG_SEED, OFT_SEED, UlnProgram, OftProgram, SetConfigType } = require('@layerzerolabs/lz-solana-sdk-v2');
const {addressToBytes32, } = require('@layerzerolabs/lz-v2-utilities');

const { SecretKey, TestNetConn, TokenPubKey } = require("../common")

async function main() {
    let account = Keypair.fromSecretKey(SecretKey);
    console.log(`🔑Owner public key is: ${account.publicKey.toBase58()}`,);

    const executor = new PublicKey('76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6');
    const publicExecutor = new PublicKey('AwrbHeCyniXaQhiJZkLhgWdUCteeWSGaSN1sTfLiY7xK')
    const peers = [
        {dstEid: 40231, peerAddress: addressToBytes32('0xEe124EFd323ec2e5148583b39a799ec7Cf6CD897')},
        // {dstEid: 40202, peerAddress: addressToBytes32('0x531DD61c620bD76aC6fA4f7217bc4654EdB3C353')},
    ];

    const [oftConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from(OFT_SEED), TokenPubKey.toBuffer()],
        OftProgram.OFT_DEFAULT_PROGRAM_ID,
    );
    const [findExecutor] = PublicKey.findProgramAddressSync(
        [Buffer.from(EXECUTOR_CONFIG_SEED, 'utf8')],
        executor,
    )

    const executorConfig = UlnProgram.executorConfigBeet.serialize({
        executor: findExecutor,
        maxMessageSize: 10000,
    })[0];

    console.log(`🔑Executor public key is: ${findExecutor.toBase58()}`,);
    

    console.log(executorConfig)

    for (const peer of peers) {
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
    }
}

main().then(r => { })


