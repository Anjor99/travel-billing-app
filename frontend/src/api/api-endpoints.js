const endpoints = {

  auth:{
    login: "/api/auth/login",
    register: "/api/auth/register",
    verifyEmail: (token) => `/api/auth/verify-email?token=${token}`,
    forgotPwd: "/api/auth/forgot-password",
    resetPwd: "/api/auth/reset-password"
  },
  
  bills:{
    createBill: "/api/bills/",
    list: "/api/bills/",
    getById: (id) => `/api/bills/${id}`,
    downloadBillPdf: (id) => `/api/bills/${id}/pdf`,
  },

  settings:{
    getHeaderFooterURL: "/api/settings/get-settings",
    uploadHeader: "/api/settings/upload-header",
    uploadFooter: "/api/settings/upload-footer",
    deleteHeader: "/api/settings/delete-header",
    deleteFooter: "/api/settings/delete-footer"
  }
};

export default endpoints;