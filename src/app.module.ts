import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentModule } from './tournament/tournament.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import typeorm from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TeamModule } from './team/team.module';
import { MatchModule } from './match/match.module';
import { FixtureModule } from './fixture/fixture.module';
import { FileModule } from './file/file.module';
import { PlayerStadisticsModule } from './player-stadistics/player-stadistics.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { GlobalChatModule } from './global-chat/global-chat.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './filters/globalException.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.development',
      load:[typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global:true,
      signOptions: {expiresIn: '2h'},
      secret: process.env.JWT_SECRET
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    TeamModule,
    MatchModule,
    TournamentModule,
    FixtureModule,
    FileModule,
    PlayerStadisticsModule,
    MercadoPagoModule,
    GlobalChatModule,

  ],
  controllers: [],
  providers: [{provide: APP_FILTER, useClass: AllExceptionFilter}],
})
export class AppModule {}
