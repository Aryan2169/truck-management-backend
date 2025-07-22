import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ExpenseDto {
  @IsString()
  type: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateTripDto {
  @IsString()
  truckId: string;

  @IsString()
  clientId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  startLoc?: string;

  @IsOptional()
  @IsString()
  endLoc?: string;

  @IsOptional()
  @IsNumber()
  revenue?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one driver is required' })
  @ArrayMaxSize(2, { message: 'At most 2 drivers can be assigned to a trip' })
  driverIds: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExpenseDto)
  expenses?: ExpenseDto[];
}
