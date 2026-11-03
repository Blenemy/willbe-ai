import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company, User, UserScopes, UserRole, EmailSignature } from '@willbe-server/db-core';
import bcrypt from 'bcrypt';
import { RegistrationReq, SocialMediaRegistrationReq } from '../auth/dto/register.dto';
import { Sequelize } from 'sequelize-typescript';
import { UpdateUserReq } from './dto/update-user.dto';
import { UpdateUserPasswordReq } from './dto/update-user-password.dto';
import { UpdateEmailSignatureReq } from './dto/update-email-signature.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Company)
    private companyModel: typeof Company,
    @InjectModel(EmailSignature)
    private emailSignatureModel: typeof EmailSignature,
    private sequelize: Sequelize,
  ) {}

  async createSuperAdmin(dto: RegistrationReq): Promise<User | null> {
    const transaction = await this.sequelize.transaction();
    try {
      const company = await this.companyModel.create({}, { transaction });
      const user = await this.userModel.create({
        ...dto,
        companyId: company.id,
        role: UserRole.SUPER_ADMIN,
      }, { transaction });

      await transaction.commit();

      return user;
    } catch (error) {
      await transaction.rollback();

      this.logger.error(`Error registering user`);
      this.logger.error(error);
      throw new BadRequestException('Unable to register user');
    }
  }

  async createSocialMediaSuperAdmin(dto: SocialMediaRegistrationReq): Promise<User | null> {
    const transaction = await this.sequelize.transaction();
    try {
      const company = await this.companyModel.create({}, { transaction });
      const user = await this.userModel.create({
        ...dto,
        companyId: company.id,
        role: UserRole.SUPER_ADMIN,
      }, { transaction });

      await transaction.commit();

      return user;
    } catch (error) {
      await transaction.rollback();

      this.logger.error(`Error registering user`);
      this.logger.error(error);
      throw new BadRequestException('Unable to register user');
    }
  }

  async createUser(
    dto: RegistrationReq & { position: string },
    companyId: string,
    role: UserRole,
  ): Promise<User | null>  {
    try {
      const user = await this.userModel.create({
        ...dto,
        companyId,
        role,
      });
      return user;
    } catch(error) {
      this.logger.error(`Creation user error`);
      this.logger.error(error);
      throw new BadRequestException('Unable to create user');
    }
  }

  async findByEmail(
    email: string,
    scope: UserScopes | undefined = undefined
  ): Promise<User | null> {
    if (scope) {
      return await this.userModel.scope(scope).findOne({ where: { email } });
    }

    return await this.userModel.findOne({ where: { email } });
  }

  async findById(
    id: string,
    scope: UserScopes | undefined = undefined
  ): Promise<User | null> {
    let user: User;
    if (scope) {
      user = await this.userModel.scope(scope).findByPk(id);
    } else {
      user =  await this.userModel.findByPk(id);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    dto: UpdateUserReq,
  ): Promise<User | null>  {
    const updateUserResult = await this.userModel.update(dto, {
      where: { id },
      returning: true,
    });
    if (!updateUserResult[0]) {
      throw new NotFoundException('User not found');
    }
    return updateUserResult[1][0];
  }

  async hashUserPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    try {
      await this.userModel.update({ refreshToken }, { where: { id: userId } });
    } catch (error) {
      this.logger.error(
        `Error updating refreshToken for user ID: ${userId}`,
        error.stack
      );
      throw new UnauthorizedException('Unable to update refresh token');
    }
  }

  async updatePasswordWithValidation(
    userId: string,
    dto: UpdateUserPasswordReq,
  ): Promise<User | null> {
    const user = await this.findById(
      userId,
      UserScopes.WITH_PASSWORD,
    );
    const isPasswordMatches = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isPasswordMatches) {
      throw new BadRequestException('Invalid old password');
    }
    return await this.updatePassword(userId, dto.newPassword);
  }

  async updatePassword(
    userId: string,
    password: string
  ): Promise<User | null> {
    try {
      const updateUserResult = await this.userModel.update(
        { password },
        {
          where: { id: userId },
          individualHooks: true,
          returning: true,
        },
      );
      return updateUserResult[1][0];
    } catch (error) {
      this.logger.error(
        `Error updating password for user ID: ${userId}`,
        error.stack
      );
      throw new BadRequestException('Password update failed');
    }
  }

  async findEmailSignature(userId: string): Promise<EmailSignature | null> {
    const emailSignature = await this.emailSignatureModel.findOne({
      where: { userId },
    });
    
    if (!emailSignature) {
      throw new NotFoundException('Email signature not found');
    }

    return emailSignature;
  }

  async updateEmailSignature(
    userId: string,
    dto: UpdateEmailSignatureReq,
  ): Promise<EmailSignature | null> {
    try {
      const [emailSignature] = await this.emailSignatureModel.upsert({
        body: dto.body,
        userId,
      });

      return emailSignature;
    } catch (error) {
      this.logger.error(
        `Error updating email signature for user ID: ${userId}`,
        error.stack
      );
      throw new BadRequestException('Email signature update failed');
    }
  }
}