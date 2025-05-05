"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * Custom error class for application errors
 * Extends the native Error class with additional context
 */
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message, options) {
        var _this = _super.call(this, message, { cause: options === null || options === void 0 ? void 0 : options.cause }) || this;
        _this.name = 'AppError';
        _this.code = (options === null || options === void 0 ? void 0 : options.code) || 'UNKNOWN_ERROR';
        _this.context = options === null || options === void 0 ? void 0 : options.context;
        _this.originalError = options === null || options === void 0 ? void 0 : options.cause;
        // Ensures proper stack trace in Node.js
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, AppError);
        }
        return _this;
    }
    /**
     * Factory method to create an authentication error
     */
    AppError.auth = function (message, options) {
        if (message === void 0) { message = 'Authentication failed'; }
        return new AppError(message, __assign(__assign({}, options), { code: 'AUTH_ERROR' }));
    };
    /**
     * Factory method to create a validation error
     */
    AppError.validation = function (message, options) {
        if (message === void 0) { message = 'Validation failed'; }
        return new AppError(message, __assign(__assign({}, options), { code: 'VALIDATION_ERROR' }));
    };
    /**
     * Factory method to create a not found error
     */
    AppError.notFound = function (message, options) {
        if (message === void 0) { message = 'Resource not found'; }
        return new AppError(message, __assign(__assign({}, options), { code: 'NOT_FOUND' }));
    };
    /**
     * Factory method to create a server error
     */
    AppError.server = function (message, options) {
        if (message === void 0) { message = 'Internal server error'; }
        return new AppError(message, __assign(__assign({}, options), { code: 'SERVER_ERROR' }));
    };
    /**
     * Converts any error to an AppError for consistent handling
     */
    AppError.from = function (error, defaultMessage) {
        if (defaultMessage === void 0) { defaultMessage = 'An unexpected error occurred'; }
        if (error instanceof AppError)
            return error;
        var message = error instanceof Error ? error.message : defaultMessage;
        return new AppError(message, {
            cause: error,
            code: 'UNKNOWN_ERROR'
        });
    };
    return AppError;
}(Error));
exports.AppError = AppError;
