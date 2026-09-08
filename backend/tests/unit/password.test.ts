import argon2 from 'argon2';

describe('Password Hashing', () => {
  const testPassword = 'TestP@ssw0rd!';

  it('should hash a password with argon2id', async () => {
    const hash = await argon2.hash(testPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    expect(hash).toBeDefined();
    expect(hash).not.toBe(testPassword);
    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it('should verify a correct password', async () => {
    const hash = await argon2.hash(testPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const isValid = await argon2.verify(hash, testPassword);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hash = await argon2.hash(testPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const isValid = await argon2.verify(hash, 'WrongPassword123!');
    expect(isValid).toBe(false);
  });

  it('should produce different hashes for the same password', async () => {
    const hash1 = await argon2.hash(testPassword, { type: argon2.argon2id });
    const hash2 = await argon2.hash(testPassword, { type: argon2.argon2id });

    expect(hash1).not.toBe(hash2);
  });

  it('should never return the plaintext password', async () => {
    const hash = await argon2.hash(testPassword, { type: argon2.argon2id });
    expect(hash).not.toContain(testPassword);
  });
});
