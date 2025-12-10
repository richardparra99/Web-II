import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { RegistrationEntity } from "../registrations/entities/registration.entity";
import { Repository } from "typeorm";

describe("PaymentsController", () => {
    let controller: PaymentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [
                PaymentsService,
                // mock del repo de pagos
                {
                    provide: getRepositoryToken(PaymentEntity),
                    useValue: {} as Partial<Repository<PaymentEntity>>,
                },
                // mock del repo de inscripciones
                {
                    provide: getRepositoryToken(RegistrationEntity),
                    useValue: {} as Partial<Repository<RegistrationEntity>>,
                },
            ],
        }).compile();

        controller = module.get<PaymentsController>(PaymentsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
