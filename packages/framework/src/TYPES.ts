const TYPES = {
  db: Symbol.for("b"),
  jwtPublicKey: Symbol.for("jwtPublicKey"),
  jwtPrivateKey: Symbol.for("jwtPrivateKey"),
  websocketClient: Symbol.for("websocketClient"),
  authEndpoint: Symbol.for("authEndpoint"),
  appWebsocketUrl: Symbol.for("appWebsocketUrl"),
};

export default TYPES;
