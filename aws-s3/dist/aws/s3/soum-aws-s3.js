"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoumAwsS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
class SoumAwsS3 {
    static createPresignedUrl(bucket, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = bucket.webIdentityTokenFile
                    ? undefined
                    : {
                        accessKeyId: bucket.accessKey,
                        secretAccessKey: bucket.secretAccessKey,
                        sessionToken: bucket.sessionToken,
                    };
                const client = new client_s3_1.S3Client({
                    region: bucket.awsS3,
                    credentials: credentials,
                });
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: bucket.bucketName,
                    Key: fileName,
                });
                return (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 60 * 10 }); // 10 mins
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static getPresignedUrl(createPresignedUrlreqDto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const urls = [];
            let basePath = "";
            switch (createPresignedUrlreqDto.imageModule) {
                case ImageModuleEnum.IMAGE_SEC_ICON:
                    basePath = "image-sections-icons";
                    break;
                case ImageModuleEnum.PRODUCT_IMAGE:
                    basePath = `assets/${createPresignedUrlreqDto.user.id}/listings/${createPresignedUrlreqDto.product.id}`;
                    break;
                case ImageModuleEnum.USER_PROFILE:
                    basePath = `assets/${createPresignedUrlreqDto.user.id}/profile`;
                    break;
                case ImageModuleEnum.CONDITION_ICON:
                    basePath = `assets/conditions`;
                    break;
                case ImageModuleEnum.CATEGORY_ICON:
                    basePath = `assets/category`;
                    break;
                case ImageModuleEnum.STORIES_SECTION:
                    basePath = `assets/stories-section`;
                    break;
                case ImageModuleEnum.PRODUCT_INSPECTION:
                    basePath = `assets/${createPresignedUrlreqDto.user.id}/listings/${createPresignedUrlreqDto.product.id}/inspection`;
                    break;
            }
            for (let index = 0; index < ((_a = createPresignedUrlreqDto === null || createPresignedUrlreqDto === void 0 ? void 0 : createPresignedUrlreqDto.fileReqSummary) === null || _a === void 0 ? void 0 : _a.count) || 0; index++) {
                const path = `${basePath}/${(0, uuid_1.v4)()}.${(_b = createPresignedUrlreqDto === null || createPresignedUrlreqDto === void 0 ? void 0 : createPresignedUrlreqDto.fileReqSummary) === null || _b === void 0 ? void 0 : _b.fileExtension}`;
                const url = yield this.createPresignedUrl(createPresignedUrlreqDto.bucket, path);
                if (url)
                    urls.push({
                        url,
                        path: path,
                        cdn: createPresignedUrlreqDto.bucket.bucketEndpointCDN,
                    });
            }
            return urls;
        });
    }
}
exports.SoumAwsS3 = SoumAwsS3;
var ImageModuleEnum;
(function (ImageModuleEnum) {
    ImageModuleEnum["IMAGE_SEC_ICON"] = "imageSecIcon";
    ImageModuleEnum["CONDITION_ICON"] = "conditionIcon";
    ImageModuleEnum["CATEGORY_ICON"] = "categoryIcon";
    ImageModuleEnum["PRODUCT_IMAGE"] = "productImage";
    ImageModuleEnum["USER_PROFILE"] = "userProfile";
    ImageModuleEnum["STORIES_SECTION"] = "storiesSection";
    ImageModuleEnum["PRODUCT_INSPECTION"] = "productInspection";
})(ImageModuleEnum || (ImageModuleEnum = {}));
