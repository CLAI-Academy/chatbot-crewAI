
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MarketData } from './FinanceResponse';

interface MarketAnalysisProps {
  data: MarketData;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ data }) => {
  // Mock data for visual charts
  const marketTrendData = [
    { name: 'Ene', salud: 4000, tech: 2400, crypto: 1800 },
    { name: 'Feb', salud: 3000, tech: 2800, crypto: 3000 },
    { name: 'Mar', salud: 2000, tech: 3200, crypto: 1500 },
    { name: 'Abr', salud: 2780, tech: 3908, crypto: 2500 },
    { name: 'May', salud: 1890, tech: 4800, crypto: 3500 },
    { name: 'Jun', salud: 2390, tech: 3800, crypto: 2200 },
  ];
  
  const riskData = [
    { name: 'Bajo', value: 30 },
    { name: 'Medio', value: 40 },
    { name: 'Alto', value: 30 },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tendencias */}
        <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30">
          <CardHeader className="bg-blue-900/20 border-b border-gray-700/30">
            <CardTitle className="text-lg">Tendencias del Mercado</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-gray-300 mb-4">{data.tendencias}</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} 
                    />
                    <Line type="monotone" dataKey="salud" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="tech" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="crypto" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-2 space-x-6 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#10B981] mr-1"></div>
                  <span>Salud</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-1"></div>
                  <span>Tecnología</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6] mr-1"></div>
                  <span>Cripto</span>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        {/* Oportunidades */}
        <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30">
          <CardHeader className="bg-green-900/20 border-b border-gray-700/30">
            <CardTitle className="text-lg">Oportunidades</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-gray-300 mb-4">{data.oportunidades}</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} 
                    />
                    <Area type="monotone" dataKey="tech" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="salud" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="crypto" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        {/* Riesgos */}
        <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30">
          <CardHeader className="bg-red-900/20 border-b border-gray-700/30">
            <CardTitle className="text-lg">Riesgos</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-300 mb-4">{data.riesgos}</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} 
                      formatter={(value) => [`${value}%`, 'Nivel de Riesgo']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#F59E0B" />
                      <Cell fill="#EF4444" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
