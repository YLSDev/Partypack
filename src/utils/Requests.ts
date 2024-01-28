import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_ROOT_URL ?? "http://localhost:6677";
axios.defaults.withCredentials = true
axios.defaults.validateStatus = () => true;

export const AxInstance = axios.create();