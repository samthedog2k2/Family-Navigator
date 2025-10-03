'use client';

import React, { memo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Trash2, Check, X } from 'lucide-react';
import { FamilyMember, ValidationError } from '../lib/family-types';

interface MemberCardProps {
  member: FamilyMember;
  index: number;
  isEditing: boolean;
  isEditingThis: boolean;
  errors: ValidationError[];
  onUpdate: (updates: Partial<FamilyMember>) => void;
  onStartEdit: () => void;
  onRemove: () => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
}

function MemberCardComponent({
  member,
  index,
  isEditing,
  isEditingThis,
  errors,
  onUpdate,
  onStartEdit,
  onRemove,
  onConfirmEdit,
  onCancelEdit,
}: MemberCardProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);

  const memberErrors = errors.filter(error =>
    error.field.startsWith(`member-${member.id}`)
  );

  const nameError = memberErrors.find(error =>
    error.field === `member-${member.id}-name`
  );

  const ageError = memberErrors.find(error =>
    error.field === `member-${member.id}-age`
  );

  useEffect(() => {
    if (isEditingThis && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingThis]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirmEdit();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseInt(e.target.value, 10);
    if (!isNaN(age)) {
      onUpdate({ age });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      role="listitem"
    >
      <div className="flex items-center space-x-3 flex-1">
        <div
          className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <User className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1">
          {isEditingThis ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={member.name}
                    onChange={handleNameChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-2 py-1 border rounded text-sm ${
                      nameError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter name"
                    aria-label={`Name for family member ${index + 1}`}
                    aria-describedby={nameError ? `name-error-${member.id}` : undefined}
                    aria-invalid={!!nameError}
                  />
                  {nameError && (
                    <p
                      id={`name-error-${member.id}`}
                      className="text-xs text-red-600 mt-1"
                      role="alert"
                    >
                      {nameError.message}
                    </p>
                  )}
                </div>

                <div className="w-20">
                  <input
                    ref={ageInputRef}
                    type="number"
                    value={member.age}
                    onChange={handleAgeChange}
                    onKeyDown={handleKeyDown}
                    min="0"
                    max="150"
                    className={`w-full px-2 py-1 border rounded text-sm ${
                      ageError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Age"
                    aria-label={`Age for ${member.name || 'family member'}`}
                    aria-describedby={ageError ? `age-error-${member.id}` : undefined}
                    aria-invalid={!!ageError}
                  />
                  {ageError && (
                    <p
                      id={`age-error-${member.id}`}
                      className="text-xs text-red-600 mt-1"
                      role="alert"
                    >
                      {ageError.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={onConfirmEdit}
                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  aria-label={`Save changes for ${member.name || 'family member'}`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  aria-label={`Cancel editing ${member.name || 'family member'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-medium text-gray-900">
                {member.name || 'Unnamed Member'}
              </div>
              <div className="text-sm text-gray-600">Age: {member.age}</div>
            </>
          )}
        </div>
      </div>

      {isEditing && !isEditingThis && (
        <div className="flex space-x-2">
          <button
            onClick={onStartEdit}
            className="p-1 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label={`Edit ${member.name || 'family member'}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
            aria-label={`Remove ${member.name || 'family member'}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export const MemberCard = memo(MemberCardComponent);
