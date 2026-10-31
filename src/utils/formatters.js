export const formatMoney = (amount, currency = "PHP") =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

export const formatDate = (date) => {
  if (!date) return "—";
  const value =
    date instanceof Date
      ? date
      : /^\d{4}-\d{2}-\d{2}$/.test(String(date))
        ? new Date(`${date}T00:00:00`)
        : new Date(date);
  if (Number.isNaN(value.getTime())) return String(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
};

export const calculateInvoice = (invoice) => {
  if (invoice.grossIncome != null) return Number(invoice.grossIncome);
  if (invoice.netIncome != null) {
    return (
      Number(invoice.netIncome || 0) +
      Number(invoice.tax || 0) +
      Number(invoice.deductibles || 0)
    );
  }
  return Number(invoice.hours || 0) * Number(invoice.rate || 0);
};
