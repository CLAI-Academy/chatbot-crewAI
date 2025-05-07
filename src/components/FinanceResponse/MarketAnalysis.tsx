
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MarketData } from './FinanceResponse';

interface MarketAnalysisProps {
  data: MarketData;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ data }) => {
  console.log("🔍 MarketAnalysis - Datos:", data);

  // Chart data for sentiment analysis
  const sentimentData = [
    { name: 'Optimismo', value: 60 },
    { name: 'Precaución', value: 40 }
  ];

  const COLORS = ['#4338CA', '#6D28D9'];

  // Determine whether to use "riesgos" or "retos" based on what's available
  const challengesField = data.riesgos ? 'riesgos' : 'retos';
  const challenges = data[challengesField as keyof MarketData] as string;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-6">
        {/* Tendencias del Mercado */}
        <div className="bg-gray-800/40 rounded-lg border border-gray-700/30 overflow-hidden">
          <div className="p-4 bg-indigo-900/20 border-b border-gray-700/30">
            <h3 className="text-lg font-semibold">Tendencias del Mercado</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-300">{data.tendencias}</p>
          </div>
        </div>

        {/* Oportunidades de Inversión */}
        <div className="bg-gray-800/40 rounded-lg border border-gray-700/30 overflow-hidden">
          <div className="p-4 bg-blue-900/20 border-b border-gray-700/30">
            <h3 className="text-lg font-semibold">Oportunidades de Inversión</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-300">{data.oportunidades}</p>
          </div>
        </div>

        {/* Riesgos y Desafíos */}
        {challenges && (
          <div className="bg-gray-800/40 rounded-lg border border-gray-700/30 overflow-hidden">
            <div className="p-4 bg-red-900/20 border-b border-gray-700/30">
              <h3 className="text-lg font-semibold">{challengesField === 'riesgos' ? 'Riesgos' : 'Retos'}</h3>
            </div>
            <div className="p-5">
              <p className="text-gray-300">{challenges}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Column */}
      <div className="flex flex-col space-y-6">
        <div className="bg-gray-800/40 rounded-lg border border-gray-700/30 h-full">
          <div className="p-4 bg-violet-900/20 border-b border-gray-700/30">
            <h3 className="text-lg font-semibold">Sentimiento del Mercado</h3>
          </div>
          <div className="p-5 flex flex-col items-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-8">
              {sentimentData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-center text-gray-400">
              Basado en el análisis de tendencias actuales, noticias y datos del mercado.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
