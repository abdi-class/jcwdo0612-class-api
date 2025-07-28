import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

cloudinary.config({
  api_key: "889819794298674",
  api_secret: "ffwV495p5fHDJ8Sbcjc1sQqqVzE",
  cloud_name: "djjiscqip",
});

export const cloudinaryUpload = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      (err, result: UploadApiResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
