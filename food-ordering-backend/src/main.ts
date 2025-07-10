import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  // app.use((req, res, next) => {
  //   const origin = req.headers.origin;
  //   const allowedOrigins = [
  //     'https://appfood-front-hkhpfhebhqa6b3f3.southeastasia-01.azurewebsites.net',
  //     'https://www.apfood.systems'
  //   ];
  
  //   if (allowedOrigins.includes(origin)) {
  //     res.header('Access-Control-Allow-Origin', origin);
  //     res.header('Access-Control-Allow-Credentials', 'true');
  //     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   }
  
  //   if (req.method === 'OPTIONS') {
  //     res.sendStatus(204);
  //   } else {
  //     next();
  //   }
  // });
  
  // app.enableCors({
  //   origin: ['https://www.apfood.systems', 'https://appfood-front-hkhpfhebhqa6b3f3.southeastasia-01.azurewebsites.net'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   exposedHeaders: ['Set-Cookie'],
  //   preflightContinue: false,
  //   credentials: true,
  // });

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000'
    ];

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  });  

  app.enableCors({
    origin: ['http://localhost:3001','http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    credentials: true,
  });  
   
  app.useWebSocketAdapter(new IoAdapter(app));

  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
