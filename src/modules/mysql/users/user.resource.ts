import { User } from './entities/user.entity';

export class UserResource {
  id: number;
  name: string;
  email: string;
  image?: string;
  role: string;
  roles: any[];
  isActive: boolean;
  defaultAddress: any | null;
  Addresses: any[];
  createdAt: string;
  updatedAt: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.image = user.image ?? '';
    this.role = user.role;

    // Clean roles response
    this.roles = user.roles?.map((role) => ({
      id: role.id,
      name: role.name,
    })) ?? [];

    this.isActive = user.is_active;
    this.defaultAddress = user.defaultAddress ?? null;
    this.Addresses = user.addresses;

    this.createdAt = user.created_at?.toISOString();
    this.updatedAt = user.updated_at?.toISOString();
  }

  /* =========================
     Single Resource
  ========================== */
  static make(user: User) {
    return new UserResource(user);
  }

  /* =========================
     Collection Resource
  ========================== */
  static collection(users: User[]) {
    return users.map((user) => new UserResource(user));
  }

  /* =========================
     Paginated Resource
  ========================== */
  static paginate(result: {
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) {
    return {
      data: UserResource.collection(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
