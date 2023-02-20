// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract VotingSystem is Ownable {

event submitProposalEvent(bytes32 proposalName, address _approved);
event voteEvent(uint proposal);
event winningProposalEvent(uint _winningProposal);

    
uint private persentageNeededForProposalToPass = 75;
address public chairman;


struct Proposal {

    bytes32 name;
    uint16 voteCount;
    address personAddress;
    
}

struct Voter {
    bool voted;
    uint8 vote;
    address personAddress;
    bool isApproved;
}

Proposal[] public proposals;
Voter[] public voters;

mapping(address => bool) public eligibleToVoteAndPropose;
mapping(address => uint16) public alreadyVoted;

constructor(bytes32[] memory  _proposalNames) {

    for(uint i=0; i<proposalNames.length; i++) {
        proposals.push(Proposal({
            name: proposalNames[i],
            voteCount: 0,
            personAddress: ''
        }));
    }

}

function sumbitProposal(bytes32 _proposalName, address _approved) external {

require(eligibleToVoteAndPropose[_approved] == msg.sender, 'only approved entities can submit a proposition');
Proposal storage newProposal = proposals[_proposalName];

emit submitProposalEvent(_proposalName, _approved);

}

function giveRightToVoteAndPropose(address _voter) public {
    require(msg.sender == chairman, 'only chairman can give rights to vote');
    require(!voters[voter].voted, 'The voter has already voted');
    require(!eligibleToVoteAndPropose[voter].isApproved, 'voter is already approved');
    voters[voter].voteWeight = 1;
    voters[voter].isApproved =true;
    

    eligibleToVoteAndPropose[voter].isApproved = true;

}

function vote(uint _proposal) public {
    Voter storage sender = voters[msg.sender];
    require(sender.isApproved != false, 'voter is not approved to vote');
    require(sender.voted != true, 'cannot vote twice');
    sender.voted = true;
    sender.vote = proposal;
    proposals[proposal].voteCount += sender.vote;

    emit voteEvent(proposal);
}

function winningProposal() public view returns (uint _winningProposal) {

uint winningVoteCount = 0;
for(uint i = 0; i < proposals.length; i++) {
    if(proposals[i].voteCount > winningVoteCount) {
        winningVoteCount = proposals[i].voteCount;
        _winningProposal = i;
    }
}
emit winningProposalEvent(_winningProposal);
}

function winningName() public view returns (bytes32 _winningName) {
    _winningName = proposals[winningProposal()].name;
}

}





