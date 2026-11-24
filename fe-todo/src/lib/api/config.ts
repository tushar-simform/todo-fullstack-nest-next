import "server-only";
import { DEFAULT_API_URL } from "@/constants";

export const API_URL = process.env.API_URL ?? DEFAULT_API_URL;
