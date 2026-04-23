const endpoints = {

  auth:{
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
  
  bills:{
    createBill: "/api/bills/",
    list: "/api/bills/",
    getById: (id) => `/api/bills/${id}`,
    downloadBillPdf: (id) => `/api/bills/${id}/pdf`,
  }
};

export default endpoints;