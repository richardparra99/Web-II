import { Test, TestingModule } from "@nestjs/testing";
import { RegistrationsService } from "./registrations.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RegistrationEntity } from "./entities/registration.entity";
import { EventEntity } from "../events/entities/event.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";

describe("RegistrationsService", () => {
    let service: RegistrationsService;

    const mockRepository = () => ({
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegistrationsService,
                {
                    provide: getRepositoryToken(RegistrationEntity),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(EventEntity),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(PaymentEntity),
                    useValue: mockRepository(),
                },
            ],
        }).compile();

        service = module.get<RegistrationsService>(RegistrationsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
