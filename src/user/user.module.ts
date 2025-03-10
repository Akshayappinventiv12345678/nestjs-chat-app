import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { User, UserSchema } from '../schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true, // makes the JwtModule available globally
      secret: process.env.JWT_SECRET || 'your-secret-key', // Replace with your secret key or environment variable
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
