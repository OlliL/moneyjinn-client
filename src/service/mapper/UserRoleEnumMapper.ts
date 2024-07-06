import { UserTransportRoleEnum } from "@/api";
import { UserRole } from "@/model/user/UserRole";

export function mapUserTransportRoleEnumToEnum(
  source?: UserTransportRoleEnum,
): UserRole {
  switch (source) {
    case UserTransportRoleEnum.Admin: {
      return UserRole.ADMIN;
    }
    case UserTransportRoleEnum.Import: {
      return UserRole.IMPORT;
    }
    case UserTransportRoleEnum.Standard: {
      return UserRole.STANDARD;
    }
    default: {
      return UserRole.INACTIVE;
    }
  }
}

export function mapUserRoleEnumToTransport(
  source?: UserRole,
): UserTransportRoleEnum {
  switch (source) {
    case UserRole.ADMIN: {
      return UserTransportRoleEnum.Admin;
    }
    case UserRole.IMPORT: {
      return UserTransportRoleEnum.Import;
    }
    case UserRole.STANDARD: {
      return UserTransportRoleEnum.Standard;
    }
    default: {
      return UserTransportRoleEnum.Inactive;
    }
  }
}
