import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { detectLanguage } from "../i18n/index.ts";

export const getLanguage = createServerFn({ method: "GET" }).handler(() => detectLanguage(getRequest()));
