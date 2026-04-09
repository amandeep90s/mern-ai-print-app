import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password
 * @param password
 * @returns hashed password
 */
export const hashValue = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare a plain text password with a hashed password
 * @param data object containing the plain text password and the hashed password
 * @returns boolean indicating if the passwords match
 */
export const compareValue = async (data: {
  password: string;
  hash: string;
}): Promise<boolean> => {
  return await bcrypt.compare(data.password, data.hash);
};
