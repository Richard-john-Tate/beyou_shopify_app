import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import connectDB from "./dbConnect";
import Report from "./models/report_models";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.January21,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("/api/v1/reports", async (ctx) => {
    try {
      const reports = await Report.find({});
      ctx.status = 200;
      ctx.body = reports;
    } catch (error) {
      ctx.status = 500;
      ctx.body = error;
    }
  });
  router.get("/api/v1/reports/:id", async (ctx) => {
    try {
      const report = await Report.findById(ctx.params.id);
      ctx.status = 200;
      ctx.body = report;
    } catch (error) {
      ctx.status = 500;
      ctx.body = error;
    }
  });
  router.post("/api/v1/reports", async (ctx) => {
    try {
      const {
        category,
        links,
        certificates,
        imgUrl,
        batchId,
        cannabinoid,
        cbdPercentage,
        cdbMG_ML,
      } = ctx.request.body;
      const report = new Report({
        category,
        links,
        certificates,
        imgUrl,
        batchId,
        cannabinoid,
        cbdPercentage,
        cdbMG_ML,
      });
      await report.save();
      ctx.status = 200;
      ctx.body = report;
    } catch (error) {
      ctx.status = 500;
      ctx.body = error;
    }
  });
  router.patch("/api/v1/reports/:id", async (ctx) => {
    try {
      const report = await Report.findById(ctx.params.id);
      const {
        category,
        links,
        certificates,
        imgUrl,
        batchId,
        cannabinoid,
        cbdPercentage,
        cdbMG_ML,
      } = ctx.request.body;
      report.category = category;
      report.links = links;
      report.certificates = certificates;
      report.imgUrl = imgUrl;
      report.batchId = batchId;
      report.cannabinoid = cannabinoid;
      report.cbdPercentage = cbdPercentage;
      report.cdbMG_ML = cdbMG_ML;
      await report.save();
      ctx.status = 200;
      ctx.body = report;
    } catch (error) {
      ctx.status = 500;
      ctx.body = error;
    }
  });

  //=======================================================//
  //==================SCRIPT TAG ROUTES====================//

  //===================CREATE SCRIPT TAGS=================//
  //======================================================//

  router.get("/installScriptTags", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;

    const response = await scriptTag.createScriptTag(accessToken, shop);
    //console.log(response);
    ctx.body = response;
    ctx.res.statusCode = 200;
  });

  //======================================================//
  //          DELETE SCRIPT TAG ROUTER
  //======================================================//

  router.get("/uninstallScriptTag", verifyRequest(), async (ctx, res) => {
    const { shop, accessToken } = ctx.session;
    const scriptTagID = ctx.query.id;

    await scriptTag.deleteScriptTag(accessToken, shop, scriptTagID);

    ctx.res.statusCode = 200;
  });

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(bodyParser());
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    connectDB;
  });
});
