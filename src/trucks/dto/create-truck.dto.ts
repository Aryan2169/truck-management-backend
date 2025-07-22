import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  numberPlate: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsEnum(['available', 'in_use', 'maintenance'])
  status?: 'available' | 'in_use' | 'maintenance';

  @IsOptional()
  @IsDateString()
  lastServicedAt?: string;
}
