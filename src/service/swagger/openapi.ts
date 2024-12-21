import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const swaggerNotFound = (message) => {
  return ApiNotFoundResponse({
    schema: {
      example: {
        example: {
          message: message,
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  });
};

export const swaggerForbidden = () => {
  return ApiForbiddenResponse({
    description: 'you have to be verified',
    schema: {
      example: {
        message: 'you are not verified !',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  });
};

export const swaggerUnAuthorized = () => {
  return ApiUnauthorizedResponse({
    description: 'you have to log in to access this endpoint',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  });
};

export const swaggerOk = (message, data) => {
  return ApiOkResponse({
    description: 'ok response',
    schema: {
      example: {
        message,
        data,
      },
    },
  });
};
