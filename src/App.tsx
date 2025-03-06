import React from 'react';
import { BlockchainBot } from './components/BlockchainBot/BlockchainBot';
import { Rocket, Coins, Image, Notebook as Robot } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] space-gradient">
      <BlockchainBot />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold neon-text mb-4 font-['Press_Start_2P']">MOONPAD</h1>
          <p className="text-gray-400 text-lg">Your Retro-Futuristic Launch Pad to the Crypto Universe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "DEX Trading",
              icon: <Coins className="w-8 h-8 text-[#ff0044]" />,
              description: "Swap tokens across multiple chains with retro-style simplicity"
            },
            {
              title: "NFT Launch Pad",
              icon: <Image className="w-8 h-8 text-[#ff0044]" />,
              description: "Mint and trade pixel-perfect NFTs in our 16-bit marketplace"
            },
            {
              title: "AI Trading Bot",
              icon: <Robot className="w-8 h-8 text-[#ff0044]" />,
              description: "Let our AI co-pilot handle your trades with algorithmic precision"
            },
            {
              title: "Multi-Chain",
              icon: <Rocket className="w-8 h-8 text-[#ff0044]" />,
              description: "Navigate seamlessly between blockchain galaxies"
            }
          ].map((feature, index) => (
            <div key={index} className="retro-container p-6 rounded-lg transform hover:scale-105 transition-transform">
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="mt-4 mb-2 text-xl font-bold text-[#ff0044] font-['Press_Start_2P'] text-sm">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 retro-container p-8 rounded-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#ff0044] font-['Press_Start_2P'] mb-4">
                Ready for Launch?
              </h2>
              <p className="text-gray-400 mb-6">
                Join the next generation of crypto trading with our retro-futuristic platform.
              </p>
              <button className="retro-button">
                Start Trading
              </button>
            </div>
            <div className="relative h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff0044] to-[#0099ff] opacity-20 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket className="w-24 h-24 text-[#ff0044]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;