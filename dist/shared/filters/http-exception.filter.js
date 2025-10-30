"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const status_code_helper_1 = require("./status-code.helper");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : status_code_helper_1.statusCodes.INTERNAL_SERVER_ERROR;
        // Lấy message từ statusMessages, nếu không có thì dùng message mặc định
        const defaultMessage = status_code_helper_1.statusMessages[status] || 'Unknown Error';
        const exceptionResponse = exception.getResponse?.();
        // Xử lý đặc biệt cho validation errors (400)
        if (status === status_code_helper_1.statusCodes.BAD_REQUEST) {
            this.handleValidationError(response, status, exceptionResponse);
            return;
        }
        // Xử lý tất cả các case khác
        this.handleOtherErrors(response, status, defaultMessage, exception, exceptionResponse);
    }
    handleValidationError(response, status, exceptionResponse) {
        if (typeof exceptionResponse === 'object' &&
            Array.isArray(exceptionResponse['message'])) {
            // Trường hợp lỗi validation từ CustomValidationPipe
            response.status(status).json({
                statusCode: status,
                message: 'Dữ liệu đầu vào không hợp lệ',
                content: exceptionResponse['message'],
                dateTime: new Date().toISOString(),
                messageConstants: null,
            });
        }
        else {
            // Trường hợp lỗi 400 khác
            const content = this.extractContent(exceptionResponse);
            response.status(status).json({
                statusCode: status,
                message: status_code_helper_1.statusMessages[status],
                content: content,
                dateTime: new Date().toISOString(),
                messageConstants: null,
            });
        }
    }
    handleOtherErrors(response, status, defaultMessage, exception, exceptionResponse) {
        const content = this.extractContent(exceptionResponse) || exception.message;
        response.status(status).json({
            statusCode: status,
            message: defaultMessage,
            content: content,
            dateTime: new Date().toISOString(),
            messageConstants: null,
        });
    }
    extractContent(exceptionResponse) {
        if (!exceptionResponse)
            return '';
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }
        if (typeof exceptionResponse === 'object') {
            // NestJS thường trả về { message: string | string[], error: string }
            if (Array.isArray(exceptionResponse['message'])) {
                return exceptionResponse['message'];
            }
            return (exceptionResponse['message'] ||
                exceptionResponse['error'] ||
                JSON.stringify(exceptionResponse));
        }
        return String(exceptionResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map