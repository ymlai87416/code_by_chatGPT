pragma solidity ^0.6.0;

contract Lottery {
  // The address of the contract owner
  address public owner;

  // The amount of ether in the contract
  uint public balance;

  // The minimum amount of ether required to enter the lottery
  uint public ticketPrice;

  // The players in the current lottery round
  address[] public players;

  // The constructor sets the owner and ticket price
  constructor(uint _ticketPrice) public {
    owner = msg.sender;
    ticketPrice = _ticketPrice;
  }

  // A player enters the lottery by sending ether to the contract
  function enter() public payable {
    require(msg.value >= ticketPrice, "The ticket price is higher.");
    require(players.length < 10, "The lottery is full.");

    // Add the player to the array of players
    players.push(msg.sender);

    // Increase the balance of the contract by the amount of ether sent
    balance += msg.value;
  }

  // The owner can draw a winner and end the current round
  function drawWinner() public {
    require(msg.sender == owner, "Only the owner can draw a winner.");
    require(players.length > 0, "There are no players.");

    // Randomly select a player
    uint index = random();
    address winner = players[index];

    // Transfer the balance of the contract to the winner
    winner.transfer(balance);

    // Reset the array of players and balance
    delete players;
    balance = 0;
  }

  // Generate a random number between 0 and the number of players
  function random() private view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, now, players.length))) % players.length;
  }
}