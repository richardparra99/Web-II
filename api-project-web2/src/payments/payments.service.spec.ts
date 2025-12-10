import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "./payments.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { RegistrationEntity } from "../registrations/entities/registration.entity";
import { Repository } from "typeorm";

describe("PaymentsService", () => {
    let service: PaymentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                // mock del repositorio de pagos
                {
                    provide: getRepositoryToken(PaymentEntity),
                    useValue: {} as Partial<Repository<PaymentEntity>>,
                },
                // mock del repositorio de inscripciones
                {
                    provide: getRepositoryToken(RegistrationEntity),
                    useValue: {} as Partial<Repository<RegistrationEntity>>,
                },
            ],
        }).compile();

        service = module.get<PaymentsService>(PaymentsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
