
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';

interface AgentNodeProps {
  name: string;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

const AgentNode: React.FC<AgentNodeProps> = ({ name, isActive, isCompleted, index }) => {
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className={`relative w-24 h-24 mb-3`}>
        {/* Outer glow effect */}
        <motion.div 
          className={`absolute inset-0 rounded-full ${isActive ? 'bg-[#3B82F6]/10' : 'bg-transparent'}`}
          animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
        />
        
        {/* Outer ring */}
        <motion.div 
          className={`absolute inset-0 rounded-full border-2 ${isActive ? 'border-[#3B82F6]' : isCompleted ? 'border-green-400' : 'border-gray-400'} opacity-70`}
          animate={{ 
            borderColor: isActive ? '#3B82F6' : isCompleted ? '#10B981' : '#4B5563',
            boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.6)' : 'none'
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Inner ring */}
        <motion.div 
          className={`absolute inset-3 rounded-full border-2 ${isActive ? 'border-[#3B82F6]' : isCompleted ? 'border-green-400' : 'border-gray-400'} opacity-90`}
          animate={{ 
            borderColor: isActive ? '#3B82F6' : isCompleted ? '#10B981' : '#4B5563',
            rotate: isActive ? 360 : 0
          }}
          transition={{ duration: isActive ? 8 : 0.5, repeat: isActive ? Infinity : 0, ease: "linear" }}
        />
        
        {/* Center glow effect */}
        {isActive && (
          <motion.div 
            className="absolute inset-0 w-full h-full flex justify-center items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 0.7 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#3B82F6] opacity-40" />
          </motion.div>
        )}
        
        {/* Completed check mark */}
        {isCompleted && !isActive && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-green-400"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>
      
      {/* Agent name with animation */}
      <motion.span 
        className={`text-sm font-medium ${isActive ? 'text-[#3B82F6]' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}
        animate={{ 
          color: isActive ? '#3B82F6' : isCompleted ? '#10B981' : '#9CA3AF',
          scale: isActive ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
      >
        {name}
      </motion.span>
    </motion.div>
  );
};

interface AgentsConnectorProps {
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

const AgentsConnector: React.FC<AgentsConnectorProps> = ({ isActive, isCompleted, index }) => (
  <motion.div 
    className="flex-grow h-[2px] mx-2 self-center"
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
  >
    <motion.div 
      className={`h-full ${isActive ? 'bg-[#3B82F6]' : isCompleted ? 'bg-green-400' : 'bg-gray-600'}`}
      animate={{ 
        backgroundColor: isActive ? '#3B82F6' : isCompleted ? '#10B981' : '#4B5563',
        boxShadow: isActive ? '0 0 8px rgba(59, 130, 246, 0.6)' : 'none'
      }}
      transition={{ duration: 0.5 }}
    />
  </motion.div>
);

interface AgentFlowProps {
  mode: string;
  agents: string[];
  currentAgent: string | null;
}

const AgentFlow: React.FC<AgentFlowProps> = ({ mode, agents, currentAgent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect to scroll into view when component mounts or updates
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [mode, currentAgent]); // Trigger scroll when mode or currentAgent changes

  if (!mode || !agents || agents.length === 0) {
    return null;
  }

  // Normalizar nombres de agentes para comparaciones
  const normalizeAgentName = (name: string) => {
    return name.toLowerCase().replace('agente ', '');
  };

  // Función para determinar si un agente está activo o completado
  const getAgentStatus = (agentName: string, index: number): { isActive: boolean, isCompleted: boolean } => {
    if (!currentAgent) return { isActive: false, isCompleted: false };
    
    const currentIndex = agents.findIndex(
      agent => normalizeAgentName(agent) === normalizeAgentName(currentAgent)
    );
    
    const thisAgentIndex = agents.findIndex(
      agent => normalizeAgentName(agent) === normalizeAgentName(agentName)
    );
    
    return {
      isActive: normalizeAgentName(agentName) === normalizeAgentName(currentAgent),
      isCompleted: thisAgentIndex < currentIndex
    };
  };

  return (
    <AnimatePresence>
      <motion.div 
        ref={containerRef}
        className="w-full flex flex-col items-center space-y-6 py-8 px-6 bg-gray-900/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30 mb-6"
        initial={{ opacity: 0, y: 50, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -50, height: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Mode indicator with glass effect */}
        <motion.div 
          className="relative backdrop-blur-md bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-500/30 rounded-md px-8 py-3 shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <motion.span 
            className="text-white text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Modo <span className="text-[#3B82F6] font-bold">{mode}</span>
          </motion.span>
          
          {/* Subtle pulse effect */}
          <motion.div
            className="absolute -inset-1 rounded-md opacity-20 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 blur-md"
            animate={{ 
              backgroundPosition: ["0% center", "100% center"],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-gray-400"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>

        {/* Agent flow visualization */}
        <ScrollArea className="w-full max-w-4xl">
          <motion.div 
            className="w-full flex justify-center items-center space-x-4 py-4 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {agents.map((agent, index) => (
              <React.Fragment key={agent}>
                <AgentNode 
                  name={agent.startsWith("Agente") ? agent : `Agente ${agent}`} 
                  {...getAgentStatus(agent, index)}
                  index={index}
                />
                {index < agents.length - 1 && (
                  <AgentsConnector 
                    isActive={getAgentStatus(agents[index + 1], index + 1).isActive} 
                    isCompleted={getAgentStatus(agent, index).isCompleted}
                    index={index}
                  />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </ScrollArea>

        {/* Legend or description */}
        <motion.div 
          className="text-gray-400 text-sm text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8 }}
        >
          Flujo de análisis y procesamiento del mensaje
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentFlow;
