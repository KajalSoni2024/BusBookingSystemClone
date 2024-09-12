console.log(process.env.VUE_APP_BASEURL);
const BASEURL = process.env.VUE_APP_BASEURL;
const axios = require("axios");
const $axios = axios.create({ baseURL: BASEURL, withCredentials: true });
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
module.exports = { axiosPost, axiosGet };
