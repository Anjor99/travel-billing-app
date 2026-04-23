const endpoints = {

  auth:{
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
  
  bills:{
    createBill: "/api/bills/",
    list: "/api/bills/",
    getById: (id) => `/api/bills/${id}`,
  }
};

export default endpoints;