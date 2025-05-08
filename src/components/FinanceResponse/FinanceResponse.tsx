
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
import { FinanceData } from '@/types/finance';

interface FinanceResponseProps {
  data: FinanceData;
}

const FinanceResponse: React.FC<FinanceResponseProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log('🔍 FinanceResponse - Datos recibidos:', data);
    console.log('📋 Escenarios:', data.escenarios?.length || 0);
    console.log('📊 Análisis de mercado:', data.analisis_mercado ? 'Presente' : 'Ausente');
    console.log('📈 Comparaciones:', data.comparaciones?.length || 0);
    console.log('📝 Recomendaciones:', Object.keys(data.recomendaciones || {}));
  }, [data]);
  
  useEffect(() => {
    console.log('🔍 Rendering comparison tab with data:', data.comparaciones);
    console.log('🔍 Rendering market tab with data:', data.analisis_mercado);
    console.log('🔍 Rendering recommendations tab with data:', data.recomendaciones);
    console.log('🔍 Rendering tips with data:', data.consejos_practicos);
    console.log('🔍 Rendering FAQ tab with data:', data.preguntas_frecuentes);
  }, [data]);
  
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
  
  // Check if the data is valid
  if (!data) {
    console.error('❌ FinanceResponse - Datos inválidos:', data);
    return (
      <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-white">
        Error: Los datos financieros recibidos no son válidos.
      </div>
    );
  }
  
  // Ensure we have escenarios for rendering - Allow empty escenarios but show message
  const hasEscenarios = data.escenarios && data.escenarios.length > 0;
  
  if (!hasEscenarios) {
    console.warn('⚠️ FinanceResponse - No hay escenarios:', data);
  }
  
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
              <TabsTrigger value="scenarios" className="data-[state=active]:bg-gray-700/50 text-white">Escenarios</TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-gray-700/50 text-white">Comparativa</TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-gray-700/50 text-white">Mercado</TabsTrigger>
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-gray-700/50 text-white">Recomendaciones</TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-gray-700/50 text-white">FAQ</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="max-h-[600px] overflow-auto">
              <TabsContent value="scenarios" className="m-0 p-4">
                {hasEscenarios ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.escenarios!.map((scenario, index) => (
                      <ScenarioCard key={index} scenario={scenario} />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-800/30 rounded-lg text-gray-200">
                    No hay escenarios disponibles
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comparison" className="m-0 p-4">
                {data.comparaciones && data.comparaciones.length > 0 ? (
                  <ComparisonTable comparisons={data.comparaciones} />
                ) : (
                  <div className="p-4 bg-gray-800/30 rounded-lg text-gray-200">
                    No hay datos comparativos disponibles
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="market" className="m-0 p-4">
                {data.analisis_mercado ? (
                  <MarketAnalysis data={data.analisis_mercado} />
                ) : (
                  <div className="p-4 bg-gray-800/30 rounded-lg text-gray-200">
                    No hay análisis de mercado disponible
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recommendations" className="m-0 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.recomendaciones && Object.keys(data.recomendaciones).length > 0 ? (
                    <RecommendationsList recommendations={data.recomendaciones} />
                  ) : (
                    <div className="p-4 bg-gray-800/30 rounded-lg text-gray-200">
                      No hay recomendaciones disponibles
                    </div>
                  )}
                  
                  {data.consejos_practicos && data.consejos_practicos.length > 0 ? (
                    <TipsList tips={data.consejos_practicos} />
                  ) : (
                    <div className="p-4 bg-gray-800/30 rounded-lg text-gray-200">
                      No hay consejos prácticos disponibles
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="m-0 p-4">
                {data.preguntas_frecuentes && data.preguntas_frecuentes.length > 0 ? (
                  <FAQAccordion faqs={data.preguntas_frecuentes} />
                ) : (
                  <div className="p-4 bg-gray-800/30 rounded-lg text-gray-200">
                    No hay preguntas frecuentes disponibles
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t border-gray-700/30 bg-gray-900/40 p-4 text-sm text-gray-300">
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
