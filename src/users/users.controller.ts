import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/UserRole';
import { User } from './entities/user.entity';
import { success } from 'src/common/utils/api-response-wrapper';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // List all users

  @Get('coupons/disliked')
  async getUserDislikedCoupons(@Req() req: Request) {
    const user = (req as any).user as User;
    const coupons = await this.usersService.getUserDislikedCoupons(user.id);
    return success(coupons);
  }

  @Get('coupons/followed')
  async getUserFollowedCoupons(@Req() req: Request) {
    const user = (req as any).user as User;
    const coupons = await this.usersService.getUserFollowedCoupons(user.id);
    return success(coupons);
  }

  @Get('coupons/favorites')
  async getUserFavoriteCoupons(@Req() req: Request) {
    const userRequest = (req as any).user as User;
    const coupons = await this.usersService.getUserFavoriteCoupons(
      userRequest.id,
    );

    const user = await this.usersService.profile(userRequest.id);

    return success({ coupons, user });
  }

  @Get('coupons/liked')
  async getUserLikedCoupons(@Req() req: Request) {
    const user = (req as any).user as User;
    const coupons = await this.usersService.getUserLikedCoupons(user.id);
    return success(coupons);
  }
  @Get('brands/followed')
  async getUserFollowedBrands(@Req() req: Request) {
    const userRequest = (req as any).user as User;
    const brands = await this.usersService.getUserFollowedBrands(
      userRequest.id,
    );

    const user = await this.usersService.profile(userRequest.id);

    return success({ brands, user });
  }

  /// Actions

  @Post('coupons/:couponId/disliked')
  async dislikeCoupon(
    @Req() req: Request,
    @Param('couponId') couponId: string,
  ) {
    const user = (req as any).user as User;
    return success(this.usersService.addDislikedCoupon(user.id, couponId));
  }

  @Delete('coupon/:couponId/disliked')
  async unDislikedCoupon(
    @Req() req: Request,
    @Param('couponId') couponId: string,
  ) {
    const user = (req as any).user as User;
    return success(this.usersService.removeDislikedCoupon(user.id, couponId));
  }

  @Post('coupon/:couponId/like')
  async likeCoupon(@Req() req: Request, @Param('couponId') couponId: string) {
    const user = (req as any).user as User;
    return success(this.usersService.likeCoupon(user.id, couponId));
  }

  @Delete('coupon/:couponId/like')
  async unlikeCoupon(@Req() req: Request, @Param('couponId') couponId: string) {
    const user = (req as any).user as User;
    return success(this.usersService.unlikeCoupon(user.id, couponId));
  }

  @Post('coupon/:couponId/favorite')
  async favoriteCoupon(
    @Req() req: Request,
    @Param('couponId') couponId: string,
  ) {
    const user = (req as any).user as User;

    return success(this.usersService.addFavoriteCoupon(user.id, couponId));
  }

  @Delete('coupon/:couponId/favorite')
  async unfavoriteCoupon(
    @Req() req: Request,
    @Param('couponId') couponId: string,
  ) {
    const user = (req as any).user as User;
    return success(this.usersService.removeFavoriteCoupon(user.id, couponId));
  }

  @Post('brand/:brandId/follow')
  async followBrand(@Req() req: Request, @Param('brandId') brandId: string) {
    const user = (req as any).user as User;
    return success(this.usersService.followBrand(user.id, brandId));
  }

  @Delete('brand/:brandId/follow')
  async unfollowBrand(@Req() req: Request, @Param('brandId') brandId: string) {
    const user = (req as any).user as User;
    return success(this.usersService.unfollowBrand(user.id, brandId));
  }

  @Post('coupon/:couponId/follow')
  async followCoupon(@Req() req: Request, @Param('couponId') couponId: string) {
    const user = (req as any).user as User;
    return success(this.usersService.followCoupon(user.id, couponId));
  }

  @Delete('coupon/:couponId/follow')
  async unfollowCoupon(
    @Req() req: Request,
    @Param('couponId') couponId: string,
  ) {
    const user = (req as any).user as User;
    return success(this.usersService.unfollowCoupon(user.id, couponId));
  }
}
