export const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

export const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
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
