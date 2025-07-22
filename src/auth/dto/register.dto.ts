import { IsEmail, IsNotEmpty, MinLength , IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // Optional — defaults to 'staff' if not provided
}
