const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PayOnChain", function () {
  let contract, owner, payer, merchant;

  beforeEach(async function () {
    [owner, payer, merchant] = await ethers.getSigners();
    const PayOnChain = await ethers.getContractFactory("PayOnChain");
    contract = await PayOnChain.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Payments", function () {
    it("Should accept a payment with valid orderId", async function () {
      const amount = ethers.parseEther("0.1");
      await expect(
        contract.connect(payer).pay("order_001", merchant.address, { value: amount })
      )
        .to.emit(contract, "PaymentReceived")
        .withArgs(payer.address, merchant.address, amount, "order_001");

      expect(await contract.isPaid("order_001")).to.be.true;
    });

    it("Should reject zero-value payment", async function () {
      await expect(
        contract.connect(payer).pay("order_002", merchant.address, { value: 0 })
      ).to.be.revertedWith("Payment must be greater than 0");
    });

    it("Should reject empty orderId", async function () {
      const amount = ethers.parseEther("0.01");
      await expect(
        contract.connect(payer).pay("", merchant.address, { value: amount })
      ).to.be.revertedWith("Order ID required");
    });

    it("Should reject duplicate payment for same orderId", async function () {
      const amount = ethers.parseEther("0.05");
      await contract.connect(payer).pay("order_dup", merchant.address, { value: amount });
      await expect(
        contract.connect(payer).pay("order_dup", merchant.address, { value: amount })
      ).to.be.revertedWith("Order already paid");
    });

    it("Should store correct payment details", async function () {
      const amount = ethers.parseEther("0.25");
      await contract.connect(payer).pay("order_detail", merchant.address, { value: amount });

      const [rPayer, rMerchant, rAmount, rTimestamp, rRefunded] = await contract.getPayment("order_detail");
      expect(rPayer).to.equal(payer.address);
      expect(rMerchant).to.equal(merchant.address);
      expect(rAmount).to.equal(amount);
      expect(rRefunded).to.be.false;
    });
  });

  describe("Refunds", function () {
    it("Should refund a paid order", async function () {
      const amount = ethers.parseEther("0.1");
      await contract.connect(payer).pay("order_refund", merchant.address, { value: amount });

      const balanceBefore = await ethers.provider.getBalance(payer.address);

      await expect(contract.connect(owner).refund("order_refund"))
        .to.emit(contract, "RefundIssued")
        .withArgs(payer.address, amount, "order_refund");

      const balanceAfter = await ethers.provider.getBalance(payer.address);
      expect(balanceAfter - balanceBefore).to.equal(amount);

      // isPaid should now be false
      expect(await contract.isPaid("order_refund")).to.be.false;
    });

    it("Should reject refund for non-existent order", async function () {
      await expect(
        contract.connect(owner).refund("order_nonexistent")
      ).to.be.revertedWith("No payment found for this order");
    });

    it("Should reject double refund", async function () {
      const amount = ethers.parseEther("0.05");
      await contract.connect(payer).pay("order_double_refund", merchant.address, { value: amount });
      await contract.connect(owner).refund("order_double_refund");

      await expect(
        contract.connect(owner).refund("order_double_refund")
      ).to.be.revertedWith("Already refunded");
    });

    it("Should reject refund from non-owner", async function () {
      const amount = ethers.parseEther("0.05");
      await contract.connect(payer).pay("order_auth", merchant.address, { value: amount });

      await expect(
        contract.connect(payer).refund("order_auth")
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw", async function () {
      const amount = ethers.parseEther("1.0");
      await contract.connect(payer).pay("order_withdraw", merchant.address, { value: amount });

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = await contract.connect(owner).withdraw();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(owner.address);
      expect(balanceAfter + gasCost - balanceBefore).to.equal(amount);
    });

    it("Should reject withdrawal when no funds", async function () {
      await expect(
        contract.connect(owner).withdraw()
      ).to.be.revertedWith("No funds available");
    });

    it("Should reject withdrawal from non-owner", async function () {
      const amount = ethers.parseEther("0.1");
      await contract.connect(payer).pay("order_w2", merchant.address, { value: amount });

      await expect(
        contract.connect(payer).withdraw()
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  describe("Receive fallback", function () {
    it("Should accept direct ETH via receive()", async function () {
      const amount = ethers.parseEther("0.5");
      await expect(
        payer.sendTransaction({ to: contract.target, value: amount })
      ).to.emit(contract, "PaymentReceived");
    });
  });
});
