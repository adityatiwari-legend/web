'use client';

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Trade {
  id: number;
  type: string;
  asset: string;
  amount: string;
  price: string;
  time: string;
  status: string;
}

const defaultTrades: Trade[] = [
  { id: 1, type: 'sell', asset: 'Wheat Carbon', amount: '500 KG', price: '₹1,250', time: '10m ago', status: 'Completed' },
  { id: 2, type: 'buy', asset: 'Rice Methane', amount: '200 KG', price: '₹1,800', time: '1h ago', status: 'Processing' },
  { id: 3, type: 'sell', asset: 'Forestry', amount: '1000 KG', price: '₹2,200', time: '3h ago', status: 'Completed' },
  { id: 4, type: 'sell', asset: 'Compost', amount: '350 KG', price: '₹875', time: '5h ago', status: 'Completed' },
];

interface RecentTradesCardProps {
  trades?: Trade[] | null;
}

export default function RecentTradesCard({ trades }: RecentTradesCardProps) {
  const displayTrades = trades && trades.length > 0 ? trades : defaultTrades;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-[#1F2937]">Marketplace Activity</h3>
        <button className="text-xs font-semibold text-[#38B26D] hover:underline">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#6B7280] uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className={`flex items-center gap-2 ${trade.type === 'sell' ? 'text-red-500' : 'text-green-500'}`}>
                    {trade.type === 'sell' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    <span className="capitalize font-medium">{trade.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-[#1F2937]">{trade.asset}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{trade.amount}</td>
                <td className="px-4 py-3 text-right font-bold text-[#1F2937]">{trade.price}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
