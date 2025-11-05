import { Controller, Get } from "@nestjs/common";

@Controller("factorial")
export class FactorialController {
    @Get("cinco")
    obtenerFactorialDeCinco() {
        const n = 5;
        let resultado = 1;

        for (let i = 1; i <= n; i++) {
            resultado *= i;
        }

        return { numero: n, factorial: resultado };
    }
}
