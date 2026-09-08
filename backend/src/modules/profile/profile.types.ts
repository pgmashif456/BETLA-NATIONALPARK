import { VerificationStatus, DocumentStatus } from '@prisma/client';

export type StakeholderType = 'TOURIST' | 'GUIDE' | 'HOMESTAY' | 'ADMIN' | 'FOREST_AUTHORITY';

export interface UpdateTouristProfileInput {
  fullName?: string;
  profileImage?: string | null;
  dateOfBirth?: string | Date | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

export interface UpdateGuideProfileInput {
  fullName?: string;
  profileImage?: string | null;
  bio?: string | null;
  experienceYears?: number;
  languages?: string[];
  specializations?: string[];
  address?: string | null;
}

export interface UpdateHomestayProfileInput {
  propertyName?: string;
  ownerName?: string;
  description?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SubmitVerificationDocumentInput {
  documentType: string;
  documentUrl: string;
}

export interface ProfileResponseData {
  user: {
    id: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    role: string;
  };
  stakeholderType: StakeholderType;
  profile: any;
}

export interface VerificationResponseData {
  verificationStatus: VerificationStatus;
  documents: Array<{
    id: string;
    documentType: string;
    documentUrl: string;
    status: DocumentStatus;
    createdAt: Date;
  }>;
}
