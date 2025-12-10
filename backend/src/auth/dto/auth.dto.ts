export class AuthPayloadDto {
  email!: string;
  password!: string;
}

export class ValidateUserResponseDto {
  id!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export class LoginResponseDto {
  accessToken: string;
}
