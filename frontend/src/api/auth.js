import apiClient from "./api-client";
import endpoints from "./api-endpoints";

// LOGIN
export const loginUser = async (data) => {

  const res =
    await apiClient.post(
      endpoints.auth.login,
      data
    );

  return res.data;

};

// REGISTER
export const registerUser = async (data) => {

  const res =
    await apiClient.post(
      endpoints.auth.register,
      data
    );

  return res.data;

};