// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PayOnChain
 * @notice A cloud-native payment gateway smart contract that accepts ETH payments
 *         linked to a specific orderId and merchant address, with refund support.
 */
contract PayOnChain {
    address public owner;

    struct Payment {
        address payer;
        address merchant;
        uint256 amount;
        string orderId;
        uint256 timestamp;
        bool refunded;
    }

    // orderId => Payment record
    mapping(string => Payment) public payments;

    event PaymentReceived(
        address indexed from,
        address indexed merchant,
        uint256 amount,
        string orderId
    );

    event RefundIssued(
        address indexed to,
        uint256 amount,
        string orderId
    );

    event FundsWithdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Accept ETH payment for a specific order.
     * @param _orderId The unique order identifier from the backend.
     * @param _merchant The merchant address (for event indexing).
     */
    function pay(string memory _orderId, address _merchant) public payable {
        require(msg.value > 0, "Payment must be greater than 0");
        require(bytes(_orderId).length > 0, "Order ID required");
        require(payments[_orderId].amount == 0, "Order already paid");

        payments[_orderId] = Payment({
            payer: msg.sender,
            merchant: _merchant,
            amount: msg.value,
            orderId: _orderId,
            timestamp: block.timestamp,
            refunded: false
        });

        emit PaymentReceived(msg.sender, _merchant, msg.value, _orderId);
    }

    /**
     * @notice Refund a specific order payment back to the original payer (owner only).
     * @param _orderId The order ID to refund.
     */
    function refund(string memory _orderId) public onlyOwner {
        Payment storage p = payments[_orderId];
        require(p.amount > 0, "No payment found for this order");
        require(!p.refunded, "Already refunded");
        require(address(this).balance >= p.amount, "Insufficient contract balance");

        p.refunded = true;

        (bool success, ) = p.payer.call{value: p.amount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(p.payer, p.amount, _orderId);
    }

    /**
     * @notice Allow owner to withdraw all collected ETH.
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @notice Check if an order has been paid.
     */
    function isPaid(string memory _orderId) public view returns (bool) {
        return payments[_orderId].amount > 0 && !payments[_orderId].refunded;
    }

    /**
     * @notice Get full payment details for an order.
     */
    function getPayment(string memory _orderId) public view returns (
        address payer,
        address merchant,
        uint256 amount,
        uint256 timestamp,
        bool refunded
    ) {
        Payment memory p = payments[_orderId];
        return (p.payer, p.merchant, p.amount, p.timestamp, p.refunded);
    }

    /**
     * @notice Fallback to accept raw ETH funding.
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, owner, msg.value, "DIRECT_FUNDING");
    }
}
