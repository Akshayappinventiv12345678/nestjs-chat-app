import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

// import { AuthModule } from './auth/auth.module';
// import { ChatModule } from './chat/chat.module';
// import { DatabaseSyncModule } from './database-sync/database-sync.module';
import { UsersModule } from './user/user.module';
import { EventsGateway } from './chat/chat.gateway';

const url = `mongodb+srv://akshaymoryani:zW2THvTkUBHpdSSD@cluster0.rueam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

@Module({
  imports: [
    MongooseModule.forRoot(url),
    // AuthModule,
    // ChatModule,
    // DatabaseSyncModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
