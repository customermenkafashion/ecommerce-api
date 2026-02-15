import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResource } from './user.resource';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* =========================
     CREATE USER
  ========================== */
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return {
      message: 'User created successfully',
      data: new UserResource(user),
    };
  }

  /* =========================
     SEARCH + PAGINATION
  ========================== */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll(
      Number(page),
      Number(limit),
      search,
    );

    return {
      users: UserResource.collection(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /* =========================
     FIND ONE
  ========================== */
  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));

    return {
      user: new UserResource(user),
    };
  }

  /* =========================
     UPDATE
  ========================== */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(Number(id), dto);

    return {
      message: 'User updated successfully',
      data: new UserResource(user),
    };
  }

  /* =========================
     DELETE
  ========================== */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(Number(id));

    return {
      message: 'User deleted successfully',
    };
  }
}
