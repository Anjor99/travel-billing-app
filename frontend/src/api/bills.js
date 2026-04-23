import apiClient from "./api-client";
import endpoints from "./api-endpoints";

// CREATE BILL
export const createBill = async (data) => {

  const res =
    await apiClient.post(
      endpoints.bills.createBill,
      data
    );

  return res.data;

};