const { ec, stark, hash } = require('starknet');

// Generate random private key
const privateKey = stark.randomAddress();
const publicKey = ec.starkCurve.getStarkKey(privateKey);

console.log("=== DEV WALLET GENERATED ===");
console.log("Private Key:", privateKey);
console.log("Public Key:", publicKey);
