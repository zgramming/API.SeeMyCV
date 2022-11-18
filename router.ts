import passport from "koa-passport";
import Router from "koa-router";

import { isLoggedIn } from "./routes/auth/google_auth";
import { CVContactController } from "./routes/cv/contact";
import { CVEducationController } from "./routes/cv/education";
import { CVExperienceController } from "./routes/cv/experience";
import { CVLicenseCertificateController } from "./routes/cv/license_certificate";
import { CVPortfolioController } from "./routes/cv/portfolio";
import { CVPreviewController } from "./routes/cv/preview";
import { CVProfileController } from "./routes/cv/profile";
import { CVSkillController } from "./routes/cv/skill";
import { SettingAccessMenuController } from "./routes/setting/access_menu";
import { SettingAccessModulController } from "./routes/setting/access_modul";
import { SettingDocumentationController } from "./routes/setting/documentation";
import { LoginController } from "./routes/setting/login";
import { SettingMasterCategoryController } from "./routes/setting/master_category";
import { SettingMasterDataController } from "./routes/setting/master_data";
import { SettingMenuController } from "./routes/setting/menu";
import { SettingModulController } from "./routes/setting/modul";
import { SettingParameterController } from "./routes/setting/parameter";
import { SettingUserController } from "./routes/setting/user";
import { SettingUserGroupController } from "./routes/setting/user_group";
import { V1PortfolioController } from "./routes/v1/portfolio";
import { V1UserController } from "./routes/v1/user";
import { keyLocalStorageLogin } from "./utils/constant";

const router = new Router();

//! Authentication
router.post(`/login`, LoginController.login);

//! Setting Section

router.get(`/setting/user`, SettingUserController.getUsers);
router.post(`/setting/user`, SettingUserController.createUsers);
router.put(`/setting/user/:id`, SettingUserController.updateUsers);
router.put(
  `/setting/user/update_name/:id`,
  SettingUserController.updateNameUsers
);
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

//! CV Section
router.get(`/cv/profile/user_id/:users_id`, CVProfileController.get);
router.post(`/cv/profile`, CVProfileController.upsert);

router.get(`/cv/experience/user_id/:users_id`, CVExperienceController.get);
router.post(`/cv/experience`, CVExperienceController.upsert);
router.del(`/cv/experience/:id`, CVExperienceController.delete);

router.get(`/cv/education/user_id/:users_id`, CVEducationController.get);
router.post(`/cv/education`, CVEducationController.upsert);
router.del(`/cv/education/:id`, CVEducationController.delete);

router.get(`/cv/skill/user_id/:users_id`, CVSkillController.get);
router.post(`/cv/skill`, CVSkillController.upsert);
router.del(`/cv/skill/:id`, CVSkillController.delete);

router.get(
  `/cv/license_certificate/user_id/:users_id`,
  CVLicenseCertificateController.get
);
router.post(`/cv/license_certificate`, CVLicenseCertificateController.upsert);
router.del(
  `/cv/license_certificate/:id`,
  CVLicenseCertificateController.delete
);

router.get(`/cv/portfolio/:id`, CVPortfolioController.getById);
router.get(`/cv/portfolio/user_id/:users_id`, CVPortfolioController.get);
router.post(`/cv/portfolio`, CVPortfolioController.upsert);
router.del(`/cv/portfolio/:id`, CVPortfolioController.delete);

router.get(
  `/cv/preview/pdf/user_id/:user_id`,
  CVPreviewController.getPreviewPDF
);
router.get(
  `/cv/preview/pdf/user_id/:user_id/detail`,
  CVPreviewController.getDetailPreviewPDF
);
router.get(
  `/cv/preview/website/user_id/:user_id`,
  CVPreviewController.getPreviewWebsite
);
router.post("/cv/preview/website", CVPreviewController.saveWebsite);
router.post("/cv/preview/pdf", CVPreviewController.savePDF);
router.post(
  `/cv/preview/generate_pdf/user_id/:user_id`,
  CVPreviewController.generatePDF
);

router.get(`/cv/contact/user_id/:users_id`, CVContactController.get);

//! V1 Section
router.get(`/v1/user/:username`, V1UserController.getByUsername);
router.get(
  `/v1/portfolio/username/:username/slug/:slug`,
  V1PortfolioController.getByUsernameAndSlug
);
router.post(`/v1/user/signup`, V1UserController.signup);

//! Experimental

router.get(
  "/v1/google/signin",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/v1/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
  })
);

router.get("/auth/success", async (ctx, next) => {
  ctx.cookies.set(keyLocalStorageLogin, JSON.stringify(ctx.state.user), {
    httpOnly: false,
    secureProxy: true,
    sameSite: "none",
    secure: process.env.APP_ENV === "dev" ? false : true,
  });

  return ctx.redirect(`${process.env.WEB_BASEURL}`);
});

router.get("/auth/failure", async (ctx, next) => {
  const url = `${process.env.WEB_BASEURL}/login?error=${true}`;
  return ctx.redirect(url);
});

router.post("/v1/logout", isLoggedIn, async (ctx, next) => {
  // ctx.logOut();
  return (ctx.body = {
    success: true,
    message: "Berhasil logout dari aplikasi",
  });
});

export default router;
