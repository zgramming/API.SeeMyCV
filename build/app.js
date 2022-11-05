"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_compose_1 = __importDefault(require("koa-compose"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_static_1 = __importDefault(require("koa-static"));
const contact_1 = __importDefault(require("./routes/cv/contact"));
const education_1 = __importDefault(require("./routes/cv/education"));
const experience_1 = __importDefault(require("./routes/cv/experience"));
const license_certificate_1 = __importDefault(require("./routes/cv/license_certificate"));
const portfolio_1 = __importDefault(require("./routes/cv/portfolio"));
const preview_1 = __importDefault(require("./routes/cv/preview"));
const profile_1 = __importDefault(require("./routes/cv/profile"));
const skill_1 = __importDefault(require("./routes/cv/skill"));
const access_menu_1 = __importDefault(require("./routes/setting/access_menu"));
const access_modul_1 = __importDefault(require("./routes/setting/access_modul"));
const documentation_1 = __importDefault(require("./routes/setting/documentation"));
const login_1 = __importDefault(require("./routes/setting/login"));
const master_category_1 = __importDefault(require("./routes/setting/master_category"));
const master_data_1 = __importDefault(require("./routes/setting/master_data"));
const menu_1 = __importDefault(require("./routes/setting/menu"));
const modul_1 = __importDefault(require("./routes/setting/modul"));
const parameter_1 = __importDefault(require("./routes/setting/parameter"));
const user_1 = __importDefault(require("./routes/setting/user"));
const user_group_1 = __importDefault(require("./routes/setting/user_group"));
const user_2 = __importDefault(require("./routes/v1/user"));
const cors = require("@koa/cors");
const app = new koa_1.default();
require("dotenv").config();
// const multer = require("@koa/multer");
// app.use(multer());
app.use((0, koa_body_1.default)({ multipart: true }));
app.use(cors());
app.use((0, koa_json_1.default)());
app.use((0, koa_logger_1.default)());
/// Make folder file accessible via url
app.use((0, koa_static_1.default)("./public"));
app.use((0, koa_compose_1.default)([login_1.default.routes(), login_1.default.allowedMethods()]));
/// Setting
app.use((0, koa_compose_1.default)([user_1.default.routes(), user_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([user_group_1.default.routes(), user_group_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([modul_1.default.routes(), modul_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([menu_1.default.routes(), menu_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([access_modul_1.default.routes(), access_modul_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([access_menu_1.default.routes(), access_menu_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([
    master_category_1.default.routes(),
    master_category_1.default.allowedMethods(),
]));
app.use((0, koa_compose_1.default)([master_data_1.default.routes(), master_data_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([parameter_1.default.routes(), parameter_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([
    documentation_1.default.routes(),
    documentation_1.default.allowedMethods(),
]));
/// CV
app.use((0, koa_compose_1.default)([profile_1.default.routes(), profile_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([experience_1.default.routes(), experience_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([education_1.default.routes(), education_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([skill_1.default.routes(), skill_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([
    license_certificate_1.default.routes(),
    license_certificate_1.default.allowedMethods(),
]));
app.use((0, koa_compose_1.default)([portfolio_1.default.routes(), portfolio_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([preview_1.default.routes(), preview_1.default.allowedMethods()]));
app.use((0, koa_compose_1.default)([contact_1.default.routes(), contact_1.default.allowedMethods()]));
/// V1
app.use((0, koa_compose_1.default)([user_2.default.routes(), user_2.default.allowedMethods()]));
app.listen(process.env.PORT, () => {
    console.log("Koa server is started on " + process.env.PORT);
});
