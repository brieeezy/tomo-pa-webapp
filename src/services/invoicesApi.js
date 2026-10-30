import axios from "axios";
import { getApiCredentials } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_INVOICES_API_URL || "/api/invoices",
});
api.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

function toInvoiceDTO(invoice) {
  return {
    invoiceId: invoice.invoiceId,
    employmentId: Number(invoice.employmentId),
    netIncome: Number(invoice.netIncome),
    postedDate: invoice.postedDate,
    status: invoice.status,
    taxType: invoice.taxType || "",
    tax: Number(invoice.tax || 0),
    deductibles: Number(invoice.deductibles || 0),
    grossIncome: Number(invoice.grossIncome || 0),
  };
}

export async function getInvoices() {
  const response = await api.get("");
  return response.data;
}

export async function createInvoice(invoice) {
  const response = await api.post("", toInvoiceDTO(invoice));
  return response.data;
}

export async function updateInvoice(id, invoice) {
  const response = await api.put(`/${id}`, toInvoiceDTO(invoice));
  return response.data;
}

export async function deleteInvoice(id) {
  await api.delete(`/${id}`);
}
