export interface UserValidationSchema {
    name: string;
    email: string;
    password: string;
}

export interface UserUpdateValidationSchema extends UserValidationSchema{
    oldPassword: string;
    confirmPassword: string;
}