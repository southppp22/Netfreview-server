"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const token_service_1 = require("../auth/token.service");
const videos_service_1 = require("../videos/videos.service");
const postReviewDto_1 = require("./dto/postReviewDto");
const reviews_service_1 = require("./reviews.service");
let ReviewsController = class ReviewsController {
    constructor(reviewsService, videosService, tokenService) {
        this.reviewsService = reviewsService;
        this.videosService = videosService;
        this.tokenService = tokenService;
        this.reviewsService = reviewsService;
        this.videosService = videosService;
        this.tokenService = tokenService;
    }
    async likeThisReview(body, req) {
        const user = req.user;
        const review = await this.reviewsService.findReviewWithId(body.reviewId);
        if (!review) {
            throw new common_1.NotFoundException('존재하지 않는 리뷰입니다.');
        }
        return await this.reviewsService.addOrRemoveLike(user, review);
    }
    async findThisVidReview(videoId, page, req) {
        if (typeof Number(page) !== 'number' || page <= 0) {
            throw new common_1.NotFoundException('페이지를 입력받지 못했거나 숫자형태가 아니거나 0이하로 받았습니다.');
        }
        const refreshToken = req.cookies.refreshToken;
        const video = await this.videosService.findVidWithId(videoId);
        let myuser;
        if (!refreshToken) {
            myuser = 'guest';
        }
        else {
            const { user } = await this.tokenService.resolveRefreshToken(refreshToken);
            myuser = user;
        }
        const { videoList, userReview, } = await this.reviewsService.findThisVidAndUserReview(video, myuser);
        return Object.assign({
            totalCount: videoList.length,
            reviewList: videoList.slice(8 * (page - 1), 8 * page),
            myReview: userReview,
        });
    }
    async saveReview(body, request) {
        const user = request.user;
        if (!body.videoId || !body.text || !body.rating) {
            throw new common_1.BadRequestException('text 혹은 rating 혹은 videoId가 전달되지 않았습니다.');
        }
        const video = await this.videosService.findVidWithId(body.videoId);
        return await this.reviewsService.saveReview(user, video, body);
    }
    async deleteReview(body) {
        await this.reviewsService.deleteReview(body.reviewId);
    }
    async patchReview(body, req) {
        const user = req.user;
        const video = await this.videosService.findVidWithId(body.videoId);
        await this.reviewsService.patchReview(user, video, body);
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('like'),
    __param(0, common_1.Body()), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "likeThisReview", null);
__decorate([
    common_1.Get(':videoId'),
    __param(0, common_1.Param('videoId')),
    __param(1, common_1.Query('page')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "findThisVidReview", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    __param(0, common_1.Body()), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [postReviewDto_1.ReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "saveReview", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(),
    __param(0, common_1.Body()), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [postReviewDto_1.ReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "patchReview", null);
ReviewsController = __decorate([
    common_1.Controller('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService,
        videos_service_1.VideosService,
        token_service_1.TokenService])
], ReviewsController);
exports.ReviewsController = ReviewsController;
//# sourceMappingURL=reviews.controller.js.map