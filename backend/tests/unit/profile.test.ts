import {
  updateTouristProfileSchema,
  updateGuideProfileSchema,
  updateHomestayProfileSchema,
  submitVerificationDocumentSchema,
} from '../../src/modules/profile/profile.validation';

describe('Profile Unit Tests', () => {
  describe('Profile Validation Schemas', () => {
    describe('updateTouristProfileSchema', () => {
      it('should validate valid tourist update payload', () => {
        const input = {
          fullName: 'Rahul Sharma',
          city: 'Ranchi',
          postalCode: '834001',
        };
        const parsed = updateTouristProfileSchema.parse(input);
        expect(parsed.fullName).toBe('Rahul Sharma');
      });

      it('should reject empty full name', () => {
        expect(() => updateTouristProfileSchema.parse({ fullName: '' })).toThrow();
      });
    });

    describe('updateGuideProfileSchema', () => {
      it('should validate valid guide update payload', () => {
        const input = {
          bio: 'Experienced guide',
          experienceYears: 5,
          languages: ['Hindi', 'English'],
        };
        const parsed = updateGuideProfileSchema.parse(input);
        expect(parsed.experienceYears).toBe(5);
        expect(parsed.languages).toEqual(['Hindi', 'English']);
      });

      it('should reject negative experience years', () => {
        expect(() => updateGuideProfileSchema.parse({ experienceYears: -2 })).toThrow();
      });
    });

    describe('updateHomestayProfileSchema', () => {
      it('should validate valid homestay update payload', () => {
        const input = {
          propertyName: 'Betla Eco Stay',
          latitude: 23.88,
          longitude: 84.19,
        };
        const parsed = updateHomestayProfileSchema.parse(input);
        expect(parsed.propertyName).toBe('Betla Eco Stay');
      });

      it('should reject invalid latitude', () => {
        expect(() => updateHomestayProfileSchema.parse({ latitude: 120 })).toThrow();
      });
    });

    describe('submitVerificationDocumentSchema', () => {
      it('should accept valid document submission', () => {
        const input = {
          documentType: 'govt_id',
          documentUrl: 'https://example.com/docs/id.pdf',
        };
        const parsed = submitVerificationDocumentSchema.parse(input);
        expect(parsed.documentType).toBe('GOVT_ID');
      });

      it('should reject invalid document type', () => {
        expect(() =>
          submitVerificationDocumentSchema.parse({
            documentType: 'INVALID_DOC_TYPE',
            documentUrl: 'https://example.com/doc.pdf',
          })
        ).toThrow();
      });
    });
  });
});
