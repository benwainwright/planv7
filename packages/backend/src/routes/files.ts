import * as AWS from "aws-sdk";
import * as constants from "../constants";
import Koa, { Next } from "koa";
import Router, { RouterContext } from "koa-router";
import AppContext from "../AppContext";

const FILES_BASE_URL = "files";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const files = (): Koa.Middleware<any, any> => {
  const baseUrlRegex = new RegExp(`\\/${FILES_BASE_URL}($|\\/.*)`, "u");
  const router = new Router<Koa.DefaultState, AppContext & RouterContext>();

  const s3 = new AWS.S3();

  router.post(
    baseUrlRegex,
    async (context: AppContext & RouterContext, next: Next) => {
      if (!context.request.body.path) {
        context.response.status = 400;
        context.response.body = "Missing 'path' parameter";
      } else if (!context.request.body.contentType) {
        context.response.status = 400;
        context.response.body = "Missing 'contentType' parameter";
      } else {
        const url = await s3.getSignedUrlPromise("putObject", {
          /* eslint-disable @typescript-eslint/naming-convention */
          Bucket: process.env.FILES_BUCKET,
          ContentType: context.request.body.contentType,
          Key: context.request.body.path,
          Expires: constants.PRESIGNED_URL_EXPIRY,
          /* eslint-enable @typescript-eslint/naming-convention */
        });
        context.response.status = 200;
        context.response.body = JSON.stringify({ url });
      }
      await next();
    }
  );
  return router.routes();
};

export default files;
