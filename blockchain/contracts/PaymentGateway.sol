// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentGateway {

    event PaymentDone(address indexed payer, uint amount);

    function pay() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        emit PaymentDone(msg.sender, msg.value);
    }
}