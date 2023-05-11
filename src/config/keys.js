import config from "./config.json";

const configData = config[process.env.REACT_APP_ENV];
export const { clientUrl, PUBLICK_KEY, landingUrl } = configData;
