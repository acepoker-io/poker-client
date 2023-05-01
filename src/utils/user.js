import axios from "axios";
// import { getCookie } from "./cookieUtil";
import CONSTANTS from "../config/contants";
// import { pokerInstance } from "./axios.config";

const getAuthUserData = async () => {
  try {
    let userData = await axios({
      method: "get",
      url: `${CONSTANTS.serverUrl}/poker/check-auth`,
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    return { success: true, data: userData.data };
  } catch (error) {
    console.log(error);
    localStorage.removeItem('token')
    return { success: false };
  }
};

const userUtils = {
  getAuthUserData,
};

export default userUtils;
