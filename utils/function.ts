export const mbTObytes = (mb: number) => {
  const multiplication = 1048576;
  return mb * multiplication;
};

export const validationImage = (mimetype: string) => {
  const allowedMimetype = ["image/gif", "image/jpeg", "image/jpg", "image/png"];
};
