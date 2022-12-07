import { validate } from "class-validator";
import { EntityManager, InsertEvent } from "typeorm";

export interface EntityWithManager {
    id: String;
    manager: EntityManager;
}

export function validateWithManager(event: Event, manager: EntityManager) {
    try {
        validate(entity);
    }
    finally {
        delete entity.manager;
    }
}