import Koa from "koa";
import KoaBody from "koa-body";
import Json from "koa-json";
import Logger from "koa-logger";
import Serve from "koa-static";

import router from "./router";

const cors = require("@koa/cors");
const app = new Koa();
require("dotenv").config();

// const multer = require("@koa/multer");
// app.use(multer());
app.use(KoaBody({ multipart: true }));

app.use(cors());
app.use(Json());
app.use(Logger());

/// Make folder file accessible via url
app.use(Serve("./public"));

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  console.log("Koa server is started on " + process.env.PORT);
});
