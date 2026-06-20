/**
 * Formats a salaryRange object into a human-readable string.
 * 
 * The backend SalaryRange entity has fields: minSalary, maxSalary, currency, isDisclosed.
 * Jackson serializes the boolean `isDisclosed` as `disclosed` in JSON.
 * 
 * @param {Object|string|null} salary - The salary range object or a pre-formatted string
 * @returns {string} Formatted salary string, e.g. "₹6,00,000 - ₹12,00,000 per year"
 */
export const formatSalary = (salary) => {
  // If it's already a string (e.g. mock data), return it directly
  if (typeof salary === 'string') {
    return salary;
  }

  // If null/undefined, treat as not disclosed
  if (!salary) {
    return 'Salary Not Disclosed';
  }

  // Check the disclosed flag — Jackson serializes `isDisclosed` as `disclosed`
  const isDisclosed = salary.disclosed ?? salary.isDisclosed ?? false;
  if (!isDisclosed) {
    return 'Salary Not Disclosed';
  }

  const min = salary.minSalary ?? salary.min;
  const max = salary.maxSalary ?? salary.max;

  if (min == null || max == null) {
    return 'Salary Not Disclosed';
  }

  const currencySymbol = salary.currency || '₹';
  return `${currencySymbol}${Number(min).toLocaleString('en-IN')} - ${currencySymbol}${Number(max).toLocaleString('en-IN')} per year`;
};
