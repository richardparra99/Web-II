import { Test, TestingModule } from "@nestjs/testing";
import { PersonasController } from "./personas.controller";
import { PersonasService } from "./personas.service";

describe("PersonasController", () => {
    let controller: PersonasController;
    // eslint-disable-next-line
    let service: PersonasService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonasController],
            providers: [PersonasService], // <-- AÑADE ESTO
        }).compile();

        controller = module.get<PersonasController>(PersonasController);
        service = module.get<PersonasService>(PersonasService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should create a persona", () => {
        const persona = { nombre: "Luis", apellido: "Gómez", edad: 22 };
        const result = controller.create(persona);
        expect(result).toHaveProperty("id");
        expect(result.nombre).toBe("Luis");
    });
});
