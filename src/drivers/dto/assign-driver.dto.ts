// src/drivers/dto/assign-driver.dto.ts
import { IsUUID } from 'class-validator';

export class AssignDriverDto {
  @IsUUID()
  driverId: string;

  @IsUUID()
  tripId: string;
}
