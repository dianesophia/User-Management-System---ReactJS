import { env } from "@//config/env";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 6000,
});