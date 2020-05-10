const TYPES = {
  db: Symbol.for("b"),
  responseAuthHeader: Symbol.for("responseAuthHeader"),
  authorisingDispatcher: Symbol.for("authorisingDispatcher"),
  jwtPublicKey: Symbol.for("jwtPublicKey"),
  jwtPrivateKey: Symbol.for("jwtPrivateKey"),
  clientStorage: Symbol.for("clientStorage"),
  httpRequest: Symbol.for("httpRequest"),
  websocketClient: Symbol.for("websocketClient"),
  localStorageKey: Symbol.for("localStorageKey"),
  authEndpoint: Symbol.for("authEndpoint"),
  jwtToken: Symbol.for("jwtToken"),
  appWebsocketUrl: Symbol.for("appWebsocketUrl"),
  dispatchEndpoint: Symbol.for("dispatchEndpoint"),
};

export default TYPES;
