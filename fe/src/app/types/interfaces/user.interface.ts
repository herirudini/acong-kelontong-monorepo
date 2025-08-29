export interface IUser {
    id: string;
    email: string;
    name: string;
    is_email_verified: boolean;
    modules?: { module_code: string }[];
    // add more user properties here...
}