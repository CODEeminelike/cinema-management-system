import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async create(data: { name: string; email: string }) {
    return this.prisma.users.create({ data });
  }
}