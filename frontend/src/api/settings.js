import apiClient from "./api-client";
import endpoints from "./api-endpoints";

export const getHeaderFooterURL =
  async () => {

  const res =
    await apiClient.get(
      endpoints.settings.getHeaderFooterURL
    );

  return res.data;

};


export const uploadHeader =
  async (file) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const res =
    await apiClient.post(

      endpoints.settings.uploadHeader,

      formData

    );

  return res.data;

};


export const uploadFooter =
  async (file) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const res =
    await apiClient.post(

      endpoints.settings.uploadFooter,

      formData

    );

  return res.data;

};


export const deleteHeader =
  async () => {

  const res =
    await apiClient.delete(
      endpoints.settings.deleteHeader
    );

  return res.data;

};


export const deleteFooter =
  async () => {

  const res =
    await apiClient.delete(
      endpoints.settings.deleteFooter
    );

  return res.data;

};