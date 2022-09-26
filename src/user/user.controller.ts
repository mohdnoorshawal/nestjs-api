import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(
    @GetUser() user: User,
    // @GetUser('email') email: string
  ) {
    //   getMe(@Req() req: Request) {
    // console.log({
    //   user: req.user,
    // });
    // console.log({
    //   email,
    // });
    return user;
    // return 'user info';
  }

  @Patch()
  editUser() {}
}
