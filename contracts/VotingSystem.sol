// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is Ownable {

event submitProposalEvent(bytes32 proposalName, address _approved);
event voteEvent(uint proposal);
event winningProposalEvent(uint _winningProposal);
    
uint private persentageNeededForProposalToPass = 75;
address public chairman;

struct Proposal {
    bytes32 name;
    uint16 voteCount;
}

struct Voter {
    bool voted;
    uint8 vote;
    uint16 voteWeight;
    bool isApproved;
}

Proposal[] public proposals;

mapping(address => Voter) public voters;
mapping(address => bool) public eligibleToVoteAndPropose;
mapping(address => uint16) public alreadyVoted;

function submitProposal(bytes32 _proposalName, address _approved) public {
require(eligibleToVoteAndPropose[_approved],  "The proposer is not eligible to submit a proposal.");
proposals.push(Proposal({
    name: _proposalName,
    voteCount: 1
    }));
emit submitProposalEvent(_proposalName, _approved);
}

function giveRightToVoteAndPropose(address _voter) public onlyOwner {
    require(!voters[_voter].voted, 'The voter has already voted');
    require(!eligibleToVoteAndPropose[_voter], 'voter is already eligible');
    voters[_voter].voteWeight = 1;
    voters[_voter].isApproved =true;
    eligibleToVoteAndPropose[_voter] = true;
}

function vote(uint8 _proposal) public {
    Voter storage sender = voters[msg.sender];
    require(sender.isApproved, 'voter is not eligible to vote');
    require(!sender.voted, 'cannot vote twice');
    sender.voted = true;
    sender.vote = _proposal;
    proposals[_proposal].voteCount += sender.vote;

    emit voteEvent(_proposal);
}

function winningProposal() public view returns (uint _winningProposal) {

uint winningVoteCount = 0;
for(uint i = 0; i < proposals.length; i++) {
    if(proposals[i].voteCount > winningVoteCount) {
        winningVoteCount = proposals[i].voteCount;
        _winningProposal = i;
    }
}
// emit winningProposalEvent(_winningProposal);
}

function winningName() public view returns (bytes32 _winningName) {
    _winningName = proposals[winningProposal()].name;
}

}





