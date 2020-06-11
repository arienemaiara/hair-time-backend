export class ValidationError extends Error {
    description: string;
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
        this.description = message;
        this.message = message;
    }
}