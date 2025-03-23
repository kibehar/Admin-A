import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const API_URLUser = "http://localhost:5000/api/users";

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
 * Fetch users with pagination, search, and role filter
 * @param {number} page - Page number
 * @param {number} limit - Number of users per page
 * @param {string} search - Search query (optional)
 * @param {string} role - Role filter (optional)
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
