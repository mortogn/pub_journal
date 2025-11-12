type UserRole = 'ADMIN' | 'AUTHOR' | 'EDITOR' | 'REVIEWER';

/**
 * Type for field filtering rules
 * - Array of roles: field is visible only to those roles
 * - Function: custom logic to determine visibility
 */
type FieldRules<T> = {
  [K in keyof T]?: UserRole[] | ((role: UserRole) => boolean);
};

/**
 * Generic function to filter object fields based on user role
 * Returns the same type as input to maintain compatibility
 */
export function filterByRole<T extends Record<string, any>>(
  data: T,
  role: UserRole,
  fieldRules: FieldRules<T>,
): T {
  if (!data) return data;

  const result: any = {};

  for (const key in data) {
    const rule = fieldRules[key as keyof T];

    // If no rule exists, include the field by default
    if (!rule) {
      result[key] = data[key];
      continue;
    }

    // If rule is an array of allowed roles
    if (Array.isArray(rule)) {
      if (rule.includes(role)) {
        result[key] = data[key];
      }
      continue;
    }

    // If rule is a function, call it to determine inclusion
    if (typeof rule === 'function') {
      if (rule(role)) {
        result[key] = data[key];
      }
      continue;
    }
  }

  return result as T;
}

/**
 * Filter an array of objects based on role
 * Returns the same type as input to maintain compatibility
 */
export function filterArrayByRole<T extends Record<string, any>>(
  data: T[],
  role: UserRole,
  fieldRules: FieldRules<T>,
): T[] {
  return data.map((item) => filterByRole(item, role, fieldRules));
}
