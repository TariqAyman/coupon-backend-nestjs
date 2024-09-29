export const jwtConstants = {
  secret: `${process.env.JWT_SECRET}`,
  expiresIn: '1d',
  refreshExpiresIn: '7d',
};
