import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // quita campos extra que no estén en el DTO
            forbidNonWhitelisted: true, // lanza error si mandan campos que sobran
            transform: true, // convierte tipos (string -> number, etc)
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.enableCors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization",
    });

    app.useStaticAssets(join(__dirname, "..", "uploads"), {
        prefix: "/uploads/",
    });

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
