// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CommunityHealthDAO
 * @dev A decentralized autonomous organization (DAO) for healthcare funding proposals.
 */
contract CommunityHealthDAO is ERC20, AccessControl, ReentrancyGuard {
    // DAO roles
    bytes32 public constant COMMITTEE_ROLE = keccak256("COMMITTEE_ROLE");

    // Stablecoin used for funding proposals
    IERC20 public paymentToken;

    // Governance parameters
    uint256 public proposalCount;
    uint256 public votingDuration = 3 days;
    uint256 public quorumPercentage = 20;
    uint256 public majorityPercentage = 51;

    // Proposal lifecycle
    enum ProposalState { Pending, Active, Executed, Rejected }

    struct Proposal {
        uint256 id;
        string description;
        string ipfsHash;
        address recipient;
        uint256 amount;
        uint256 voteYesWeight;
        uint256 voteNoWeight;
        uint256 deadline;
        bool executed;
        ProposalState state;
    }

    // Mappings
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public hasMinted;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public voted;

    // Events
    event Whitelisted(address indexed user);
    event ProposalCreated(uint256 indexed id, string description, address indexed recipient, uint256 amount, string ipfsHash);
    event Voted(uint256 indexed proposalId, address indexed voter, bool vote, uint256 weight);
    event ProposalExecuted(uint256 indexed id, bool approved);

    constructor(address _paymentToken) ERC20("HealthToken", "HLT") {
        paymentToken = IERC20(_paymentToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMMITTEE_ROLE, msg.sender);
    }

    // Whitelist a member (only by committee)
    function whitelistMember(address _member) external onlyRole(COMMITTEE_ROLE) {
        whitelisted[_member] = true;
        emit Whitelisted(_member);
    }

    // Mint one membership token to a whitelisted user
    function mintMembership() external {
        require(whitelisted[msg.sender], "Not whitelisted");
        require(!hasMinted[msg.sender], "Already minted");

        _mint(msg.sender, 1 * 10 ** decimals());
        hasMinted[msg.sender] = true;
    }

    // Create a proposal
    function createProposal(
        string memory _description,
        string memory _ipfsHash,
        address _recipient,
        uint256 _amount
    ) external {
        require(balanceOf(msg.sender) > 0, "Not a member");

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            ipfsHash: _ipfsHash,
            recipient: _recipient,
            amount: _amount,
            voteYesWeight: 0,
            voteNoWeight: 0,
            deadline: block.timestamp + votingDuration,
            executed: false,
            state: ProposalState.Active
        });

        emit ProposalCreated(proposalCount, _description, _recipient, _amount, _ipfsHash);
        proposalCount++;
    }

    // Vote on a proposal
    function voteOnProposal(uint256 _id, bool _support) external {
        Proposal storage proposal = proposals[_id];

        require(balanceOf(msg.sender) > 0, "Not a member");
        require(!voted[_id][msg.sender], "Already voted");
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(proposal.state == ProposalState.Active, "Not active");

        uint256 weight = balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        if (_support) {
            proposal.voteYesWeight += weight;
        } else {
            proposal.voteNoWeight += weight;
        }

        voted[_id][msg.sender] = true;
        emit Voted(_id, msg.sender, _support, weight);
    }

    // Execute proposal after deadline
    function executeProposal(uint256 _id) external nonReentrant {
        Proposal storage proposal = proposals[_id];

        require(block.timestamp >= proposal.deadline, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.state == ProposalState.Active, "Not active");

        proposal.executed = true;

        uint256 totalVotes = proposal.voteYesWeight + proposal.voteNoWeight;
        uint256 quorum = (totalSupply() * quorumPercentage) / 100;

        if (totalVotes < quorum) {
            proposal.state = ProposalState.Rejected;
            emit ProposalExecuted(_id, false);
            return;
        }

        uint256 yesRatio = (proposal.voteYesWeight * 100) / totalVotes;

        if (yesRatio >= majorityPercentage) {
            proposal.state = ProposalState.Executed;
            require(paymentToken.transfer(proposal.recipient, proposal.amount), "Transfer failed");
            emit ProposalExecuted(_id, true);
        } else {
            proposal.state = ProposalState.Rejected;
            emit ProposalExecuted(_id, false);
        }
    }

    // Committee deposits stablecoin into DAO
    function depositFunds(uint256 amount) external onlyRole(COMMITTEE_ROLE) {
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Deposit failed");
    }

    // View individual proposal
    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }

    // Check if a user has voted
    function hasVoted(uint256 id, address user) external view returns (bool) {
        return voted[id][user];
    }

    // Return list of all active proposals
    function getActiveProposals() external view returns (Proposal[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < proposalCount; i++) {
            if (proposals[i].state == ProposalState.Active) count++;
        }

        Proposal[] memory active = new Proposal[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < proposalCount; i++) {
            if (proposals[i].state == ProposalState.Active) {
                active[index++] = proposals[i];
            }
        }

        return active;
    }
}