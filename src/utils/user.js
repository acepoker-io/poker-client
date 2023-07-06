import axios from "axios";
// import { getCookie } from "./cookieUtil";
import CONSTANTS from "../config/contants";
// import { pokerInstance } from "./axios.config";

const getAuthUserData = async () => {
  // const disconnect = useDisconnect();
  try {
    if (localStorage.getItem("token")) {
      let userData = await axios({
        method: "get",
        url: `${CONSTANTS.serverUrl}/poker/check-auth`,
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { success: true, data: userData.data };
    } else {
      return { success: false, data: {} };
    }
  } catch (error) {
    console.log(error);
    // disconnect();
    // localStorage.clear();
    // history.push("/");
    // window.location.href = "/";
    return { success: false };
  }
};

const userUtils = {
  getAuthUserData,
};

export default userUtils;
