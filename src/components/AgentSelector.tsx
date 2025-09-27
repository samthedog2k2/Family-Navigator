
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Ship, Plane, Hotel, Car } from 'lucide-react';

const availableAgents = [
  { id: 'cruise', label: 'Cruise Agent', icon: Ship },
  { id: 'flight', label: 'Flight Agent', icon: Plane },
  { id: 'hotel', label: 'Hotel Agent', icon: Hotel },
  { id: 'rentalCar', label: 'Rental Car Agent', icon: Car },
];

interface AgentSelectorProps {
  activeAgents: string[];
  onAgentToggle: (agents: string[]) => void;
}

export default function AgentSelector({ activeAgents, onAgentToggle }: AgentSelectorProps) {

  const handleToggle = (agentId: string) => {
    const newAgents = activeAgents.includes(agentId)
      ? activeAgents.filter((id) => id !== agentId)
      : [...activeAgents, agentId];
    onAgentToggle(newAgents);
  };

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle>Activate Agents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label htmlFor={agent.id} className="flex items-center space-x-3 cursor-pointer">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">{agent.label}</span>
              </Label>
              <Switch
                id={agent.id}
                checked={activeAgents.includes(agent.id)}
                onCheckedChange={() => handleToggle(agent.id)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
