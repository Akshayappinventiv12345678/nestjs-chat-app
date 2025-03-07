// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// export const DatabaseConfig = MongooseModule.forRootAsync({
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => ({
//     uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/nestjs-chat',
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }),
// });
