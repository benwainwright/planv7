export const APP_ROUTE_PATH = "/app";

export const API_ROUTE_PATH = "/api";

export const AUTH_ROUTE_PATH = "/auth";

export const DATA_ROUTE_PATH = "/data";

export const FILES_ROUTE_PATH = "/files";

export const DEFAULT_SERVER_PORT = 1800;

export const DEFAULT_SERVER_HOST = "localhost";

const serverAddress = process.env.SERVER_ADDRESS ?? DEFAULT_SERVER_HOST;
const serverPort = process.env.SERVER_PORT ?? DEFAULT_SERVER_PORT;

export const API_URL = `http://${serverAddress}:${serverPort}${API_ROUTE_PATH}`;

export const MONGO_URL = `mongodb://localhost:27017`;

export const MONGO_DB_NAME = `planner_app`;

export const WEBPACK_WEBSOCKET_PORT = 8081;

export const APP_WEBSOCKET_PATH = `ws://${serverAddress}${DATA_ROUTE_PATH}`;

export const AUTH_ENDPOINT = `http://${serverAddress}${AUTH_ROUTE_PATH}`;

export const FILES_ENDPOINT = `http://${serverAddress}${FILES_ROUTE_PATH}`;
