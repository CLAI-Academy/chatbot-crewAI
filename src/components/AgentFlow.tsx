
import React from 'react';

interface AgentNodeProps {
  name: string;
  isActive: boolean;
}

const AgentNode: React.FC<AgentNodeProps> = ({ name, isActive }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-20 h-20 mb-2`}>
        <div className={`absolute inset-0 rounded-full border ${isActive ? 'border-[#3B82F6] animate-pulse' : 'border-gray-400'} opacity-70`}></div>
        <div className={`absolute inset-2 rounded-full border ${isActive ? 'border-[#3B82F6]' : 'border-gray-400'} opacity-90`}></div>
        {isActive && (
          <div className="absolute inset-0 w-full h-full flex justify-center items-center">
            <div className="w-12 h-12 rounded-full bg-[#3B82F6] opacity-20 animate-ping"></div>
          </div>
        )}
      </div>
      <span className={`text-sm ${isActive ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
        {name}
      </span>
    </div>
  );
};

interface AgentsConnectorProps {
  isActive: boolean;
}

const AgentsConnector: React.FC<AgentsConnectorProps> = ({ isActive }) => (
  <div className="flex-grow h-[2px] mx-2 self-center">
    <div className={`h-full ${isActive ? 'bg-[#3B82F6]' : 'bg-gray-600'}`}></div>
  </div>
);

interface AgentFlowProps {
  mode: string;
  agents: string[];
  currentAgent: string | null;
}

const AgentFlow: React.FC<AgentFlowProps> = ({ mode, agents, currentAgent }) => {
  if (!mode || !agents || agents.length === 0) {
    return null;
  }

  // Normalizar nombres de agentes para comparaciones
  const normalizeAgentName = (name: string) => {
    return name.toLowerCase().replace('agente ', '');
  };

  // Función para determinar si un agente está activo
  const isAgentActive = (agentName: string): boolean => {
    if (!currentAgent) return false;
    return normalizeAgentName(agentName) === normalizeAgentName(currentAgent);
  };

  // Función para determinar si un conector debe estar activo
  const isConnectorActive = (index: number): boolean => {
    if (!currentAgent) return false;
    
    const currentIndex = agents.findIndex(
      agent => normalizeAgentName(agent) === normalizeAgentName(currentAgent)
    );
    
    return index < currentIndex;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6 py-6 px-4">
      <div className="border border-gray-400 rounded-md px-6 py-2">
        <span className="text-white text-xl">Modo {mode}</span>
      </div>

      <div className="w-full flex justify-center items-center space-x-4">
        {agents.map((agent, index) => (
          <React.Fragment key={agent}>
            <AgentNode 
              name={agent.startsWith("Agente") ? agent : `Agente ${agent}`} 
              isActive={isAgentActive(agent)} 
            />
            {index < agents.length - 1 && (
              <AgentsConnector isActive={isConnectorActive(index)} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AgentFlow;
