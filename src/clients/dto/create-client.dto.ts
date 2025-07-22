// src/clients/dto/create-client.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email?: string;


  @IsString()
  phone?: string;

  @IsString()
  address?: string;
}
