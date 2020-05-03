const TYPES = {
  db: Symbol.for("Db"),
  responseAuthHeader: Symbol.for("ResponseAuthHeader"),
  authorisingDispatcher: Symbol.for("AuthorisingDispatcher"),
  jwtPublicKey: Symbol.for("JwtPublicKey"),
  jwtPrivateKey: Symbol.for("JwtPrivateKey"),
  clientStorage: Symbol.for("ClientStorage"),
  httpRequest: Symbol.for("HttpRequest"),
  websocketClient: Symbol.for("WebsocketClient"),
};

export default TYPES;
