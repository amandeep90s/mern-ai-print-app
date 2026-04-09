import { StatusCodes } from 'http-status-codes';

export const ErrorCodes = {
  ERROR_INTERNAL_SERVER: 'ERROR_INTERNAL_SERVER',
  ERROR_NOT_FOUND: 'ERROR_NOT_FOUND',
  ERROR_UNAUTHORIZED: 'ERROR_UNAUTHORIZED',
  ERROR_FORBIDDEN: 'ERROR_FORBIDDEN',
  ERROR_BAD_REQUEST: 'ERROR_BAD_REQUEST',
  ERROR_CONFLICT: 'ERROR_CONFLICT',
  ERROR_UNPROCESSABLE_ENTITY: 'ERROR_UNPROCESSABLE_ENTITY',
  ERROR_TOO_MANY_REQUESTS: 'ERROR_TOO_MANY_REQUESTS',
  ERROR_SERVICE_UNAVAILABLE: 'ERROR_SERVICE_UNAVAILABLE',
  ERROR_GATEWAY_TIMEOUT: 'ERROR_GATEWAY_TIMEOUT',
  ERROR_NETWORK: 'ERROR_NETWORK',
  ERROR_TIMEOUT: 'ERROR_TIMEOUT',
  ERROR_UNKNOWN: 'ERROR_UNKNOWN',
} as const;

export type ErrorCodeType = keyof typeof ErrorCodes;

/**
 * Base application error class extending native Error
 * All custom exceptions should extend this class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    public errorCode: ErrorCodeType = ErrorCodes.ERROR_INTERNAL_SERVER,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Represents a 500 Internal Server Error
 * Used when an unexpected error occurs on the server
 */
export class InternalServerException extends AppError {
  constructor(message = 'Internal Server Error') {
    super(
      message,
      StatusCodes.INTERNAL_SERVER_ERROR,
      ErrorCodes.ERROR_INTERNAL_SERVER,
    );
  }
}

/**
 * Represents a 404 Not Found Error
 * Used when a requested resource cannot be found
 */
export class NotFoundException extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, StatusCodes.NOT_FOUND, ErrorCodes.ERROR_NOT_FOUND);
  }
}

/**
 * Represents a 400 Bad Request Error
 * Used when the request format or parameters are invalid
 */
export class BadRequestException extends AppError {
  constructor(message = 'Bad Request') {
    super(message, StatusCodes.BAD_REQUEST, ErrorCodes.ERROR_BAD_REQUEST);
  }
}

/**
 * Represents a 401 Unauthorized Error
 * Used when authentication fails or credentials are invalid
 */
export class UnauthorizedException extends AppError {
  constructor(message = 'Unauthorized Access') {
    super(message, StatusCodes.UNAUTHORIZED, ErrorCodes.ERROR_UNAUTHORIZED);
  }
}

/**
 * Represents a 403 Forbidden Error
 * Used when the user is authenticated but lacks permission for the resource
 */
export class ForbiddenException extends AppError {
  constructor(message = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN, ErrorCodes.ERROR_FORBIDDEN);
  }
}

/**
 * Represents a 409 Conflict Error
 * Used when a request conflicts with existing data (e.g., duplicate email)
 */
export class ConflictException extends AppError {
  constructor(message = 'Conflict') {
    super(message, StatusCodes.CONFLICT, ErrorCodes.ERROR_CONFLICT);
  }
}

/**
 * Represents a 422 Unprocessable Entity Error
 * Used when the request format is correct but semantic validation fails
 */
export class UnprocessableEntityException extends AppError {
  constructor(message = 'Unprocessable Entity') {
    super(
      message,
      StatusCodes.UNPROCESSABLE_ENTITY,
      ErrorCodes.ERROR_UNPROCESSABLE_ENTITY,
    );
  }
}

/**
 * Represents a 429 Too Many Requests Error
 * Used when rate limiting is triggered
 */
export class TooManyRequestsException extends AppError {
  constructor(message = 'Too Many Requests') {
    super(
      message,
      StatusCodes.TOO_MANY_REQUESTS,
      ErrorCodes.ERROR_TOO_MANY_REQUESTS,
    );
  }
}

/**
 * Represents a 503 Service Unavailable Error
 * Used when the server or required services are temporarily unavailable
 */
export class ServiceUnavailableException extends AppError {
  constructor(message = 'Service Unavailable') {
    super(
      message,
      StatusCodes.SERVICE_UNAVAILABLE,
      ErrorCodes.ERROR_SERVICE_UNAVAILABLE,
    );
  }
}

/**
 * Represents a 504 Gateway Timeout Error
 * Used when the server did not receive a timely response from upstream
 */
export class GatewayTimeoutException extends AppError {
  constructor(message = 'Gateway Timeout') {
    super(
      message,
      StatusCodes.GATEWAY_TIMEOUT,
      ErrorCodes.ERROR_GATEWAY_TIMEOUT,
    );
  }
}

/**
 * Represents a network error
 * Used for network connectivity issues
 */
export class NetworkException extends AppError {
  constructor(message = 'Network Error') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, ErrorCodes.ERROR_NETWORK);
  }
}

/**
 * Represents a timeout error related to network operations
 * Used for network-specific timeout issues
 */
export class TimeoutException extends AppError {
  constructor(message = 'Request Timeout') {
    super(message, StatusCodes.REQUEST_TIMEOUT, ErrorCodes.ERROR_TIMEOUT);
  }
}

/**
 * Represents an unknown or unexpected error
 * Used as a fallback for unclassified errors
 */
export class UnknownException extends AppError {
  constructor(message = 'Unknown Error') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, ErrorCodes.ERROR_UNKNOWN);
  }
}
