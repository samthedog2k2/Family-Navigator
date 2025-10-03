import { useState, useCallback, useMemo } from 'react';
import { FamilyData, FamilyMember, ValidationError, FormState } from '../lib/family-types';

export function useFamilyProfile(initialFamily: FamilyData, onFamilyUpdate: (family: FamilyData) => void) {
  const [tempFamily, setTempFamily] = useState<FamilyData>(initialFamily);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    errors: [],
    isDirty: false,
  });

  const validateMember = useCallback((member: FamilyMember): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!member.name.trim()) {
      errors.push({ field: `member-${member.id}-name`, message: 'Name is required' });
    }

    if (member.age < 0 || member.age > 150) {
      errors.push({ field: `member-${member.id}-age`, message: 'Age must be between 0 and 150' });
    }

    return errors;
  }, []);

  const validateFamily = useCallback((family: FamilyData): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (family.members.length === 0) {
      errors.push({ field: 'members', message: 'At least one family member is required' });
    }

    family.members.forEach(member => {
      errors.push(...validateMember(member));
    });

    return errors;
  }, [validateMember]);

  const handleAddMember = useCallback(() => {
    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: '',
      age: 18,
      preferences: {},
    };

    setTempFamily(prev => ({
      ...prev,
      members: [...prev.members, newMember],
    }));

    setEditingMember(newMember.id);
    setIsEditing(true);
    setFormState(prev => ({ ...prev, isDirty: true }));
  }, []);

  const handleRemoveMember = useCallback((memberId: string) => {
    setTempFamily(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId),
    }));

    if (editingMember === memberId) {
      setEditingMember(null);
    }

    setFormState(prev => ({ ...prev, isDirty: true }));
  }, [editingMember]);

  const handleUpdateMember = useCallback((memberId: string, updates: Partial<FamilyMember>) => {
    setTempFamily(prev => ({
      ...prev,
      members: prev.members.map(m =>
        m.id === memberId ? { ...m, ...updates } : m
      ),
    }));

    setFormState(prev => ({ ...prev, isDirty: true }));
  }, []);

  const handleSave = useCallback(async () => {
    const errors = validateFamily(tempFamily);

    if (errors.length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      await onFamilyUpdate(tempFamily);
      setIsEditing(false);
      setEditingMember(null);
      setFormState({ isLoading: false, errors: [], isDirty: false });
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        errors: [{ field: 'general', message: 'Failed to save changes. Please try again.' }],
      }));
    }
  }, [tempFamily, validateFamily, onFamilyUpdate]);

  const handleCancel = useCallback(() => {
    setTempFamily(initialFamily);
    setIsEditing(false);
    setEditingMember(null);
    setFormState({ isLoading: false, errors: [], isDirty: false });
  }, [initialFamily]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const startEditingMember = useCallback((memberId: string | null) => {
    setEditingMember(memberId);
  }, []);

  const isDirty = useMemo(() => {
    return JSON.stringify(tempFamily) !== JSON.stringify(initialFamily);
  }, [tempFamily, initialFamily]);

  return {
    tempFamily,
    isEditing,
    editingMember,
    formState: { ...formState, isDirty },
    actions: {
      handleAddMember,
      handleRemoveMember,
      handleUpdateMember,
      handleSave,
      handleCancel,
      startEditing,
      startEditingMember,
    },
  };
}
