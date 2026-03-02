const { RpcProvider, Account, Contract, json } = require('starknet');
const fs = require('fs');

async function main() {
    console.log("Starting deployment script...");
    const provider = new RpcProvider({ nodeUrl: "https://rpc.starknet-testnet.lava.build" });

    // Test dev account
    const address = "0x00c822ebdd89efdd8840d287bbda8aeacd1398863aa992167d64b150cbe9cd53";
    const privateKey = "0x05b2a0c6a858ea61eb0dfffe7abda2df21183aa1e7fcae8b15d9da63641ce6bf";
    const account = new Account(provider, address, privateKey, "1");

    console.log("Account configured:", address);

    // Read compiled contract
    console.log("Reading contract files...");
    const sierraFile = fs.readFileSync("./target/release/zerovault_ZeroVault.contract_class.json").toString();
    const casmFile = fs.readFileSync("./target/release/zerovault_ZeroVault.compiled_contract_class.json").toString();

    const sierra = json.parse(sierraFile);
    const casm = json.parse(casmFile);

    console.log("Declaring contract...");
    try {
        const declareResponse = await account.declareIfNew({
            contract: sierra,
            casm: casm
        });
        console.log("Declared! Tx Hash:", declareResponse.transaction_hash);
        console.log("Class Hash:", declareResponse.class_hash);

        console.log("Waiting for declare transaction to be accepted...");
        if (declareResponse.transaction_hash) {
            await provider.waitForTransaction(declareResponse.transaction_hash);
        }

        console.log("Deploying contract...");
        const deployResponse = await account.deploy({
            classHash: declareResponse.class_hash,
            constructorCalldata: []
        });

        console.log("Deploy Tx Hash:", deployResponse.transaction_hash);
        console.log("Contract Address:", deployResponse.contract_address[0]);
        console.log("Success! 🎉");

    } catch (e) {
        console.error("Deploy failed:", e);
    }
}

main();
