import axios from "axios";

const instance = axios.create({
 baseURL: "http://localhost:3000/api",
  withCredentials: true, 
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user._id) {
    config.headers["x-user-id"] = user._id;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


export default instance;
