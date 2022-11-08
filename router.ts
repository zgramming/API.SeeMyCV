// app.use(KoaCompose([LoginRouter.routes(), LoginRouter.allowedMethods()]));

import Router from "koa-router";
import { SettingAccessMenuController } from "./routes/setting/access_menu";

import { SettingAccessModulController } from "./routes/setting/access_modul";
import { SettingDocumentationController } from "./routes/setting/documentation";
import { SettingMasterCategoryController } from "./routes/setting/master_category";
import { SettingMasterDataController } from "./routes/setting/master_data";
import { SettingMenuController } from "./routes/setting/menu";
import { SettingModulController } from "./routes/setting/modul";
import { SettingParameterController } from "./routes/setting/parameter";
import { SettingUserController } from "./routes/setting/user";
import { SettingUserGroupController } from "./routes/setting/user_group";

// /// Setting
//* app.use(KoaCompose([UserRouter.routes(), UserRouter.allowedMethods()]));
//* app.use(
//*  KoaCompose([UserGroupRouter.routes(), UserGroupRouter.allowedMethods()])
//* );

//* app.use(KoaCompose([ModulRouter.routes(), ModulRouter.allowedMethods()]));
//* app.use(KoaCompose([MenuRouter.routes(), MenuRouter.allowedMethods()]));
//* app.use(
//*   KoaCompose([AccessModulRouter.routes(), AccessModulRouter.allowedMethods()])
//* );
//* app.use(
//*   KoaCompose([AccessMenuRouter.routes(), AccessMenuRouter.allowedMethods()])
//* );

//* app.use(
//*   KoaCompose([
//*     MasterCategoryRouter.routes(),
//*     MasterCategoryRouter.allowedMethods(),
//*   ])
//* );

//* app.use(
//*   KoaCompose([MasterDataRouter.routes(), MasterDataRouter.allowedMethods()])
//* );

//* app.use(
//*   KoaCompose([ParameterRouter.routes(), ParameterRouter.allowedMethods()])
//* );

//* app.use(
//*   KoaCompose([
//*     DocumentationRouter.routes(),
//*     DocumentationRouter.allowedMethods(),
//*   ])
//* );

// /// CV
// app.use(
//   KoaCompose([CVProfileRouter.routes(), CVProfileRouter.allowedMethods()])
// );
// app.use(
//   KoaCompose([CVExperienceRouter.routes(), CVExperienceRouter.allowedMethods()])
// );
// app.use(
//   KoaCompose([CVEducationRouter.routes(), CVEducationRouter.allowedMethods()])
// );
// app.use(KoaCompose([CVSkillRouter.routes(), CVSkillRouter.allowedMethods()]));
// app.use(
//   KoaCompose([
//     CVLicenseCertificateRouter.routes(),
//     CVLicenseCertificateRouter.allowedMethods(),
//   ])
// );
// app.use(
//   KoaCompose([CVPortfolioRouter.routes(), CVPortfolioRouter.allowedMethods()])
// );
// app.use(
//   KoaCompose([CVPreviewRouter.routes(), CVPreviewRouter.allowedMethods()])
// );
// app.use(
//   KoaCompose([CVContactRouter.routes(), CVContactRouter.allowedMethods()])
// );

// /// V1
// app.use(KoaCompose([V1UserRouter.routes(), V1UserRouter.allowedMethods()]));
// app.use(
//   KoaCompose([
//     V1TemplatePdfRouter.routes(),
//     V1TemplatePdfRouter.allowedMethods(),
//   ])
// );

const router = new Router({});
const prefixCV = "/cv";
const prefixSetting = "/setting";
const prefixV1 = "/v1";

router.get(`/setting/user`, SettingUserController.getUsers);
router.post(`/setting/user`, SettingUserController.createUsers);
router.put(`/setting/user/:id`, SettingUserController.updateUsers);
router.put(`/setting/user/:id`, SettingUserController.updateNameUsers);
router.del(`/setting/user/:id`, SettingUserController.deleteUsers);

router.get(`/setting/user_group`, SettingUserGroupController.getUserGroup);
router.post(`/setting/user_group`, SettingUserGroupController.createUserGroup);
router.put(
  `/setting/user_group/:id`,
  SettingUserGroupController.updateUserGroup
);
router.del(
  `/setting/user_group/:id`,
  SettingUserGroupController.deleteUserGroup
);

router.get(`/setting/modul`, SettingModulController.getModul);
router.post(`/setting/modul`, SettingModulController.createModul);
router.put(`/setting/modul/:id`, SettingModulController.updateModul);
router.del(`/setting/modul/:id`, SettingModulController.deleteModul);

router.get(`/setting/menu`, SettingMenuController.getMenu);
router.post(`/setting/menu`, SettingMenuController.createMenu);
router.put(`/setting/menu/:id`, SettingMenuController.updateMenu);
router.del(`/setting/menu/:id`, SettingMenuController.deleteMenu);

router.get(`/setting/access_modul`, SettingAccessModulController.get);
router.get(
  `/setting/access_modul/by_user_group/:app_group_user_id`,
  SettingAccessModulController.getByUserGroup
);
router.post(`/setting/access_modul`, SettingAccessModulController.create);

router.get(`/setting/access_menu`, SettingAccessMenuController.get);
router.get(
  `/setting/access_menu/by_user_group/:app_group_user_id`,
  SettingAccessMenuController.getByUserGroup
);
router.post(`/setting/access_menu`, SettingAccessMenuController.create);

router.get(`/setting/master_category`, SettingMasterCategoryController.get);
router.post(`/setting/master_category`, SettingMasterCategoryController.create);
router.put(
  `/setting/master_category/:id`,
  SettingMasterCategoryController.update
);
router.del(
  `/setting/master_category/:id`,
  SettingMasterCategoryController.delete
);

router.get(`/setting/master_data`, SettingMasterDataController.get);
router.post(`/setting/master_data`, SettingMasterDataController.create);
router.put(`/setting/master_data/:id`, SettingMasterDataController.update);
router.del(`/setting/master_data/:id`, SettingMasterDataController.delete);

router.get(`/setting/parameter`, SettingParameterController.get);
router.post(`/setting/parameter`, SettingParameterController.create);
router.put(`/setting/parameter/:id`, SettingParameterController.update);
router.del(`/setting/parameter/:id`, SettingParameterController.delete);

router.get(`/setting/documentation`, SettingDocumentationController.get);
router.post(`/setting/documentation`, SettingDocumentationController.create);
router.put(`/setting/documentation/:id`, SettingDocumentationController.update);
router.del(`/setting/documentation/:id`, SettingDocumentationController.delete);

export default router;
