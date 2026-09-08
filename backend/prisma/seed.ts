import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

// ── Permission definitions ──────────────────────────────────
const PERMISSIONS = [
  // User permissions
  { name: 'users:read', resource: 'users', action: 'read', description: 'View user information' },
  { name: 'users:create', resource: 'users', action: 'create', description: 'Create users' },
  { name: 'users:update', resource: 'users', action: 'update', description: 'Update user information' },
  { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
  { name: 'users:manage', resource: 'users', action: 'manage', description: 'Full user management' },

  // Profile permissions
  { name: 'profile:read', resource: 'profile', action: 'read', description: 'View own profile' },
  { name: 'profile:update', resource: 'profile', action: 'update', description: 'Update own profile' },

  // Destination permissions
  { name: 'destinations:read', resource: 'destinations', action: 'read', description: 'View destinations' },
  { name: 'destinations:create', resource: 'destinations', action: 'create', description: 'Create destinations' },
  { name: 'destinations:update', resource: 'destinations', action: 'update', description: 'Update destinations' },
  { name: 'destinations:delete', resource: 'destinations', action: 'delete', description: 'Delete destinations' },

  // Booking permissions
  { name: 'bookings:read', resource: 'bookings', action: 'read', description: 'View bookings' },
  { name: 'bookings:create', resource: 'bookings', action: 'create', description: 'Create bookings' },
  { name: 'bookings:update', resource: 'bookings', action: 'update', description: 'Update bookings' },
  { name: 'bookings:cancel', resource: 'bookings', action: 'cancel', description: 'Cancel bookings' },
  { name: 'bookings:manage', resource: 'bookings', action: 'manage', description: 'Full booking management' },

  // Guide permissions
  { name: 'guide:services', resource: 'guide', action: 'services', description: 'Manage guide services' },
  { name: 'guide:availability', resource: 'guide', action: 'availability', description: 'Manage guide availability' },

  // Homestay permissions
  { name: 'homestay:manage', resource: 'homestay', action: 'manage', description: 'Manage homestay properties' },
  { name: 'homestay:rooms', resource: 'homestay', action: 'rooms', description: 'Manage homestay rooms' },
  { name: 'homestay:pricing', resource: 'homestay', action: 'pricing', description: 'Manage homestay pricing' },

  // Review permissions
  { name: 'reviews:create', resource: 'reviews', action: 'create', description: 'Create reviews' },
  { name: 'reviews:read', resource: 'reviews', action: 'read', description: 'View reviews' },
  { name: 'reviews:moderate', resource: 'reviews', action: 'moderate', description: 'Moderate reviews' },

  // Admin permissions
  { name: 'admin:dashboard', resource: 'admin', action: 'dashboard', description: 'Access admin dashboard' },
  { name: 'admin:reports', resource: 'admin', action: 'reports', description: 'View admin reports' },
  { name: 'admin:settings', resource: 'admin', action: 'settings', description: 'Manage platform settings' },
  { name: 'admin:verify', resource: 'admin', action: 'verify', description: 'Verify guides/homestays' },
  { name: 'admin:moderate', resource: 'admin', action: 'moderate', description: 'Moderate content' },

  // Forest Authority permissions
  { name: 'forest:operations', resource: 'forest', action: 'operations', description: 'Manage forest operations' },
  { name: 'forest:reports', resource: 'forest', action: 'reports', description: 'View forest reports' },
  { name: 'forest:governance', resource: 'forest', action: 'governance', description: 'Forest governance' },
  { name: 'forest:analytics', resource: 'forest', action: 'analytics', description: 'View forest analytics' },
];

// ── Role-Permission mapping ─────────────────────────────────
const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  TOURIST: [
    'profile:read', 'profile:update',
    'destinations:read',
    'bookings:read', 'bookings:create', 'bookings:cancel',
    'reviews:create', 'reviews:read',
  ],
  GUIDE: [
    'profile:read', 'profile:update',
    'destinations:read',
    'bookings:read', 'bookings:update',
    'guide:services', 'guide:availability',
    'reviews:read',
  ],
  HOMESTAY: [
    'profile:read', 'profile:update',
    'destinations:read',
    'bookings:read', 'bookings:update',
    'homestay:manage', 'homestay:rooms', 'homestay:pricing',
    'reviews:read',
  ],
  ADMIN: [
    'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage',
    'profile:read', 'profile:update',
    'destinations:read', 'destinations:create', 'destinations:update', 'destinations:delete',
    'bookings:read', 'bookings:create', 'bookings:update', 'bookings:cancel', 'bookings:manage',
    'guide:services', 'guide:availability',
    'homestay:manage', 'homestay:rooms', 'homestay:pricing',
    'reviews:create', 'reviews:read', 'reviews:moderate',
    'admin:dashboard', 'admin:reports', 'admin:settings', 'admin:verify', 'admin:moderate',
  ],
  FOREST_AUTHORITY: [
    'users:read',
    'profile:read', 'profile:update',
    'destinations:read', 'destinations:create', 'destinations:update',
    'bookings:read',
    'reviews:read', 'reviews:moderate',
    'admin:dashboard', 'admin:reports',
    'forest:operations', 'forest:reports', 'forest:governance', 'forest:analytics',
  ],
};

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create roles
  console.log('Creating roles...');
  const roles: Record<string, string> = {};
  for (const roleName of Object.values(RoleName)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName.replace('_', ' ')} role`,
      },
    });
    roles[roleName] = role.id;
    console.log(`  ✓ Role: ${roleName} (${role.id})`);
  }

  // Create permissions
  console.log('\nCreating permissions...');
  const permissionIds: Record<string, string> = {};
  for (const perm of PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });
    permissionIds[perm.name] = permission.id;
    console.log(`  ✓ Permission: ${perm.name}`);
  }

  // Assign permissions to roles
  console.log('\nAssigning permissions to roles...');
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roles[roleName];
    for (const permName of permNames) {
      const permissionId = permissionIds[permName];
      if (!permissionId) {
        console.warn(`  ⚠ Permission "${permName}" not found, skipping`);
        continue;
      }
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId, permissionId },
        },
        update: {},
        create: { roleId, permissionId },
      });
    }
    console.log(`  ✓ ${roleName}: ${permNames.length} permissions assigned`);
  }

  // Create initial categories for Module 3
  console.log('\nCreating tourism categories...');
  const CATEGORIES = [
    { name: 'Wildlife', slug: 'wildlife', description: 'Flora, fauna, and animal sighting spots' },
    { name: 'Waterfalls', slug: 'waterfalls', description: 'Scenic waterfalls and water bodies' },
    { name: 'Historical', slug: 'historical', description: 'Forts, ruins, and historical heritage sites' },
    { name: 'Adventure', slug: 'adventure', description: 'Safari, jungle routes, and outdoor exploration' },
    { name: 'Culture', slug: 'culture', description: 'Local tribal heritage, handicraft, and culture' },
    { name: 'Trekking', slug: 'trekking', description: 'Nature trails and hiking routes' },
  ];

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    console.log(`  ✓ Category: ${cat.name} (${cat.slug})`);
  }

  console.log('\n✅ Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
