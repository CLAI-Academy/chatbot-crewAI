
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendations } from './FinanceResponse';

interface RecommendationsListProps {
  recommendations: Recommendations;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  const recommendationItems = [
    {
      title: 'Diversificación',
      content: recommendations.diversificacion,
      icon: (
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
      )
    },
    {
      title: 'Monitoreo',
      content: recommendations.monitoreo,
      icon: (
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
      )
    },
    {
      title: 'Educación',
      content: recommendations.educacion,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      )
    }
  ];

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
