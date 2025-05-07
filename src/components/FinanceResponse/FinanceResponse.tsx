
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScenarioCard } from './ScenarioCard';
import { ComparisonTable } from './ComparisonTable';
import { MarketAnalysis } from './MarketAnalysis';
import { RecommendationsList } from './RecommendationsList';
import { FAQAccordion } from './FAQAccordion';
import { TipsList } from './TipsList';

export interface Investment {
  tipo_inversion: string;
  nombre: string;
  porcentaje: number;
  rentabilidad_esperada: number;
  ingreso_mensual: number;
  descripcion: string;
  ventajas: string[];
  desventajas: string[];
}

export interface Scenario {
  nombre_escenario: string;
  nivel_riesgo: string;
  inversion_total: number;
  inversiones: Investment[];
  explicacion: string;
  pasos_a_seguir: string[];
  tiempo_recomendado: string;
  objetivo: string;
}

export interface Comparison {
  nombre_escenario: string;
  nivel_riesgo: string;
  ganancia_total: number;
  ingreso_mensual: number;
  recomendado: boolean;
  razon_recomendacion: string;
}

export interface MarketData {
  tendencias: string;
  oportunidades: string;
  riesgos?: string;
  retos?: string;
}

export interface Recommendations {
  [key: string]: string;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}

export interface FinanceData {
  escenarios: Scenario[];
  comparaciones: Comparison[];
  analisis_mercado: MarketData;
  recomendaciones: Recommendations;
  preguntas_frecuentes: FAQ[];
  consejos_practicos: string[];
}

interface FinanceResponseProps {
  data: FinanceData;
}

const FinanceResponse: React.FC<FinanceResponseProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll into view when component mounts
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  }, []);
  
  return (
    <motion.div
      ref={containerRef}
      className="w-full mb-8 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <Card className="bg-gradient-to-b from-gray-900/90 to-gray-800/90 border border-gray-700/30 shadow-lg backdrop-blur-sm text-white">
        <CardHeader className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-gray-700/30">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Análisis Financiero
              </CardTitle>
              <CardDescription className="text-gray-300 mt-1">
                Recomendaciones personalizadas basadas en tu consulta
              </CardDescription>
            </div>
            <motion.div 
              className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full"
              animate={{ 
                boxShadow: ['0 0 0 rgba(59, 130, 246, 0)', '0 0 15px rgba(59, 130, 246, 0.5)', '0 0 0 rgba(59, 130, 246, 0)'] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm font-semibold text-blue-300">Análisis Completo</span>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="w-full grid grid-cols-5 rounded-none border-b border-gray-700/30 bg-gray-800/50">
              <TabsTrigger value="scenarios" className="data-[state=active]:bg-gray-700/50">Escenarios</TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-gray-700/50">Comparativa</TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-gray-700/50">Mercado</TabsTrigger>
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-gray-700/50">Recomendaciones</TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-gray-700/50">FAQ</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="max-h-[600px] overflow-auto">
              <TabsContent value="scenarios" className="m-0 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.escenarios.map((scenario, index) => (
                    <ScenarioCard key={index} scenario={scenario} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="comparison" className="m-0 p-4">
                <ComparisonTable comparisons={data.comparaciones} />
              </TabsContent>
              
              <TabsContent value="market" className="m-0 p-4">
                <MarketAnalysis data={data.analisis_mercado} />
              </TabsContent>
              
              <TabsContent value="recommendations" className="m-0 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RecommendationsList recommendations={data.recomendaciones} />
                  <TipsList tips={data.consejos_practicos} />
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="m-0 p-4">
                <FAQAccordion faqs={data.preguntas_frecuentes} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t border-gray-700/30 bg-gray-900/40 p-4 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full">
            <span>Análisis generado el {new Date().toLocaleDateString()}</span>
            <span className="mt-1 sm:mt-0">Los resultados están basados en datos históricos y no garantizan rendimientos futuros</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FinanceResponse;
