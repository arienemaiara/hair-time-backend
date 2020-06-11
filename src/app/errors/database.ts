class DatabaseError extends Error {
    description: string;
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
        this.description = message;
        this.message = message;
    }
}

export class DataNotFoundError extends DatabaseError {
    constructor(resource: string) {
        super(`${resource} does not exist.`);
    }
}

export class DataAlreadyExistsError extends DatabaseError {
    constructor(resource: string) {
        super(`${resource} already exists.`);
    }
}