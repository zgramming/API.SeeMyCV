import Koa from "koa";
import KoaBody from "koa-body";
import KoaCompose from "koa-compose";
import Json from "koa-json";
import Logger from "koa-logger";
import Serve from "koa-static";
import CVEducationRouter from "./routes/cv/education";
import CVExperienceRouter from "./routes/cv/experience";
import CVLicenseCertificateRouter from "./routes/cv/license_certificate";
import CVPortfolioRouter from "./routes/cv/portfolio";

import CVProfileRouter from "./routes/cv/profile";
import CVSkillRouter from "./routes/cv/skill";
import AccessMenuRouter from "./routes/setting/access_menu";
import AccessModulRouter from "./routes/setting/access_modul";
import DocumentationRouter from "./routes/setting/documentation";
import LoginRouter from "./routes/setting/login";
import MasterCategoryRouter from "./routes/setting/master_category";
import MasterDataRouter from "./routes/setting/master_data";
import MenuRouter from "./routes/setting/menu";
import ModulRouter from "./routes/setting/modul";
import ParameterRouter from "./routes/setting/parameter";
import UserRouter from "./routes/setting/user";
import UserGroupRouter from "./routes/setting/user_group";

const cors = require("@koa/cors");
const app = new Koa();
const multer = require("@koa/multer");
// app.use(multer());
app.use(KoaBody({ multipart: true }));

app.use(cors());
app.use(Json());
app.use(Logger());

/// Make folder file accessible via url
app.use(Serve(__dirname + "/public"));

app.use(KoaCompose([LoginRouter.routes(), LoginRouter.allowedMethods()]));

/// Setting
app.use(KoaCompose([UserRouter.routes(), UserRouter.allowedMethods()]));
app.use(
  KoaCompose([UserGroupRouter.routes(), UserGroupRouter.allowedMethods()])
);
app.use(KoaCompose([ModulRouter.routes(), ModulRouter.allowedMethods()]));
app.use(KoaCompose([MenuRouter.routes(), MenuRouter.allowedMethods()]));
app.use(
  KoaCompose([AccessModulRouter.routes(), AccessModulRouter.allowedMethods()])
);
app.use(
  KoaCompose([AccessMenuRouter.routes(), AccessMenuRouter.allowedMethods()])
);
app.use(
  KoaCompose([
    MasterCategoryRouter.routes(),
    MasterCategoryRouter.allowedMethods(),
  ])
);
app.use(
  KoaCompose([MasterDataRouter.routes(), MasterDataRouter.allowedMethods()])
);
app.use(
  KoaCompose([ParameterRouter.routes(), ParameterRouter.allowedMethods()])
);
app.use(
  KoaCompose([
    DocumentationRouter.routes(),
    DocumentationRouter.allowedMethods(),
  ])
);

/// CV
app.use(
  KoaCompose([CVProfileRouter.routes(), CVProfileRouter.allowedMethods()])
);
app.use(
  KoaCompose([CVExperienceRouter.routes(), CVExperienceRouter.allowedMethods()])
);
app.use(
  KoaCompose([CVEducationRouter.routes(), CVEducationRouter.allowedMethods()])
);
app.use(KoaCompose([CVSkillRouter.routes(), CVSkillRouter.allowedMethods()]));
app.use(
  KoaCompose([
    CVLicenseCertificateRouter.routes(),
    CVLicenseCertificateRouter.allowedMethods(),
  ])
);
app.use(
  KoaCompose([CVPortfolioRouter.routes(), CVPortfolioRouter.allowedMethods()])
);

app.listen(process.env.PORT, () => {
  console.log("Koa server is started on " + process.env.PORT);
});
