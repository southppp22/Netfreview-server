import { S3 } from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  async uploadImage(image) {
    if (!image) {
      throw new BadRequestException('이미지가 존재하지 않습니다.');
    }
    const { originalname } = image;
    const bucketS3 = process.env.AWS_S3_BUCKET_NAME;
    return await this.uploadS3(image.buffer, bucketS3, originalname);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `image/${name}`,
      Body: file,
    };

    try {
      const stored = await s3.upload(params).promise();
      return stored.Location;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
