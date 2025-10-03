
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FamilyData } from '@/lib/travel-types';
import { User, PlusCircle, Trash2 } from 'lucide-react';

interface FamilyProfileProps {
  family: FamilyData;
  onFamilyUpdate: (family: FamilyData) => void;
}

export default function FamilyProfile({ family, onFamilyUpdate }: FamilyProfileProps) {
  const [members, setMembers] = useState(family.members);

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    (newMembers[index] as any)[field] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { id: Date.now(), name: '', age: 0, role: 'Adult' }]);
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSave = () => {
    onFamilyUpdate({ ...family, members });
  };

  return (
    <Card className="shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle>Family Profile</CardTitle>
        <CardDescription>Manage your travel companions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member, index) => (
          <div key={member.id} className="flex items-end space-x-2">
            <div className="flex-grow space-y-1">
              <Label htmlFor={`name-${index}`} className="text-xs">Name</Label>
              <Input
                id={`name-${index}`}
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                placeholder="Member Name"
              />
            </div>
            <div className="w-20 space-y-1">
              <Label htmlFor={`age-${index}`} className="text-xs">Age</Label>
              <Input
                id={`age-${index}`}
                type="number"
                value={member.age}
                onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                placeholder="Age"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeMember(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={addMember}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Member
        </Button>
        <Button className="w-full" onClick={handleSave}>Save Profile</Button>
      </CardContent>
    </Card>
  );
}
