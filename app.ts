import Koa from 'koa';
import KoaBody from 'koa-body';
import BodyParser from 'koa-bodyparser';
import KoaCompose from 'koa-compose';
import Json from 'koa-json';
import Logger from 'koa-logger';

import AccessMenuRouter from './routes/setting/access_menu';
import AccessModulRouter from './routes/setting/access_modul';
import DocumentationRouter from './routes/setting/documentation';
import LoginRouter from './routes/setting/login';
import MasterCategoryRouter from './routes/setting/master_category';
import MasterDataRouter from './routes/setting/master_data';
import MenuRouter from './routes/setting/menu';
import ModulRouter from './routes/setting/modul';
import ParameterRouter from './routes/setting/parameter';
import UserRouter from './routes/setting/user';
import UserGroupRouter from './routes/setting/user_group';

const cors = require("@koa/cors");
const app = new Koa();
app.use(
  KoaBody({
    multipart: true,
  })
);

app.use(cors());
app.use(Json());
app.use(Logger());
app.use(BodyParser());

app.use(KoaCompose([UserRouter.routes(), UserRouter.allowedMethods()]));
app.use(KoaCompose([UserGroupRouter.routes(), UserGroupRouter.allowedMethods()]));
app.use(KoaCompose([ModulRouter.routes(), ModulRouter.allowedMethods()]));
app.use(KoaCompose([MenuRouter.routes(), MenuRouter.allowedMethods()]));
app.use(KoaCompose([AccessModulRouter.routes(), AccessModulRouter.allowedMethods()]));
app.use(KoaCompose([AccessMenuRouter.routes(), AccessMenuRouter.allowedMethods()]));
app.use(KoaCompose([MasterCategoryRouter.routes(), MasterCategoryRouter.allowedMethods()]));
app.use(KoaCompose([MasterDataRouter.routes(), MasterDataRouter.allowedMethods()]));
app.use(KoaCompose([ParameterRouter.routes(), ParameterRouter.allowedMethods()]));
app.use(KoaCompose([DocumentationRouter.routes(), DocumentationRouter.allowedMethods()]));

app.use(KoaCompose([LoginRouter.routes(),LoginRouter.allowedMethods()]))



app.listen(process.env.PORT, () => {
  console.log("Koa server is started on " + process.env.PORT);
});
