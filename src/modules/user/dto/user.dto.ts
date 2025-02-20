import { Exclude, Expose } from "class-transformer";
import { UserRole } from "src/entities/user.entity";

@Exclude()
export class UserDto{
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    role: UserRole;
}