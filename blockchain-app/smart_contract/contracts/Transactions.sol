// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Transactions {
    struct TranferStruct {
        address sender;
        address receiver;
        uint amount;
    }

    TranferStruct[] transcations;

    event Transfer(address from, address receiver, uint amount);

    function addToBlockChain (address payable receiver, uint amount) public {
        transcations.push(TranferStruct(msg.sender, receiver, amount));

        emit Transfer(msg.sender, receiver, amount);
    }
}
