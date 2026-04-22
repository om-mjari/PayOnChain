const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PayOnChainModule", (m) => {
  const payOnChain = m.contract("PayOnChain");

  return { payOnChain };
});
