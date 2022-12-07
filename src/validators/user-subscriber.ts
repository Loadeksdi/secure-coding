import { validate } from "class-validator";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { User } from "../entities/user"

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User
    }

    beforeInsert(event: InsertEvent<User>): void | Promise<any> {
        return this.validate(event.entity);
    }

    beforeUpdate(event: UpdateEvent<User>): void | Promise<any> {
        return this.validate(event.entity as User);
    }

    private async validate(user: User) {
        const errors = await validate(user);
        if (errors.length > 0) {
            throw errors[0];
        }
    }

}