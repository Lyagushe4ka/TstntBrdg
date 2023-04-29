const ethers = require('ethers');
const fs = require('fs');

const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
const wallet = new ethers.Wallet('0x' + fs.readFileSync('PrivateKey.txt').toString(), provider);

const bridgeContract = '0x0A9f824C05A74F577A536A8A0c673183a872Dff4';
const bridgeAbi = JSON.parse(fs.readFileSync('bridgeAbi.json').toString());
const bridge = new ethers.Contract(bridgeContract, bridgeAbi, wallet);

const oftContract = '0xdD69DB25F6D620A7baD3023c5d32761D353D3De9'; 
const oftAbi = JSON.parse(fs.readFileSync('oftAbi.json').toString());
const oft = new ethers.Contract(oftContract, oftAbi, wallet);

const amount = ethers.utils.parseEther('0.0004'); // 0.0004 ETH ~ 0.8 USD

const chainId = 154; // Goerli testnet

async function main() {
    const fee = await oft.estimateSendFee(chainId, wallet.address, amount, false, "0x");
    console.log(fee);

    const tx = await bridge.swapAndBridge(
        amount,
        0,
        chainId,
        wallet.address,
        wallet.address,
        ethers.constants.AddressZero,
        "0x",
        { value: amount.add(fee[0]) },
    );
    const receipt = await tx.wait();
    console.log(receipt.transactionHash);
}

main();