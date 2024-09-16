console.log(process.env.VUE_APP_BASEURL);
const BASEURL = process.env.VUE_APP_BASEURL;
const axios = require("axios");
const $axios = axios.create({ baseURL: BASEURL, withCredentials: true });
$axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  })

const axiosPost = async (url, body) => {
  return await $axios.post(url, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const axiosGet = async (url) => {
  return await $axios.get(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
module.exports = { axiosPost, axiosGet, $axios };
