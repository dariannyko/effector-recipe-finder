import { routes } from "../../shared/routing";

export const currentRoute = routes.auth.register;

currentRoute.opened.watch(() => console.info("Search route opened"));
