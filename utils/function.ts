import { ParameterizedContext } from "koa";
import { ERROR_TYPE_VALIDATION } from "./constant";
import Validator from "fastest-validator";

export const mbTObytes = (mb: number) => {
  const multiplication = 1048576;
  return mb * multiplication;
};

export const validationImage = (mimetype: string) => {
  const allowedMimetype = ["image/gif", "image/jpeg", "image/jpg", "image/png"];
};
