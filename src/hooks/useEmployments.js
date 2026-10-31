import { useCallback, useEffect, useState } from "react";
import {
  createEmployment as createEmploymentRequest,
  deleteEmployment as deleteEmploymentRequest,
  getEmployments,
  updateEmployment as updateEmploymentRequest,
} from "../services/employmentsApi";

export function useEmployments() {
  const [employments, setEmployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEmployments(await getEmployments());
    } catch {
      setError("Could not load employers from the Tomo service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = async (employment) => {
    setError("");
    try {
      const created = await createEmploymentRequest(employment);
      setEmployments((current) => [created, ...current]);
      return created;
    } catch (requestError) {
      setError("Could not save the employer. Check the Tomo service and try again.");
      throw requestError;
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await deleteEmploymentRequest(id);
      setEmployments((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError("Could not delete the employer. Check the Tomo service and try again.");
      throw requestError;
    }
  };

  const update = async (id, employment) => {
    setError("");
    try {
      const updated = await updateEmploymentRequest(id, employment);
      setEmployments((current) => current.map((item) =>
        String(item.id) === String(id) ? { ...item, ...employment, ...updated } : item,
      ));
      return updated;
    } catch (requestError) {
      setError("Could not update the employer. Check the Tomo service and try again.");
      throw requestError;
    }
  };

  return { employers: employments, loading, error, create, update, remove };
}
