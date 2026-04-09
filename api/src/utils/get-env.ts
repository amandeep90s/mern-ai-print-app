/**
 * Get environment variable value or throw an error if not set
 * @param key
 * @param defaultValue
 * @returns string
 * @throws Error if environment variable is not set and no default value is provided
 */
export const getEnv = (key: string, defaultValue: string = '') => {
  const value = process.env[key] ?? defaultValue;

  if (!value) throw new Error(`Environment variable ${key} is not set`);

  return value;
};
