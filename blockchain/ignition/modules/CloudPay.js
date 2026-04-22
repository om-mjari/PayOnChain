const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CloudPayModule", (m) => {
  const cloudPay = m.contract("CloudPay");

  return { cloudPay };
});
