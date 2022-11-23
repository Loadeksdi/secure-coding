export class ValidationError extends Error {

    target: object;
    property: string;

    constructor(target: object, property: string) {
        super(`The ${property} is required`);
        this.target = target;
        this.property = property;
    }
}