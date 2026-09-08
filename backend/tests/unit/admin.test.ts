import { updateUserStatusSchema, createRoleSchema, queryAuditLogsSchema } from '../../src/modules/admin/admin.validation';
import { UserStatus, RoleName } from '@prisma/client';

describe('Module 8 Unit Tests: Admin Validation Schemas', () => {
  describe('updateUserStatusSchema', () => {
    it('should accept valid status updates', () => {
      const validPayload = { status: 'SUSPENDED', reason: 'Violation of platform rules' };
      const parsed = updateUserStatusSchema.parse(validPayload);
      expect(parsed.status).toBe('SUSPENDED');
      expect(parsed.reason).toBe('Violation of platform rules');
    });

    it('should reject invalid status strings', () => {
      expect(() => updateUserStatusSchema.parse({ status: 'INVALID_STATUS' })).toThrow();
    });
  });

  describe('createRoleSchema', () => {
    it('should accept valid role creation data', () => {
      const validData = {
        name: RoleName.FOREST_AUTHORITY,
        description: 'Forest Ranger Authority',
        permissionIds: ['00000000-0000-0000-0000-000000000000'],
      };
      const parsed = createRoleSchema.parse(validData);
      expect(parsed.name).toBe(RoleName.FOREST_AUTHORITY);
    });
  });

  describe('queryAuditLogsSchema', () => {
    it('should parse page and limit params', () => {
      const parsed = queryAuditLogsSchema.parse({ page: '2', limit: '20' });
      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(20);
    });
  });
});
