import { Test, TestingModule } from "@nestjs/testing";
import { EventsService } from "./events.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEntity } from "./entities/event.entity";

describe("EventsService", () => {
    let service: EventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                // 🔹 Mock del repositorio que usa EventsService
                {
                    provide: getRepositoryToken(EventEntity),
                    useValue: {} as Partial<Repository<EventEntity>>,
                },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
