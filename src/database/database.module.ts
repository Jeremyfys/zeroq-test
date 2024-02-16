import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { connection, username, password, host, port, name, authSource } =
          configService.mongo;
        return {
          uri: `${connection}://${host}:${port}`,
          user: username,
          pass: password,
          dbName: name,
          authSource: authSource,
          readPreference: 'primary',
          directConnection: true,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'RedisClient',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const redisInstance = new Redis({
          host: configService.redis.host,
          port: configService.redis.port,
        });

        redisInstance.on('error', (e) => {
          throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
      },
      inject: [config.KEY],
    },
  ],
  exports: [MongooseModule, 'RedisClient'],
})
export class DatabaseModule {}
