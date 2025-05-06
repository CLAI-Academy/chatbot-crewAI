
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import { Scenario } from './FinanceResponse';

interface ScenarioCardProps {
  scenario: Scenario;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const { nombre_escenario, nivel_riesgo, inversion_total, inversiones, explicacion, pasos_a_seguir, objetivo } = scenario;
  
  // Determine color based on risk level
  const getRiskColor = () => {
    switch (nivel_riesgo.toLowerCase()) {
      case 'bajo': return '#10B981'; // green
      case 'medio': return '#F59E0B'; // amber
      case 'alto': return '#EF4444'; // red
      default: return '#3B82F6'; // blue
    }
  };
  
  // Format data for pie chart
  const pieChartData = inversiones.map(inv => ({
    name: inv.nombre,
    value: inv.porcentaje
  }));
  
  // Format data for bar chart
  const barChartData = inversiones.map(inv => ({
    name: inv.nombre,
    rentabilidad: inv.rentabilidad_esperada,
    ingreso: inv.ingreso_mensual
  }));
  
  // Custom colors for pie chart
  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#14B8A6'];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-full bg-gray-800/40 border-gray-700/30 overflow-hidden shadow-lg backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-b border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">{nombre_escenario}</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Inversión total: ${inversion_total.toLocaleString()}</p>
            </div>
            <Badge 
              className={`bg-opacity-20 border ${
                nivel_riesgo.toLowerCase() === 'bajo' 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                  : nivel_riesgo.toLowerCase() === 'medio' 
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' 
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}
            >
              Riesgo {nivel_riesgo}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <p className="mb-4 text-sm text-gray-300">{explicacion}</p>
          
          {/* Investment charts section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Pie chart for porcentaje */}
            <div className="h-[180px] bg-gray-900/30 rounded-lg p-2">
              <h4 className="text-xs uppercase text-gray-400 font-semibold text-center mb-1">Distribución</h4>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Bar chart for rentabilidad */}
            <div className="h-[180px] bg-gray-900/30 rounded-lg p-2">
              <h4 className="text-xs uppercase text-gray-400 font-semibold text-center mb-1">Rentabilidad esperada</h4>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="rentabilidad" fill={getRiskColor()} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Investment details */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-2">Detalle de inversiones</h4>
            <div className="space-y-4">
              {inversiones.map((inversion, i) => (
                <div key={i} className="bg-gray-900/30 p-3 rounded-lg border border-gray-700/30">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{inversion.nombre}</span>
                    <Badge variant="outline">{inversion.tipo_inversion}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{inversion.descripcion}</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div className="bg-gray-800/40 p-1 rounded">
                      <div className="text-gray-400">Porcentaje</div>
                      <div className="font-bold">{inversion.porcentaje}%</div>
                    </div>
                    <div className="bg-gray-800/40 p-1 rounded">
                      <div className="text-gray-400">Rentabilidad</div>
                      <div className="font-bold">{inversion.rentabilidad_esperada}%</div>
                    </div>
                    <div className="bg-gray-800/40 p-1 rounded">
                      <div className="text-gray-400">Ingreso mensual</div>
                      <div className="font-bold">${inversion.ingreso_mensual}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <h5 className="font-medium mb-1 text-green-400">Ventajas</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {inversion.ventajas.map((ventaja, j) => (
                          <li key={j}>{ventaja}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1 text-red-400">Desventajas</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {inversion.desventajas.map((desventaja, j) => (
                          <li key={j}>{desventaja}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Steps to follow */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-2">Pasos a seguir</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              {pasos_a_seguir.map((paso, i) => (
                <li key={i} className="p-2 rounded bg-gray-900/20 border-l-2 border-blue-500/50">
                  {paso}
                </li>
              ))}
            </ol>
          </div>
          
          {/* Objective */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-1">Objetivo</h4>
            <p className="text-sm">{objetivo}</p>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-900/20 border-t border-gray-700/30 p-3 text-xs text-gray-400">
          <div className="flex justify-between w-full">
            <span>Tiempo recomendado: {scenario.tiempo_recomendado}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
