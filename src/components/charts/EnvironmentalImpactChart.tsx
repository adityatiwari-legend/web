'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'CO₂ Captured', value: 450, color: '#3FD3C4' },     // Teal
  { name: 'Trees Planted', value: 300, color: '#5BA6FF' },    // Blue (using blue for trees/water mix metaphor or just distinct)
  { name: 'Water Saved', value: 200, color: '#8E6CFF' },      // Purple
];

const COLORS = ['#3FD3C4', '#5BA6FF', '#8E6CFF'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function EnvironmentalImpactChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform h-full flex flex-col items-center justify-center">
      <h3 className="text-base font-medium text-[#1F2937] mb-2 self-start w-full">Environmental Impact</h3>
      
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center">
         <div>
            <p className="text-xl font-bold text-[#3FD3C4]">450t</p>
            <p className="text-xs text-gray-500">CO₂</p>
         </div>
         <div>
            <p className="text-xl font-bold text-[#5BA6FF]">300</p>
            <p className="text-xs text-gray-500">Trees</p>
         </div>
         <div>
            <p className="text-xl font-bold text-[#8E6CFF]">200kL</p>
            <p className="text-xs text-gray-500">Water</p>
         </div>
      </div>
    </div>
  );
}
