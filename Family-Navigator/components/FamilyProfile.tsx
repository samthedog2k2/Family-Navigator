'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Save, X, AlertCircle, Loader2 } from 'lucide-react';
import { FamilyData } from '../lib/family-types';
import { useFamilyProfile } from '../hooks/useFamilyProfile';
import { MemberCard } from './MemberCard';
import { ConfirmDialog } from './ConfirmDialog';

interface FamilyProfileProps {
  family: FamilyData;
  onFamilyUpdate: (family: FamilyData) => Promise<void>;
}

const AIRPORT_INFO = {
  IND: 'Indianapolis International Airport',
  // Add more airports as needed
};

export default function FamilyProfile({ family, onFamilyUpdate }: FamilyProfileProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const {
    tempFamily,
    isEditing,
    editingMember,
    formState,
    actions: {
      handleAddMember,
      handleRemoveMember,
      handleUpdateMember,
      handleSave,
      handleCancel,
      startEditing,
      startEditingMember,
    },
  } = useFamilyProfile(family, onFamilyUpdate);

  const handleRemoveWithConfirmation = useCallback((memberId: string, memberName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Family Member',
      message: `Are you sure you want to remove ${memberName || 'this member'} from your family profile? This action cannot be undone.`,
      onConfirm: () => {
        handleRemoveMember(memberId);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  }, [handleRemoveMember]);

  const handleCancelWithConfirmation = useCallback(() => {
    if (formState.isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: 'Discard Changes',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        onConfirm: () => {
          handleCancel();
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      handleCancel();
    }
  }, [formState.isDirty, handleCancel]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  const generalErrors = useMemo(() =>
    formState.errors.filter(error => !error.field.startsWith('member-')),
    [formState.errors]
  );

  const airportName = useMemo(() =>
    AIRPORT_INFO[tempFamily.defaultAirport as keyof typeof AIRPORT_INFO] ||
    `${tempFamily.defaultAirport} Airport`,
    [tempFamily.defaultAirport]
  );

  const hasValidationErrors = formState.errors.length > 0;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Family Profile</h3>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startEditing}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Edit family profile"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={formState.isLoading || hasValidationErrors}
                className={`p-2 rounded-lg transition-colors flex items-center space-x-1 ${
                  formState.isLoading || hasValidationErrors
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                aria-label="Save changes"
              >
                {formState.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelWithConfirmation}
                disabled={formState.isLoading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {generalErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {generalErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-800" role="alert">
                    {error.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Family Members */}
        <div className="space-y-3 mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Family Members</h4>
          <div className="space-y-3" role="list" aria-label="Family members">
            {tempFamily.members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                isEditing={isEditing}
                isEditingThis={editingMember === member.id}
                errors={formState.errors}
                onUpdate={(updates) => handleUpdateMember(member.id, updates)}
                onStartEdit={() => startEditingMember(member.id)}
                onRemove={() => handleRemoveWithConfirmation(member.id, member.name)}
                onConfirmEdit={() => startEditingMember(null)}
                onCancelEdit={() => startEditingMember(null)}
              />
            ))}
          </div>
        </div>

        {/* Add Member Button */}
        {isEditing && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddMember}
            disabled={formState.isLoading}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add new family member"
          >
            <Plus className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Add Family Member</span>
          </motion.button>
        )}

        {/* Home Location */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Home Information</h4>
          <div className="text-sm">
            <div className="font-medium text-gray-700 mb-1">Home Address</div>
            <div className="text-gray-600">
              {tempFamily.homeAddress.street}<br />
              {tempFamily.homeAddress.city}, {tempFamily.homeAddress.state} {tempFamily.homeAddress.zip}
            </div>
          </div>
          <div className="mt-3 text-sm">
            <div className="font-medium text-gray-700 mb-1">Default Airport</div>
            <div className="text-gray-600">
              {tempFamily.defaultAirport} - {airportName}
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Default Vehicle</h4>
          <div className="text-sm">
            <div className="text-gray-600 mb-1">
              {tempFamily.preferences.carDefaults.year} {tempFamily.preferences.carDefaults.make}{' '}
              {tempFamily.preferences.carDefaults.model}
            </div>
            <div className="text-gray-600">
              {tempFamily.preferences.carDefaults.mpg} MPG ({tempFamily.preferences.carDefaults.fuelType})
            </div>
          </div>
        </div>

        {/* Dirty State Indicator */}
        {formState.isDirty && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Remember to save your updates.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant="warning"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </>
  );
}