import { calculateHaversineDistance, generateSlug } from '../../src/modules/content/content.service';

describe('Module 3 Unit Tests: Content Utilities', () => {
  describe('calculateHaversineDistance', () => {
    it('should calculate distance between Betla (23.8872, 84.1913) and Netarhat (23.4833, 84.2667)', () => {
      const distance = calculateHaversineDistance(23.8872, 84.1913, 23.4833, 84.2667);
      expect(distance).toBeGreaterThan(40);
      expect(distance).toBeLessThan(55);
    });

    it('should return 0 distance for identical coordinates', () => {
      const distance = calculateHaversineDistance(23.8872, 84.1913, 23.8872, 84.1913);
      expect(distance).toBe(0);
    });
  });

  describe('generateSlug', () => {
    it('should convert name to url-friendly slug', () => {
      expect(generateSlug('Betla National Park')).toBe('betla-national-park');
      expect(generateSlug('Lodh Waterfalls & Eco Trail!')).toBe('lodh-waterfalls-eco-trail');
      expect(generateSlug('  Palamau Forts   ')).toBe('palamau-forts');
    });
  });
});
