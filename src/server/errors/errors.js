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

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.statusCode = 404;
  }
}

export class ResourceAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceAlreadyExistsError';
    this.statusCode = 409;
  }
}
