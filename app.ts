import Koa from "koa";
import KoaBody from "koa-body";
import KoaCompose from "koa-compose";
import Json from "koa-json";
import Logger from "koa-logger";
import Serve from "koa-static";

import router from "./router";
import CVContactRouter from "./routes/cv/contact";
import CVEducationRouter from "./routes/cv/education";
import CVExperienceRouter from "./routes/cv/experience";
import CVLicenseCertificateRouter from "./routes/cv/license_certificate";
import CVPortfolioRouter from "./routes/cv/portfolio";
import CVPreviewRouter from "./routes/cv/preview";
import CVProfileRouter from "./routes/cv/profile";
import CVSkillRouter from "./routes/cv/skill";
import LoginRouter from "./routes/setting/login";
import V1TemplatePdfRouter from "./routes/v1/template_pdf";
import V1UserRouter from "./routes/v1/user";

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
