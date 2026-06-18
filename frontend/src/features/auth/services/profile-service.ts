// src/features/auth/services/profile-service.ts

import { api } from '@/lib/api';

export interface ProfileResponse {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  emailAddress: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  role: string;
}

export const profileService = {
  getProfile: (): Promise<ProfileResponse> => {
    return api.get('users/profile').json<ProfileResponse>();
  },
};