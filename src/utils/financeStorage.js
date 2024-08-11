const FINANCES_STORAGE_KEY = 'hagsFinances';

export const saveFinance = (financeInfo) => {
  const existingFinances = getFinances();
  const updatedFinances = [...existingFinances, financeInfo];
  localStorage.setItem(FINANCES_STORAGE_KEY, JSON.stringify(updatedFinances));
};

export const getFinances = () => {
  const finances = localStorage.getItem(FINANCES_STORAGE_KEY);
  return finances ? JSON.parse(finances) : [];
};

export const clearAllFinances = () => {
  localStorage.removeItem(FINANCES_STORAGE_KEY);
};

export const getTotalFinance = () => {
  const finances = getFinances();
  return finances.reduce((total, finance) => total + finance.amount, 0);
};
