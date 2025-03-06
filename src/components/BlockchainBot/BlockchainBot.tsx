import React, { useState, useEffect } from 'react';
import { ChevronDown, Wallet, Rocket, Coins, AlertCircle } from 'lucide-react';
import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';
import Web3 from 'web3';

interface Chain {
  id: string;
  name: string;
  symbol: string;
  nativeToken: string;
  rpcUrl: string;
  chainId?: number; // Optional for non-EVM chains
  explorer: string;
}

const chains: Chain[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    nativeToken: 'SOL',
    rpcUrl: 'https://api.devnet.solana.com',
    explorer: 'https://explorer.solana.com'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    nativeToken: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
    chainId: 1,
    explorer: 'https://etherscan.io'
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    nativeToken: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: 56,
    explorer: 'https://bscscan.com'
  },
];

const chainTokens: Record<string, Array<{
  symbol: string;
  address: string;
  decimals: number;
}>> = {
  solana: [
    { symbol: 'SOL', address: 'native', decimals: 9 },
    { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
    { symbol: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', decimals: 6 },
  ],
  ethereum: [
    { symbol: 'ETH', address: 'native', decimals: 18 },
    { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6 },
    { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
  ],
  bsc: [
    { symbol: 'BNB', address: 'native', decimals: 18 },
    { symbol: 'BUSD', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56', decimals: 18 },
    { symbol: 'CAKE', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', decimals: 18 },
  ],
};

interface BlockchainConnection {
  provider: any;
  connected: boolean;
  balance: string | null;
  error: string | null;
}

export function BlockchainBot() {
  const [selectedChain, setSelectedChain] = useState<Chain>(chains[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [connection, setConnection] = useState<BlockchainConnection>({
    provider: null,
    connected: false,
    balance: null,
    error: null,
  });

  const connectToChain = async (chain: Chain) => {
    try {
      let provider;
      let balance = null;

      if (chain.id === 'solana') {
        provider = new Connection(chain.rpcUrl, 'confirmed');
        // For Solana, we'd need a wallet adapter to get the balance
      } else {
        // For EVM chains
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chain.chainId!.toString(16)}` }],
          });
          provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const rawBalance = await provider.getBalance(address);
          balance = ethers.utils.formatEther(rawBalance);
        } else {
          throw new Error('Please install a Web3 wallet');
        }
      }

      setConnection({
        provider,
        connected: true,
        balance,
        error: null,
      });
    } catch (error) {
      setConnection({
        provider: null,
        connected: false,
        balance: null,
        error: error instanceof Error ? error.message : 'Failed to connect',
      });
    }
  };

  const predictToken = (input: string): string | null => {
    if (!input) return null;
    
    const upperInput = input.toUpperCase();
    const currentChainTokens = chainTokens[selectedChain.id];
    const tokenExists = currentChainTokens.some(token => token.symbol === upperInput);
    
    if (tokenExists) return null;
    
    for (const [chainId, tokens] of Object.entries(chainTokens)) {
      if (chainId !== selectedChain.id) {
        const found = tokens.find(token => token.symbol === upperInput);
        if (found) {
          const chain = chains.find(c => c.id === chainId);
          return `Did you mean ${upperInput} on ${chain?.name}?`;
        }
      }
    }
    
    return null;
  };

  const handleChainSwitch = async (chain: Chain) => {
    setSelectedChain(chain);
    setIsOpen(false);
    setTokenInput('');
    await connectToChain(chain);
  };

  const prediction = predictToken(tokenInput);

  return (
    <div className="w-full border-b border-[#ff0044] bg-[#0a0a0a] shadow-[0_0_20px_rgba(255,0,68,0.3)]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="retro-button flex items-center space-x-2"
              >
                <Rocket className="w-4 h-4" />
                <span className="text-sm">{selectedChain.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#0a0a0a] rounded pixel-border py-1 z-50">
                  {chains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => handleChainSwitch(chain)}
                      className="w-full px-4 py-2 text-left hover:bg-[#1a1a1a] transition-colors text-[#ff0044]"
                    >
                      {chain.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative flex-1">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-[#ff0044]" />
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={`Enter ${selectedChain.name} token...`}
                  className="w-96 px-4 py-2 rounded bg-[#1a1a1a] border border-[#ff0044] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff0044] focus:border-transparent"
                />
              </div>
              {prediction && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] rounded pixel-border p-3 text-sm text-[#ff0044]">
                  {prediction}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {connection.balance && (
              <span className="text-[#ff0044] font-press-start text-sm">
                {connection.balance} {selectedChain.symbol}
              </span>
            )}
            {connection.error && (
              <div className="flex items-center text-[#ff0044]">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{connection.error}</span>
              </div>
            )}
            <button
              onClick={() => connectToChain(selectedChain)}
              className="retro-button flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm">
                {connection.connected ? 'Connected' : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}