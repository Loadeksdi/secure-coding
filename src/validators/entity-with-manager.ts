import { validate } from "class-validator";
import { EntityManager, InsertEvent } from "typeorm";

export interface EntityWithManager {
    id: string;
    manager: EntityManager;
}

export async function validateWithManager(event: Event, manager: EntityManager) {
    try {
        await validate(event.target);
    }
    finally {
        delete entity.manager;
    }
}