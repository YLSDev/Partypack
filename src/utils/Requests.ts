import axios from "axios";
// TODO: grab this data from somewhere idk
axios.defaults.baseURL = import.meta.env.DEV ? "http://localhost:6677" : "https://partypack.mcthe.dev";
axios.defaults.withCredentials = true
axios.defaults.validateStatus = () => true;

export const AxInstance = axios.create();