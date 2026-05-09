type Role = "admin" | null;

export default interface User {
    username: string;
    roles: Set<Role>;
}