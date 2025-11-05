import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { PersonaInsertDto } from "./dtos/persona-insert.dto";
import { PersonaUpdateDto } from "./dtos/persona-update.dto";
import { PersonasService } from "./personas.service";

@Controller("personas")
export class PersonasController {
    // para hacer la inyeccion de dependencias, en el constructor
    // agrego el servicio a utilizar
    constructor(private personaService: PersonasService) {}

    @Get("/")
    findAll() {
        return this.personaService.getAll();
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.personaService.findOne(id);
    }

    @Post("/")
    create(@Body() createPersonaDto: PersonaInsertDto) {
        return this.personaService.create(createPersonaDto);
    }

    @Put(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() updatePersonaDto: PersonaUpdateDto) {
        return this.personaService.update(id, updatePersonaDto);
    }

    @Patch(":id")
    partialUpdate(@Param("id", ParseIntPipe) id: number, @Body() updatePersonaDto: PersonaUpdateDto) {
        return this.personaService.update(id, updatePersonaDto);
    }

    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.personaService.delete(id);
    }
}
