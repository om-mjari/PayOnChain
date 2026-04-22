const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const PayOnChain = await hre.ethers.getContractFactory("PayOnChain");

    const contract = await PayOnChain.deploy();

    await contract.waitForDeployment();

    const address = contract.target;
    console.log("PayOnChain contract deployed at:", address);

    // Write deployed address to a shared config file for backend/frontend
    const configPath = path.join(__dirname, "..", "contract-address.json");
    fs.writeFileSync(configPath, JSON.stringify({
        contractAddress: address,
        network: hre.network.name,
        deployedAt: new Date().toISOString()
    }, null, 2));
    console.log("Contract address saved to:", configPath);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});