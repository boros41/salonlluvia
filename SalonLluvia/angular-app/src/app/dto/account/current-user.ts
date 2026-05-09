export default interface CurrentUser {
    username?: string,
    email?: string,
    roles: Array<string>,
    isAdmin: boolean,
    isLoggedIn: boolean
}