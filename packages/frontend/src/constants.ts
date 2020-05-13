export const APP_ROUTE_PATH = "/app";

export const API_ROUTE_PATH = "/api";

export const AUTH_ROUTE_PATH = "/auth";

export const DEFAULT_SERVER_PORT = 1800;

export const DEFAULT_SERVER_HOST = "localhost";

export const API_URL = `http://${
  process.env.SERVER_ADDRESS ?? DEFAULT_SERVER_HOST
}:${process.env.SERVER_PORT ?? DEFAULT_SERVER_PORT}${API_ROUTE_PATH}`;

export const MONGO_URL = `mongodb://localhost:27017`;

export const MONGO_DB_NAME = `planner_app`;

export const WEBPACK_WEBSOCKET_PORT = 8081;

export const APP_WEBSOCKET_PATH = "ws://localhost/data";

export const AUTH_ENDPOINT = `http://localhost${AUTH_ROUTE_PATH}`;
