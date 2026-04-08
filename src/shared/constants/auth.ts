export class AuthConstants {
  static readonly tokenName =
    process.env.NODE_ENV !== 'production'
      ? `${process.env.NODE_ENV}AuthToken`
      : `authToken`;

  static readonly tokenHeader = 'Authorization';
}
