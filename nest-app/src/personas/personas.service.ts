import { Injectable, NotFoundException } from "@nestjs/common";
import { Persona } from "./models/persona.model";
import { PersonaInsertDto } from "./dtos/persona-insert.dto";
import { PersonaUpdateDto } from "./dtos/persona-update.dto";

@Injectable()
export class PersonasService {
    private readonly personas: Persona[] = [];

    create(persona: PersonaInsertDto): Persona {
        const nuevaPersona: Persona = {
            id: this.personas.length + 1,
            ...persona,
        };

        this.personas.push(nuevaPersona);
        return nuevaPersona;
    }

    getAll(): Persona[] {
        return this.personas;
    }

    findOne(id: number): Persona {
        const persona = this.personas.find(p => p.id === id);
        if (!persona) throw new NotFoundException(`Persona con id ${id} no encontrada`);
        return persona;
    }

    update(id: number, updateDto: PersonaUpdateDto): Persona {
        const persona = this.findOne(id);
        Object.assign(persona, updateDto);
        return persona;
    }

    delete(id: number): Persona {
        const persona = this.findOne(id);
        const index = this.personas.findIndex(p => p.id === id);
        if (index !== -1) {
            this.personas.splice(index, 1); // elimina 1 elemento sin reasignar
        }
        return persona;
    }
}
