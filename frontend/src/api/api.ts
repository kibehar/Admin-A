import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Backend URL
const API_URLUser= "http://localhost:5000/api/users";
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
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URLUser}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return response.data;
  } catch (error) {
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