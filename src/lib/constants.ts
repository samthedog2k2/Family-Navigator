
import { FamilyData } from './travel-types';

export const DEFAULT_FAMILY: FamilyData = {
  id: 'default-family-1',
  lastName: 'Voyager',
  members: [
    { id: 1, name: 'Adam', age: 42, role: 'Adult' },
    { id: 2, name: 'Holly', age: 40, role: 'Adult' },
    { id: 3, name: 'Ethan', age: 14, role: 'Child' },
    { id: 4, name: 'Elle', age: 9, role: 'Child' },
  ],
};
