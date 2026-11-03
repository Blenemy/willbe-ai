import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@willbe-server/db-core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../config/jwt.config';
import { IJwt } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtCfg: ConfigType<typeof jwtConfig>,
    @InjectModel(User)
    private userModel: typeof User
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtCfg.jwtSecret,
    });
  }

  async validate(payload: IJwt): Promise<User> {
    const user = await this.userModel.findByPk(payload.sub, {
      rejectOnEmpty: false,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
