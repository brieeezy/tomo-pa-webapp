import { useCallback, useEffect, useState } from "react";
import {
  createInvoice as createInvoiceRequest,
  deleteInvoice as deleteInvoiceRequest,
  getInvoices,
  updateInvoice as updateInvoiceRequest,
} from "../services/invoicesApi";

export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setInvoices(await getInvoices());
    } catch {
      setError("Could not load invoices from the Tomo service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = async (invoice) => {
    setError("");
    try {
      const created = await createInvoiceRequest(invoice);
      setInvoices((current) => [created, ...current]);
      return created;
    } catch (requestError) {
      setError("Could not save the invoice. Check the Tomo service and try again.");
      throw requestError;
    }
  };

  const update = async (id, changes) => {
    const current = invoices.find((invoice) => String(invoice.id) === String(id));
    if (!current) throw new Error("Invoice not found in the current list.");

    setError("");
    try {
      const saved = await updateInvoiceRequest(id, { ...current, ...changes });
      setInvoices((items) =>
        items.map((invoice) => (String(invoice.id) === String(id) ? saved : invoice)),
      );
      return saved;
    } catch (requestError) {
      setError("Could not update the invoice. Check the Tomo service and try again.");
      throw requestError;
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await deleteInvoiceRequest(id);
      setInvoices((current) => current.filter((invoice) => String(invoice.id) !== String(id)));
    } catch (requestError) {
      setError("Could not delete the invoice. Check the Tomo service and try again.");
      throw requestError;
    }
  };

  return { invoices, loading, error, create, update, remove };
}
