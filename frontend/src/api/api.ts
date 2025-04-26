import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const API_URLUser = "http://localhost:5000/api/users";
const API_URLInventory = "http://localhost:5000/api/inventory";
const API_URLSales = "http://localhost:5000/api/sales";
const API_URLWarehouses = "http://localhost:5000/api/warehouses";
const API_URLSuppliers = "http://localhost:5000/api/suppliers";
const API_URLCategories = "http://localhost:5000/api/categories"; 


export const getSuppliers = async () =>
  axios.get(`${API_URLSuppliers}/list`).then((res) => res.data);

export const addSupplier = async (data: any) =>
  axios.post(`${API_URLSuppliers}/add`, data);

export const getSupplierById = async (id: string) =>
  axios.get(`${API_URLSuppliers}/${id}`).then((res) => res.data);

export const updateSupplier = async (id: string, data: any) =>
  axios.put(`${API_URLSuppliers}/update/${id}`, data);

export const deleteSupplier = async (id: string) =>
  axios.delete(`${API_URLSuppliers}/delete/${id}`);


export const getCategories = async () =>
  axios.get(`${API_URLCategories}/list`).then((res) => res.data);

export const addCategory = async (data: { name: string }) =>
  axios.post(`${API_URLCategories}/add`, data);


export const getInventory = async () =>
  axios.get(`${API_URLInventory}/list`).then((res) => res.data);

export const getInventoryItem = async (id: string) =>
  axios.get(`${API_URLInventory}/${id}`).then((res) => res.data);

export const addInventoryItem = async (data: any) =>
  axios.post(`${API_URLInventory}/add-item`, data);

export const updateInventoryItem = async (id: string, data: any) =>
  axios.put(`${API_URLInventory}/update-item/${id}`, data);

export const deleteInventoryItem = async (id: string) =>
  axios.delete(`${API_URLInventory}/delete/${id}`);


export const assignInventoryToWarehouse = async (data: {
  inventoryId: string;
  warehouseId: string;
  quantity: number;
}) =>
  axios.put(`${API_URLInventory}/assign-to-warehouse`, data).then((res) => res.data);

export const getLowStockItems = async () =>
  axios.get(`${API_URLInventory}/low-stock`).then((res) => res.data);


export const getWarehouses = async () =>
  axios.get(`${API_URLWarehouses}/list`).then((res) => res.data);

export const addWarehouse = async (data: any) =>
  axios.post(`${API_URLWarehouses}/add-warehouse`, data);

export const getWarehouseDetails = async (warehouseId: string) =>
  axios.get(`http://localhost:5000/api/warehouses/details/${warehouseId}`).then((res) => res.data);

export const updateWarehouse = async (id: string, data: any) =>
  axios.put(`${API_URLWarehouses}/update/${id}`, data);

export const deleteWarehouse = async (id: string) =>
  axios.delete(`${API_URLWarehouses}/delete/${id}`);





export const recordSale = async (data: any) =>
  axios.post(`${API_URLSales}/record-sale`, data);
export const getSales = async (filters: any = {}) =>
  axios.get(`${API_URLSales}/list`, { params: filters }).then((res) => res.data);



export const adminSignup = async (data: any) =>
  axios.post(`${API_URL}/signup`, data);

export const adminLogin = async (data: any) =>
  axios.post(`${API_URL}/login`, data);

export const getAdminProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateAdminProfile = async (profileData: any) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.put(`${API_URL}/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const createUser = async (userData: any) => {
  const response = await axios.post(`${API_URLUser}/usercreation`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getUsers = async (page = 1, limit = 5, search = "", role = "") => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(role && { role }),
  });

  const response = await axios.get(`${API_URLUser}/all?${queryParams.toString()}`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_URLUser}/delete/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await axios.put(`${API_URLUser}/update/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
