import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Vote, 
  Plus, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Upload,
  Shield,
  Activity,
  Heart
} from 'lucide-react';

// Mock Web3 connection (replace with actual Web3 integration)
const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isCommittee, setIsCommittee] = useState(false);

  const connectWallet = async () => {
    // Mock connection
    setAccount('0x1234...5678');
    setIsWhitelisted(true);
    setTokenBalance(5);
    setIsCommittee(false);
  };

  return { account, isWhitelisted, tokenBalance, isCommittee, connectWallet };
};

// Mock data
const mockProposals = [
  {
    id: 1,
    title: "Malaria Treatment for Mazi",
    description: "Emergency funding needed for antimalarial medication and hospital fees",
    recipient: "0xabcd...efgh",
    amount: 10,
    votesFor: 12,
    votesAgainst: 3,
    totalVotes: 15,
    quorumMet: true,
    status: "active",
    timeLeft: "2 days",
    ipfsHash: "QmHash123...",
    creator: "0x1111...2222"
  },
  {
    id: 2,
    title: "Diabetes Medication Fund",
    description: "Monthly insulin supply for community member with Type 1 diabetes",
    recipient: "0x9876...5432",
    amount: 25,
    votesFor: 8,
    votesAgainst: 2,
    totalVotes: 10,
    quorumMet: false,
    status: "active",
    timeLeft: "1 day",
    ipfsHash: "QmHash456...",
    creator: "0x3333...4444"
  },
  {
    id: 3,
    title: "Child Surgery Fund",
    description: "Urgent surgical procedure for 8-year-old community member",
    recipient: "0x1357...2468",
    amount: 150,
    votesFor: 18,
    votesAgainst: 2,
    totalVotes: 20,
    quorumMet: true,
    status: "executed",
    timeLeft: "Completed",
    ipfsHash: "QmHash789...",
    creator: "0x5555...6666"
  }
];

const HealthcareDAO = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [proposals, setProposals] = useState(mockProposals);
  const [treasuryBalance, setTreasuryBalance] = useState(2500);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const { account, isWhitelisted, tokenBalance, isCommittee, connectWallet } = useWeb3();

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    recipient: '',
    amount: '',
    evidence: null
  });

  const handleVote = (proposalId, vote) => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        const newVotesFor = vote === 'for' ? p.votesFor + 1 : p.votesFor;
        const newVotesAgainst = vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst;
        const newTotalVotes = newVotesFor + newVotesAgainst;
        return {
          ...p,
          votesFor: newVotesFor,
          votesAgainst: newVotesAgainst,
          totalVotes: newTotalVotes,
          quorumMet: newTotalVotes >= 4 // 20% of 20 total members
        };
      }
      return p;
    }));
  };

  const submitProposal = () => {
    if (!newProposal.title || !newProposal.recipient || !newProposal.amount) return;
    
    const proposal = {
      id: proposals.length + 1,
      title: newProposal.title,
      description: newProposal.description,
      recipient: newProposal.recipient,
      amount: parseInt(newProposal.amount),
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorumMet: false,
      status: "active",
      timeLeft: "3 days",
      ipfsHash: "QmNewHash...",
      creator: account
    };
    
    setProposals([proposal, ...proposals]);
    setNewProposal({ title: '', description: '', recipient: '', amount: '', evidence: null });
    setShowProposalForm(false);
  };

  const mintToken = () => {
    // Mock minting - in real app, call smart contract
    alert('Token minting request sent! (Mock implementation)');
  };

  const WalletConnection = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Connect your wallet to access the Healthcare DAO</p>
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Your HLT Tokens</p>
              <p className="text-3xl font-bold text-green-900">{tokenBalance}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Treasury Balance</p>
              <p className="text-3xl font-bold text-blue-900">${treasuryBalance}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">Active Proposals</p>
              <p className="text-3xl font-bold text-purple-900">{proposals.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Vote className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 text-sm font-medium">Members Helped</p>
              <p className="text-3xl font-bold text-orange-900">24</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Member Status */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Member Status</h3>
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${isWhitelisted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isWhitelisted ? '✓ Whitelisted' : '✗ Not Whitelisted'}
          </div>
          {tokenBalance === 0 && isWhitelisted && (
            <button
              onClick={mintToken}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Mint HLT Token
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const ProposalCard = ({ proposal }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{proposal.title}</h3>
            <p className="text-gray-600 mb-3">{proposal.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Amount: ${proposal.amount}</span>
              <span>•</span>
              <span>Recipient: {proposal.recipient.slice(0, 6)}...{proposal.recipient.slice(-4)}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            proposal.status === 'active' ? 'bg-blue-100 text-blue-800' :
            proposal.status === 'executed' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {proposal.status}
          </div>
        </div>

        {/* Voting Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Voting Progress</span>
            <span className="text-gray-900 font-medium">{proposal.totalVotes} votes</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="flex h-full rounded-full overflow-hidden">
              <div 
                className="bg-green-500"
                style={{ width: `${(proposal.votesFor / Math.max(proposal.totalVotes, 1)) * 100}%` }}
              ></div>
              <div 
                className="bg-red-500"
                style={{ width: `${(proposal.votesAgainst / Math.max(proposal.totalVotes, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>For: {proposal.votesFor} | Against: {proposal.votesAgainst}</span>
            <span className={`font-medium ${proposal.quorumMet ? 'text-green-600' : 'text-orange-600'}`}>
              {proposal.quorumMet ? 'Quorum Met' : 'Needs Quorum'}
            </span>
          </div>
        </div>

        {/* Time Left */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{proposal.timeLeft}</span>
          </div>
        </div>

        {/* Voting Buttons */}
        {proposal.status === 'active' && tokenBalance > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleVote(proposal.id, 'for')}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Vote For</span>
            </button>
            <button
              onClick={() => handleVote(proposal.id, 'against')}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Vote Against</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ProposalForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Proposal</h2>
          <button
            onClick={() => setShowProposalForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newProposal.title}
              onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Emergency surgery for community member"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newProposal.description}
              onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of the medical need and treatment required..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
            <input
              type="text"
              value={newProposal.recipient}
              onChange={(e) => setNewProposal({...newProposal, recipient: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
            <input
              type="number"
              value={newProposal.amount}
              onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Evidence</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload medical documents or proof</p>
              <p className="text-sm text-gray-400">Files will be stored on IPFS</p>
              <input
                type="file"
                className="mt-4"
                onChange={(e) => setNewProposal({...newProposal, evidence: e.target.files[0]})}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowProposalForm(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={submitProposal}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Submit Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Proposals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Healthcare Proposals</h2>
        {tokenBalance > 0 && (
          <button
            onClick={() => setShowProposalForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Proposal</span>
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {proposals.map(proposal => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <WalletConnection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Healthcare DAO</h1>
                <p className="text-sm text-gray-600">Community Health Funding</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {tokenBalance} HLT
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'dashboard' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Activity className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('proposals')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'proposals' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Vote className="h-5 w-5" />
            <span>Proposals</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'proposals' && <Proposals />}
      </main>

      {/* Proposal Form Modal */}
      {showProposalForm && <ProposalForm />}
    </div>
  );
};

export default HealthcareDAO;