export class ValidateJwtStrategyPayloadDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  iat: number;
  exp: number;
}

export class ValidateJwtStrategyResponseDto {
  id!: string;
  email!: string;
  role!: string;
}
