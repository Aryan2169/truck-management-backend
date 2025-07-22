import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(dto: any): Promise<any> {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: hashed,
      role: dto.role || 'staff' // default
    });
    await this.usersRepo.save(user);
    return { message: 'User registered' };
  }

  async login(dto: any): Promise<{ accessToken: string }> {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
