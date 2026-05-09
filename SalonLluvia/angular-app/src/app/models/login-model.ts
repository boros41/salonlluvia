export default interface LoginModel {
    username: string;
    password: string;
    rememberMe: boolean;
    returnUrl?: string;
}