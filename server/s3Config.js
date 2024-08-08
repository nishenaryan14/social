import { S3Client } from "@aws-sdk/client-s3";
import { S3 } from "@aws-sdk/lib-storage";
import multer from "multer";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
});

// Configure multer to use multer-s3 for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`); // Unique file name
    },
  }),
});

export { upload };
