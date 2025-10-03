/**
 * SP-Enhanced Gemini Chat Component
 * Uses existing free Gemini with SP methodology
 * Zero additional costs
 */

'use client';

import { useState } from 'react';
import { useSPGemini } from '@/hooks/useSPGemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DOMAINS = [
  { value: 'general', label: 'General Assistant' },
  { value: 'health', label: 'Health Advisor' },
  { value: 'finance', label: 'Finance Advisor' },
  { value: 'travel', label: 'Travel Planner' },
  { value: 'calendar', label: 'Schedule Optimizer' },
];

export function SPGeminiChat() {
  const [input, setInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('general');
  const { generateResponse, response, loading, error, domain } = useSPGemini();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await generateResponse(input, selectedDomain);
    setInput('');
  };

  const selectedDomainLabel = DOMAINS.find(d => d.value === selectedDomain)?.label;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          SP Enhanced Family Assistant
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            FREE (Gemini + SP)
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Powered by your existing Gemini setup + SP methodology (200+ expert minds)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOMAINS.map((domain) => (
                <SelectItem key={domain.value} value={domain.value}>
                  {domain.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${selectedDomainLabel?.toLowerCase()}... (SP enhanced)`}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Send'}
          </Button>
        </form>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-2">
            {domain && (
              <Badge variant="secondary" className="text-xs">
                SP {DOMAINS.find(d => d.value === domain)?.label} Enhancement Applied
              </Badge>
            )}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          💡 SP Enhancement: Every response applies collective wisdom of 200+ experts
        </div>
      </CardContent>
    </Card>
  );
}
