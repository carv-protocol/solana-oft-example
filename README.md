# solana-oft-example

The Omnichain Fungible Token (OFT) Standard allows fungible tokens to be transferred across multiple blockchains without asset wrapping or middlechains.

This standard works by burning tokens on the source chain whenever an omnichain transfer is initiated. A message is then sent via the protocol, which delivers a function call to the destination contract to mint the same number of tokens that were burned.

The LayerZero Protocol consists of several programs built on the Solana blockchain designed to facilitate the secure movement of data, tokens, and digital assets between different blockchain environments. In this tutorial, we will utilize LayerZero to build OFT on Solana.

> **_NOTE:_** The LayerZero Solana OFT, Endpoint, and ULN Programs are currently in Mainnet Beta! Changes are to be expected.


## Install dependencies
Install Solana Cli

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```
Install other dependencies
1. with `yarn`:

```bash
yaml
```
or

2. with `npm`:
```bash
npm install
```

## Initialize private keys
Use the Solana CLI to generate a new key pair:

```bash
solana-keygen new
```

By default, the private key is generated in `$HOME/.config/solana/id.json`. Check the output for detailed results. Open the `id.json` file and copy-paste the private key in `SecretKey` in `scripts/common.js`.

_If you need a new key to test receiving funds for SPL tokens, create a new key and update the `SecretKey2 as well._

## Deploy OFT
To deploy the OFT token, follow the scripts under `scripts/oft`. Follow the order to create your OFT token and connect to other chains. For example:

```bash
# to create the spl token for conversion
node scripts/oft/1_create_token.js
```

Based on the output, update the `TokenPubKey` in `scripts/common.js`.

> **_NOTE:_**  Please set the peers in `scripts/common.js` ensure correct behavior. You can follow the instructions [here](https://docs.layerzero.network/v2/developers/evm/oft/quickstart) to set up OFT on an EVM-based chain.

> **_NOTE:_**  Ensure that the peer on the other chain sets the OFT config address created by this tutorial to make sure OFT works for Solana.