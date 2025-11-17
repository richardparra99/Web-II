import { Test, TestingModule } from "@nestjs/testing";
import { PeliculasService } from "./peliculas.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pelicula } from "./entities/pelicula.entity";

describe("PeliculasService", () => {
    let service: PeliculasService;

    const repoMock: Partial<Record<keyof Repository<Pelicula>, any>> = {
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn().mockImplementation(async e => ({ id: 1, ...e })),
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(null),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PeliculasService,
                { provide: getRepositoryToken(Pelicula), useValue: repoMock }, // 👈 mock repo
            ],
        }).compile();

        service = module.get<PeliculasService>(PeliculasService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
