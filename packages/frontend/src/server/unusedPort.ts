let portsInUse: number[] = [];

export const unusedPort = (port: number): number => {
  let numberToTry = port;
  while (portsInUse.includes(numberToTry)) {
    numberToTry++;
  }
  portsInUse.push(numberToTry);
  return numberToTry;
};

export const portIsNoLongerInUse = (port: number): void => {
  portsInUse = portsInUse.filter((element: number) => element !== port);
};
