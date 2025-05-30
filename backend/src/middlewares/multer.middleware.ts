import multer from "multer";

export const upload = multer({
  dest: "./public/temp",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
