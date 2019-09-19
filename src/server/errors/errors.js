export class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.statusCode = 404;
  }
}
