'use client';

import { CheckCircle2, Clock, Link as LinkIcon } from 'lucide-react';

interface TokenizationProps {
  minted: number;
  pending: number;
  transactions: {
    id: string;
    status: 'success' | 'pending';
    hash: string;
  }[];
}

export default function CarbonTokenizationCard({ minted, pending, transactions }: TokenizationProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform h-full flex flex-col">
      <h3 className="text-base font-medium text-[#1F2937] mb-6">Carbon Tokenization</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-[#6B7280]">Tokens Minted</p>
          <p className="text-2xl font-bold text-[#38B26D] mt-1">{minted.toLocaleString()}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-sm text-[#6B7280]">Pending Verification</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{pending.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-semibold text-[#1F2937] mb-3">Recent Transactions</h4>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {tx.status === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-[#38B26D]" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-sm font-medium text-[#1F2937]">Batch #{tx.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {tx.status}
                </span>
                <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5BA6FF]">
                  <LinkIcon className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
