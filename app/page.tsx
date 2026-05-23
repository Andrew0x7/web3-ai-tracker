'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Token {
  address: string;
  name: string;
  symbol: string;
  chain: 'Solana' | 'Base';
  price: number;
  volume24h: number;
  riskScore: number;
  status: 'Safe' | 'Warning' | 'Danger';
  timestamp: number;
}

interface Trade {
  id: string;
  token: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  profit: number;
  timestamp: number;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState({
    totalScanned: 0,
    safeTokens: 0,
    flaggedTokens: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    // Simulate real-time token scanning
    const interval = setInterval(() => {
      const newToken: Token = {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        name: ['MoonShot', 'SafeGem', 'RocketFi', 'DiamondDAO'][Math.floor(Math.random() * 4)],
        symbol: ['MOON', 'SAFE', 'ROCK', 'DIAM'][Math.floor(Math.random() * 4)],
        chain: Math.random() > 0.5 ? 'Solana' : 'Base',
        price: Math.random() * 10,
        volume24h: Math.random() * 1000000,
        riskScore: Math.random() * 100,
        status: Math.random() > 0.7 ? 'Safe' : Math.random() > 0.5 ? 'Warning' : 'Danger',
        timestamp: Date.now(),
      };

      setTokens(prev => [newToken, ...prev].slice(0, 10));
      
      setStats(prev => ({
        totalScanned: prev.totalScanned + 1,
        safeTokens: prev.safeTokens + (newToken.status === 'Safe' ? 1 : 0),
        flaggedTokens: prev.flaggedTokens + (newToken.status === 'Danger' ? 1 : 0),
        totalProfit: prev.totalProfit,
      }));

      // Simulate trades for safe tokens
      if (newToken.status === 'Safe' && Math.random() > 0.6) {
        const trade: Trade = {
          id: Math.random().toString(36).substr(2, 9),
          token: newToken.symbol,
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          amount: Math.random() * 1000,
          price: newToken.price,
          profit: (Math.random() - 0.3) * 500,
          timestamp: Date.now(),
        };
        
        setTrades(prev => [trade, ...prev].slice(0, 8));
        setStats(prev => ({
          ...prev,
          totalProfit: prev.totalProfit + trade.profit,
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const chartData = tokens.slice(0, 7).reverse().map(t => ({
    name: t.symbol,
    risk: t.riskScore,
  }));

  const pieData = [
    { name: 'Safe', value: stats.safeTokens },
    { name: 'Warning', value: Math.floor(stats.totalScanned * 0.3) },
    { name: 'Danger', value: stats.flaggedTokens },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Web3 AI Automation Ecosystem
          </h1>
          <p className="text-gray-400 text-lg">Real-time Token Security Analysis & Automated Trading</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Scanned</div>
            <div className="text-3xl font-bold text-cyan-400">{stats.totalScanned}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Safe Tokens</div>
            <div className="text-3xl font-bold text-green-400">{stats.safeTokens}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Flagged</div>
            <div className="text-3xl font-bold text-red-400">{stats.flaggedTokens}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Profit</div>
            <div className={`text-3xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats.totalProfit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Risk Score Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="risk" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Token Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Token Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Token Scanner
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tokens.map((token, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{token.name} ({token.symbol})</div>
                      <div className="text-xs text-gray-400">{token.chain}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      token.status === 'Safe' ? 'bg-green-500/20 text-green-400' :
                      token.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {token.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk: {token.riskScore.toFixed(1)}</span>
                    <span className="text-gray-400">${token.price.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Automated Trades
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {trades.map((trade, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{trade.token}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      trade.type === 'BUY' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {trade.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">${trade.amount.toFixed(2)}</span>
                    <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Claude Code, OpenClaw & Hermes Agent | Real-time Web3 Intelligence</p>
        </footer>
      </div>
    </div>
  );
}
