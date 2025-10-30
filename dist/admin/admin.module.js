"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
// Để sử dụng guards
const prisma_module_1 = require("../sys/prisma/prisma.module");
const guard_module_1 = require("../shared/guards/guard.module");
const user_module_1 = require("./users/user.module");
const movie_module_1 = require("./movies/movie.module");
const booking_module_1 = require("./bookings/booking.module");
const token_module_1 = require("../sys/token/token.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            token_module_1.TokenModule,
            guard_module_1.GuardModule,
            user_module_1.UsersModule,
            movie_module_1.MoviesModule,
            booking_module_1.BookingsModule,
        ],
        controllers: [],
        providers: [],
        exports: [],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map