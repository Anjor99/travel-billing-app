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

// VERIFY EMAIL
export const verifyEmail =
  async (token) => {

  const res =
    await apiClient.get(

      endpoints.auth.verifyEmail(token)

    );

  return res.data;

};

// FORGOT PASSWORD
export const forgotPassword =
  async (data) => {

  const res =
    await apiClient.post(

      endpoints.auth.forgotPwd,
      data

    );

  return res.data;

};

// RESET PASSWORD
export const resetPassword =
  async (data) => {

  const res =
    await apiClient.post(

      endpoints.auth.resetPwd,
      data

    );

  return res.data;

};