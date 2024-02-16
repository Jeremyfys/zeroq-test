import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    appPort: process.env.APP_PORT,
    nodeEnv: process.env.NODE_ENV,
    jwt: {
      secret: process.env.JWT_SECRET,
      expirationTime: process.env.JWT_EXPIRATION_TIME
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      expirationTime: process.env.REDIS_EXPIRATION_TIME
    },
    mongo: {
      name: process.env.MONGO_DB,
      username: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      port: parseInt(process.env.MONGO_PORT, 10),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
      authSource: process.env.MONGO_AUTHSOURCE,
    },
  };
});
