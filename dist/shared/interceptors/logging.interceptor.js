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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = class LoggingInterceptor {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    logger = new common_1.Logger('API');
    intercept(context, next) {
        if (this.configService.get('NODE_ENV') === 'production') {
            return next.handle(); // Bỏ qua log trong production
        }
        const now = Date.now();
        const { method, url } = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.finalize)(() => {
            const { method, url } = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const user = context.switchToHttp().getRequest().user || 'Anonymous';
            this.logger.log(`${method} ${url} ${response.statusCode} ${Date.now() - now}ms [User: ${user?.userId || user}]`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map