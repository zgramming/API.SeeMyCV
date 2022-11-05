"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationFile = exports.mbTObytes = void 0;
const fs_1 = require("fs");
const mbTObytes = (mb) => {
    const multiplication = 1048576;
    return mb * multiplication;
};
exports.mbTObytes = mbTObytes;
/// 1. image/jpeg (jpg)
/// 2. image/png (png)
/// 3. image/jpg (jpg)
/// 3. application/pdf (pdf)
/// 4. application/vnd.openxmlformats-officedocument.wordprocessingml.document (docx)
/// 5. application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (xlsx)
const validationFile = ({ file, allowedMimetype, limitSizeMB, onError, }) => {
    if (!(0, fs_1.existsSync)(file.filepath))
        return onError("File tidak valid");
    const mimetype = file.mimetype;
    const validMimetype = [];
    allowedMimetype.forEach((val) => {
        switch (val) {
            case "jpeg":
                validMimetype.push("image/jpeg");
                break;
            case "png":
                validMimetype.push("image/png");
                break;
            case "jpg":
                validMimetype.push("image/jpg");
                break;
            case "pdf":
                validMimetype.push("application/pdf");
                break;
            case "docx":
                validMimetype.push("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                break;
            case "xlsx":
                validMimetype.push("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                break;
            default:
                return;
        }
    });
    if (!validMimetype.includes(mimetype)) {
        return onError(`File harus berupa ${allowedMimetype.join(",")}`);
    }
    if (file.size > (0, exports.mbTObytes)(limitSizeMB)) {
        return onError(`File ${file.originalFilename} tidak boleh melebihi ${limitSizeMB}Mb`);
    }
    return true;
};
exports.validationFile = validationFile;
