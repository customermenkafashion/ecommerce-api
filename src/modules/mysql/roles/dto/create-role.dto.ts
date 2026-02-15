export class CreateRoleDto {
    name: string; // role name, e.g., 'admin', 'seller', 'user'
    description?: string; // optional human-readable description
}