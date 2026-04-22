const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PaymentGatewayModule", (m) => {
  const paymentGateway = m.contract("PaymentGateway");

  return { paymentGateway };
});
