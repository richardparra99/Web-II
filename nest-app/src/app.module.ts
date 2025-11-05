import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PruebaController } from "./prueba/prueba.controller";
import { FactorialController } from "./factorial/factorial.controller";
import { PersonasModule } from "./personas/personas.module";

@Module({
    imports: [PersonasModule],
    controllers: [AppController, PruebaController, FactorialController],
    providers: [AppService],
})
export class AppModule {}
