
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendations } from './FinanceResponse';

interface RecommendationsListProps {
  recommendations: Recommendations;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  console.log("🔍 RecommendationsList - Recomendaciones:", recommendations);
  
  // Transform recommendations object into an array of items
  const recommendationItems = Object.entries(recommendations).map(([key, value]) => {
    let title = key.replace(/_/g, ' ');
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    let icon;
    
    if (key.includes('diversif')) {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M2 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M16 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M9 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M16 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M2 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M3.75 7.5 7.25 5"/>
          <path d="M10.8 5h2.4"/>
          <path d="M3.75 16.5l3.5-2.5"/>
          <path d="M10.8 19h2.4"/>
        </svg>
      );
    } else if (key.includes('monitor') || key.includes('seguim')) {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
          <path d="M12 2v4"/>
          <path d="M12 18v4"/>
          <path d="M4.93 4.93l2.83 2.83"/>
          <path d="M16.24 16.24l2.83 2.83"/>
          <path d="M2 12h4"/>
          <path d="M18 12h4"/>
          <path d="M4.93 19.07l2.83-2.83"/>
          <path d="M16.24 7.76l2.83-2.83"/>
        </svg>
      );
    } else if (key.includes('educa')) {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      );
    } else if (key.includes('fondo') || key.includes('emergencia')) {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
          <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"/>
          <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"/>
          <line x1="12" x2="12" y1="22" y2="13"/>
          <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3a2.06 2.06 0 0 1-1.78 0l-6-3A2.06 2.06 0 0 1 4 16.87V13.5"/>
        </svg>
      );
    } else {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
          <path d="M12 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/>
          <path d="M12 2v2"/>
          <path d="M12 22v-2"/>
          <path d="M4 12H2"/>
          <path d="M22 12h-2"/>
          <path d="M17 7-2 2"/>
          <path d="M7 7l2 2"/>
          <path d="M17 17l-2-2"/>
          <path d="M7 17l2-2"/>
        </svg>
      );
    }
    
    return {
      title,
      content: value,
      icon
    };
  });

  if (recommendationItems.length === 0) {
    console.warn("⚠️ No hay recomendaciones para mostrar");
    return (
      <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30">
        <CardHeader className="bg-indigo-900/20 border-b border-gray-700/30">
          <CardTitle className="text-lg">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-400">No hay recomendaciones disponibles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30 h-full">
      <CardHeader className="bg-indigo-900/20 border-b border-gray-700/30">
        <CardTitle className="text-lg">Recomendaciones</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-4">
          {recommendationItems.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex items-start space-x-3"
            >
              <div className="mt-1 p-2 bg-gray-800/50 rounded-full">
                {item.icon}
              </div>
              <div>
                <h4 className="text-md font-medium text-blue-300">{item.title}</h4>
                <p className="text-sm text-gray-300 mt-1">{item.content}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
