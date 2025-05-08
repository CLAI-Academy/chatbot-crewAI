
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQ } from '@/types/finance';

interface FAQAccordionProps {
  faqs: FAQ[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800/40 rounded-lg border border-gray-700/30 overflow-hidden mb-6">
        <div className="p-4 bg-gray-800/60 border-b border-gray-700/30">
          <h3 className="text-lg font-semibold">Preguntas Frecuentes</h3>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border-gray-700/30 px-4">
                <AccordionTrigger className="py-4 text-left hover:no-underline">
                  <span className="text-blue-300">{faq.pregunta}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  {faq.respuesta}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};
