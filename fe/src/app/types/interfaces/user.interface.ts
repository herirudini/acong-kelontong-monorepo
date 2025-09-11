export interface IUser {
    first_name: string;
    last_name: string;
    email?: string;
    verified?: boolean;
    modules: string[];
    role: string;
    [key: string]: any;
    // add more user properties here...
}