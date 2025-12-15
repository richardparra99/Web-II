import { Test, TestingModule } from "@nestjs/testing";
import { EventsService } from "./events.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEntity } from "./entities/event.entity";
import { RegistrationEntity } from "../registrations/entities/registration.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";

describe("EventsService", () => {
    let service: EventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                // Mock repositorios usados en el constructor del servicio
                {
                    provide: getRepositoryToken(EventEntity),
                    useValue: {} as Partial<Repository<EventEntity>>,
                },
                {
                    provide: getRepositoryToken(RegistrationEntity),
                    useValue: {} as Partial<Repository<RegistrationEntity>>,
                },
                {
                    provide: getRepositoryToken(PaymentEntity),
                    useValue: {} as Partial<Repository<PaymentEntity>>,
                },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
