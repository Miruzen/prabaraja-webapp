
// Utility functions for handling Indonesian number formatting

export const parseIndonesianCurrency = (currencyString: string): number => {
  if (!currencyString || typeof currencyString !== 'string') {
    return 0;
  }

  // Remove "Rp " prefix and any whitespace
  const cleanString = currencyString.replace(/Rp\s*/g, '').trim();
  
  // Handle Indonesian number format where dots are thousand separators
  // and commas are decimal separators (if any)
  // Example: "1.532.500" should become 1532500
  // Example: "1.532.500,50" should become 1532500.50
  
  // Check if there's a comma (decimal separator)
  const hasDecimal = cleanString.includes(',');
  
  if (hasDecimal) {
    // Split by comma to separate integer and decimal parts
    const [integerPart, decimalPart] = cleanString.split(',');
    // Remove dots from integer part (thousand separators)
    const cleanInteger = integerPart.replace(/\./g, '');
    // Combine with decimal part
    const result = parseFloat(`${cleanInteger}.${decimalPart}`);
    return isNaN(result) ? 0 : result;
  } else {
    // No decimal part, just remove dots (thousand separators)
    const cleanNumber = cleanString.replace(/\./g, '');
    const result = parseFloat(cleanNumber);
    return isNaN(result) ? 0 : result;
  }
};

export const formatIndonesianCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const validateCurrencyAmount = (amount: any): boolean => {
  if (typeof amount === 'number') {
    return !isNaN(amount) && isFinite(amount);
  }
  
  if (typeof amount === 'string') {
    const parsed = parseIndonesianCurrency(amount);
    return !isNaN(parsed) && isFinite(parsed);
  }
  
  return false;
};
