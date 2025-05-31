import multer from "multer";
import path from "path";

export const upload = multer({
  dest: path.join(process.cwd(), "src/public/temp"),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
