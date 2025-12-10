import { Test, TestingModule } from "@nestjs/testing";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

describe("EventsController", () => {
    let controller: EventsController;

    // Mock muy simple: solo necesitamos que exista el servicio,
    // no que haga nada real.
    const eventsServiceMock = {
        findPublic: jest.fn(),
        findOnePublic: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        // Si en algún momento testeas uploadPoster o algo más,
        // lo agregas aquí.
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [
                {
                    provide: EventsService,
                    useValue: eventsServiceMock,
                },
            ],
        }).compile();

        controller = module.get<EventsController>(EventsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
