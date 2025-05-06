
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TipsListProps {
  tips: string[];
}

export const TipsList: React.FC<TipsListProps> = ({ tips }) => {
  return (
    <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/30 h-full">
      <CardHeader className="bg-green-900/20 border-b border-gray-700/30">
        <CardTitle className="text-lg">Consejos Prácticos</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex items-start space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30"
            >
              <div className="mt-0.5 flex-shrink-0">
                <div className="w-5 h-5 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <p className="text-sm">{tip}</p>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
