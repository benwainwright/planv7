import { TEST_PUBLIC_KEY } from "@planv7/framework";

const initialisePublicKey = (): string => {
  if (!process.env.JWT_PUBLIC_KEY && process.env.NODE_ENV === "production") {
    throw new Error(`Must specify JWT_PUBLIC_KEY for production build`);
  }

  return process.env.JWT_PUBLIC_KEY ?? TEST_PUBLIC_KEY;
};

export default initialisePublicKey;
