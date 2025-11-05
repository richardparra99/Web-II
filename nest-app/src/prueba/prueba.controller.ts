import { Controller, Get } from "@nestjs/common";

@Controller("prueba")
export class PruebaController {
    @Get("hola")
    obtenerSaludo() {
        return "esto es un mensaje desde co prueba";
    }
}
