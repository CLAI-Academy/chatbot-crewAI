
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Importación dinámica de Recharts para evitar problemas de SSR
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Comparison {
  nombre_escenario: string;
  nivel_riesgo: string;
  ganancia_total: number;
  ingreso_mensual: number;
  recomendado: boolean;
  razon_recomendacion: string;
}

interface ComparisonTableProps {
  comparisons: Comparison[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparisons }) => {
  console.log("🔍 ComparisonTable - recibidas comparaciones:", comparisons);
  
  // Safety check for empty or invalid data
  if (!comparisons || comparisons.length === 0) {
    console.warn("⚠️ No hay comparaciones para mostrar");
    return (
      <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30 p-4">
        <p className="text-gray-400">No hay datos comparativos disponibles</p>
      </Card>
    );
  }
  
  const chartData = comparisons.map(comp => ({
    name: comp.nombre_escenario,
    ganancia: comp.ganancia_total,
    ingreso: comp.ingreso_mensual,
    riesgo: (comp.nivel_riesgo?.toLowerCase() ?? '') === 'bajo' ? 1 : 
            (comp.nivel_riesgo?.toLowerCase() ?? '') === 'medio' ? 2 : 3
  }));

  const recommendedScenario = comparisons.find(comp => comp.recomendado);
  console.log("🔍 Escenario recomendado:", recommendedScenario);
  
  // Get color based on risk level
  const getRiskColor = (risk = '') => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes('bajo')) return '#10B981'; // green
    if (riskLower.includes('medio')) return '#F59E0B'; // amber
    if (riskLower.includes('alto')) return '#EF4444'; // red
    return '#3B82F6'; // blue (default)
  };

  console.log("🎨 Datos para gráfico:", chartData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Highlighted recommendation */}
      {recommendedScenario && (
        <motion.div 
          className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4 mb-6"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-blue-300">Recomendación</h3>
          <p className="text-sm mb-1">Recomendamos el <span className="font-semibold text-blue-300">{recommendedScenario.nombre_escenario}</span></p>
          <p className="text-sm text-gray-300">{recommendedScenario.razon_recomendacion}</p>
        </motion.div>
      )}
      
      {/* Comparison charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Ganancia total chart */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
          <h3 className="text-sm font-semibold mb-4 text-center">Comparativa de Ganancia Total</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} 
                  formatter={(value) => [`${Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value as number)}`, 'Ganancia']}
                />
                <Bar 
                  dataKey="ganancia" 
                  name="Ganancia Total"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-ganancia-${index}`} fill={getRiskColor(comparisons[index]?.nivel_riesgo || '')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Ingreso mensual chart */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
          <h3 className="text-sm font-semibold mb-4 text-center">Comparativa de Ingreso Mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }} 
                  formatter={(value) => [`${Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value as number)}`, 'Ingreso Mensual']}
                />
                <Bar 
                  dataKey="ingreso" 
                  name="Ingreso Mensual" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-ingreso-${index}`} fill={getRiskColor(comparisons[index]?.nivel_riesgo || '')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Comparison table */}
      <div className="rounded-lg overflow-hidden border border-gray-700/30">
        <Table>
          <TableHeader className="bg-gray-800/60">
            <TableRow>
              <TableHead className="text-gray-300">Escenario</TableHead>
              <TableHead className="text-gray-300">Nivel de Riesgo</TableHead>
              <TableHead className="text-gray-300 text-right">Ganancia Total</TableHead>
              <TableHead className="text-gray-300 text-right">Ingreso Mensual</TableHead>
              <TableHead className="text-gray-300 text-center">Recomendado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((comparison) => (
              <TableRow key={comparison.nombre_escenario} className={comparison.recomendado ? 'bg-blue-900/10' : ''}>
                <TableCell className="font-medium">{comparison.nombre_escenario}</TableCell>
                <TableCell>
                  <Badge 
                    className={`bg-opacity-20 border ${
                      (comparison.nivel_riesgo?.toLowerCase() ?? '').includes('bajo')
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : (comparison.nivel_riesgo?.toLowerCase() ?? '').includes('medio')
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' 
                          : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}
                  >
                    {comparison.nivel_riesgo}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(comparison.ganancia_total)}
                </TableCell>
                <TableCell className="text-right">
                  {Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(comparison.ingreso_mensual)}
                </TableCell>
                <TableCell className="text-center">
                  {comparison.recomendado ? (
                    <motion.div 
                      className="flex justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Badge className="bg-green-500/20 border border-green-500/30 text-green-400">
                        Recomendado
                      </Badge>
                    </motion.div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};
