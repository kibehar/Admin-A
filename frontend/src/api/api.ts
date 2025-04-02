import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const API_URLUser = "http://localhost:5000/api/users";
// Inventory API URLs
const API_URLInventory = "http://localhost:5000/api/inventory";


export const getInventory = async () => axios.get(`${API_URLInventory}`).then((res) => res.data);
export const getInventoryItem = async (id: string) => axios.get(`${API_URLInventory}/${id}`).then((res) => res.data);
export const addInventoryItem = async (data: any) => axios.post(`${API_URLInventory}/add`, data);
export const updateInventoryItem = async (id: string, data: any) => axios.put(`${API_URLInventory}/update/${id}`, data);
export const deleteInventoryItem = async (id: string) => axios.delete(`${API_URLInventory}/delete/${id}`);
export const getSuppliers = async () => axios.get(`${API_URLInventory}/suppliers`).then((res) => res.data);

export const adminSignup = async (data: any) => {
  return axios.post(`${API_URL}/signup`, data);
};

export const adminLogin = async (data: any) => {
  return axios.post(`${API_URL}/login`, data);
};

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URLUser}/usercreation`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {number} page 
 * @param {number} limit 
 * @param {string} search 
 * @param {string} role 
 */
export const getUsers = async (page = 1, limit = 5, search = "", role = "") => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(role && { role }),
    });

    const response = await axios.get(`${API_URLUser}/all?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URLUser}/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await axios.put(`${API_URLUser}/update/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAdminProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};

export const updateAdminProfile = async (profileData: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
};