const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("VotingSystem", function () {
  let chairman;
  let voter1;
  let votingSystem;

  beforeEach(async function () {
    [chairman, voter1] = await ethers.getSigners();
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
    await votingSystem.deployed();
  });

  it("should give right to vote and propose", async function () {
    await votingSystem.giveRightToVoteAndPropose(chairman.address);
    const isChairmanVoter = await votingSystem.voters(chairman.address);
    expect(isChairmanVoter).to.equal(true);
  });

  it("should submit proposal", async function () {
    await votingSystem.giveRightToVoteAndPropose(chairman.address);
    const proposalName = ethers.utils.formatBytes32String("Proposal 1");
    await votingSystem.submitProposal(proposalName, chairman.address);
    const proposals = await votingSystem.proposals(0);
    expect(proposals.proposalName).to.equal(proposalName);
  });

  it("should vote for proposal", async function () {
    await votingSystem.giveRightToVoteAndPropose(chairman.address);
    await votingSystem.giveRightToVoteAndPropose(voter1.address);
    const proposalName = ethers.utils.formatBytes32String("Proposal 1");
    await votingSystem.submitProposal(proposalName, chairman.address);
    await votingSystem.connect(voter1).vote(0);
    const proposals = await votingSystem.proposals(0);
    expect(proposals.voteCount).to.equal(1);
  });

  it("should calculate winning proposal", async function () {
    await votingSystem.giveRightToVoteAndPropose(chairman.address);
    await votingSystem.giveRightToVoteAndPropose(voter1.address);
    const proposalName1 = ethers.utils.formatBytes32String("Proposal 1");
    const proposalName2 = ethers.utils.formatBytes32String("Proposal 2");
    await votingSystem.submitProposal(proposalName1, chairman.address);
    await votingSystem.submitProposal(proposalName2, chairman.address);
    await votingSystem.connect(voter1).vote(0);
    await votingSystem.connect(chairman).vote(1);
    const winningProposalId = await votingSystem.winningProposal();
    expect(winningProposalId).to.equal(1);
  });
});

// addSnapshotBeforeRestoreAfterEach();

// describe("VotingSystem", function () {
//   let votingSystem;
//   let chairman;
//   let voter1;
//   let voter2;
//   let propositionName;
//   let propositonName2;

//   this.beforeEach(async function () {
//     [chairman, voter1, voter2] = await ethers.getSigners();
//     const VotingSystem = await ethers.getContractFactory("VotingSystem");
//     votingSystem = await VotingSystem.deploy();
//     await votingSystem.deployed();
//     // await votingSystem.transferOwnership(chairman.address);
//   });

//   it("should submit proposal", async function () {
//     await votingSystem.giveRightToVoteAndPropose(chairman.address);
//     await votingSystem.giveRightToVoteAndPropose(voter1.address);
//     const proposalName = ethers.utils.formatBytes32String("Proposal 1");
//     await votingSystem.submitProposal(proposalName, chairman.address);
//     const proposals = await votingSystem.proposals(0);
//     expect(proposals.name).to.equal(proposalName);
//   });

//   it("should vote for proposal", async function () {
//     await votingSystem.giveRightToVoteAndPropose(chairman.address);
//     await votingSystem.giveRightToVoteAndPropose(voter1.address);
//     const proposalName = ethers.utils.formatBytes32String("Proposal 1");
//     await votingSystem.submitProposal(
//       ethers.utils.formatBytes32String("Proposal 1"),
//       chairman.address
//     );
//     await votingSystem.vote(0, { signer: voter1.address });
//     const proposals = await votingSystem.proposals(0);
//     expect(proposals.voteCount).to.equal(1);
//   });

//   it("should calculate winning proposal", async function () {
//     await votingSystem.giveRightToVoteAndPropose(chairman.address);
//     await votingSystem.giveRightToVoteAndPropose(voter1.address);
//     await votingSystem.giveRightToVoteAndPropose(voter2.address);
//     const proposalName = ethers.utils.formatBytes32String("Proposal 1");
//     const proposalName2 = ethers.utils.formatBytes32String("Proposal 2");
//     const proposalName3 = ethers.utils.formatBytes32String("Proposal 3");
//     await votingSystem.submitProposal(
//       ethers.utils.formatBytes32String("Proposal 1"),
//       chairman.address
//     );
//     await votingSystem.submitProposal(
//       ethers.utils.formatBytes32String("Proposal 2"),
//       chairman.address
//     );
//     await votingSystem.submitProposal(
//       ethers.utils.formatBytes32String("Proposal 3"),
//       chairman.address
//     );
//     await votingSystem.vote(0, { from: voter1.address });
//     await votingSystem.vote(0, { from: voter2.address });
//     await votingSystem.vote(1, { from: voter1.address });
//     await votingSystem.vote(1, { from: voter2.address });
//     await votingSystem.vote(2, { from: voter1.address });
//     await votingSystem.winningProposal();
//     const winningProposalName = await votingSystem.winningName();
//     expect(winningProposalName).to.equal("Proposal 1");
//   });
// });

// describe("Voting System", function () {
//   let votingSystem;
//   let deployer;
//   let votingSystemFactory;
//   let owner;
//   let addr1;
//   let addr2;

//   this.beforeAll(async function () {
//     [deployer, addr1] = await ethers.getSigners();
//     votingSystemFactory = await ethers.getContractFactory(
//       "VotingSystem",
//       deployer
//     );
//     votingSystem = await votingSystemFactory.deploy();
//     await votingSystem.deployed();
//   });

//   describe("constructor", () => {
//     it("should initialize proposals array correctly", async function () {
//       const proposalNames = ["proposal 1", "proposal 2", "proposal 3"];
//       const proposalLength = await votingSystem.getProposalsLength();
//       expect(proposalLength).to.equal(3);

//       for (let i = 0; i < proposalLength; i++) {
//         const proposal = await votingSystem.proposals(i);
//         expect(proposal.name).to.equal("proposal " + (i + 1));
//         expect(proposal.voteCount).to.equal(0);
//         expect(proposal.personAddress).to.equal(
//           "0x0000000000000000000000000000000000000000"
//         );
//       }
//     });
//   });

//   // nested describe

//   describe("Should set the right owner", async function () {
//     const { hardhatSystem, owner } = await loadFixture(deployContract);
//     expect(await hardhatSystem.owner()).to.equal(owner.address);
//   });
// });

// xdescribe("only chairmen should be able to give the right to vote", async function () {
//   // const systemCustom =
// });

// describe("Should be able to submit a proposal", async function () {});

// async function addSnapshotBeforeRestoreAfterEach() {
//   let lastSnapshotId;
//   beforeEach(async () => {
//     lastSnapshotId = await takeSnapshot();
//   });

//   afterEach(async () => {
//     await restoreSnapshot(lastSnapshotId);
//   });
// }
// async function takeSnapshot() {
//   const result = await ethers.provider.send("evm_snapshot", []);

//   await mineBlock();

//   return result;
// }

// async function restoreSnapshot(id) {
//   await ethers.provider.send("evm_revert", [id]);
//   await mineBlock();
// }

// const mineBlock = async () => await ethers.provider.send("evm_mine", []);
