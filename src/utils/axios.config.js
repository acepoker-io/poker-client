import axios from "axios";
import CONSTANTS from "../config/contants";
// import { getCookie } from "./cookieUtil";

const getAuthorizationHeader = () =>`Bearer ${localStorage.getItem('token')}`;
export const userInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/users`,
    headers: { Authorization: getAuthorizationHeader() },
  });

export const authInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/auth`,
    headers: { Authorization: getAuthorizationHeader() },
  });

export const pokerInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/poker`,
    headers: { Authorization: getAuthorizationHeader() },
  });
export const tournamentInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}/tournament`,
    headers: { Authorization: getAuthorizationHeader() },
  });
