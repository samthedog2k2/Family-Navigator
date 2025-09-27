
'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { AVAILABLE_AGENTS } from '../lib/constants';

interface AgentSelectorProps {
  activeAgents: string[];
  onAgentToggle: (agents: string[]) => void;
}

export default function AgentSelector({ activeAgents, onAgentToggle }: AgentSelectorProps) {
  const toggleAgent = (agentId: string) => {
    if (activeAgents.includes(agentId)) {
      onAgentToggle(activeAgents.filter(id => id !== agentId));
    } else {
      onAgentToggle([...activeAgents, agentId]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">AI Agents</h3>
      <div className="space-y-3">
        {AVAILABLE_AGENTS.map((agent) => (
          <motion.div
            key={agent.id}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              activeAgents.includes(agent.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleAgent(agent.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{agent.name}</div>
                  <div className="text-xs text-gray-600">{agent.description}</div>
                </div>
              </div>
              {activeAgents.includes(agent.id) ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
