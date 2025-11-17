import { Test, TestingModule } from "@nestjs/testing";
import { ReviewsService } from "./reviews.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { Pelicula } from "../peliculas/entities/pelicula.entity";

describe("ReviewsService", () => {
    let service: ReviewsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReviewsService, { provide: getRepositoryToken(Review), useValue: {} }, { provide: getRepositoryToken(Pelicula), useValue: {} }],
        }).compile();

        service = module.get<ReviewsService>(ReviewsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
