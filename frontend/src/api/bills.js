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

/* GET ALL BILLS */

export const getBills = async () => {

  const res =
    await apiClient.get(
      endpoints.bills.list
    );

  return res.data;

};

/* GET SINGLE BILL */

export const getBillById = async (id) => {

  const res =
    await apiClient.get(
      endpoints.bills.getById(id)
    );

  return res.data;

};

/* DELETE BILL */

export const deleteBill = async (id) => {

  const res =
    await apiClient.delete(
      `/api/bills/${id}`
    );

  return res.data;

};

/* DOWNLOAD PDF */

export const downloadBillPdf = async (id) => {

  try {

    const res =
      await apiClient.get(
        `/api/bills/${id}/pdf`,
        {
          responseType: "blob"
        }
      );

    // Create blob URL

    const blob =
      new Blob(
        [res.data],
        {
          type: "application/pdf"
        }
      );

    const url =
      window.URL.createObjectURL(blob);

    // Create download link

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `bill_${id}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  }
  catch (err) {

    console.error(
      "PDF download failed",
      err
    );

  }

};