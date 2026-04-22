// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CloudPay {
    address public owner;

    event PaymentReceived(address indexed from, uint256 amount, string orderId);
    event FundsWithdrawn(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Accept ETH payment linked to a specific order ID
    function pay(string memory _orderId) public payable {
        require(msg.value > 0, "Payment must be greater than 0");
        
        emit PaymentReceived(msg.sender, msg.value, _orderId);
    }

    // Allow owner to withdraw the collected payments
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(owner, balance);
    }

    // Fallback function to accept raw ETH
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value, "RAW_FUNDING");
    }
}
