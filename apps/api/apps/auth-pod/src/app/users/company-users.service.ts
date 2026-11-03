import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, Invitation } from '@willbe-server/db-core';
import { CommEmailService } from '@willbe-server/comm';
import { CreateInvitationReq } from './dto/create-invitation.dto';
import { CompaniesService } from '../companies/companies.service';
import { AcceptInvitationReq } from './dto/accept-invitation.dto';
import { UsersService } from './users.service';
import { UpdateCompanyUserReq } from './dto/update-company-user.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CompanyUsersService {
  private readonly logger = new Logger(CompanyUsersService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Invitation)
    private readonly invitationModel: typeof Invitation,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly commmService: CommEmailService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(companyId: string): Promise<User[]> {
    await this.companiesService.findById(companyId);

    const users = await this.userModel.findAll({
      where: { companyId },
    });

    return users;
  }

  async createInvitation(
    companyId: string,
    dto: CreateInvitationReq
  ): Promise<Invitation | null> {
    await this.companiesService.findById(companyId);

    const existingInvitation = await this.invitationModel.findOne({
      where: { email: dto.email },
    });
    if (existingInvitation) {
      throw new BadRequestException(
        'Invitation already exists for given email'
      );
    }

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    try {
      const invitation = await this.invitationModel.create({
        ...dto,
        companyId,
      });

      await this.commmService.sendInvitation(invitation.email, invitation.id);
      return invitation;
    } catch (error) {
      this.logger.error(
        `Failed to create invitation for email: ${dto.email}`,
        error.stack
      );
      throw new BadRequestException('Unable to create an invitation');
    }
  }

  async findInvitationById(id: string): Promise<Invitation | null> {
    const invitation = await this.invitationModel.findOne({ where: { id } });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    return invitation;
  }

  async acceptInvitation(
    invitationId: string,
    dto: AcceptInvitationReq
  ): Promise<User | null> {
    const invitation = await this.findInvitationById(invitationId);
    if (invitation.isAccepted) {
      throw new BadRequestException('Invitation already accepted');
    }
    const user = await this.usersService.createUser(
      {
        ...dto,
        email: invitation.email,
        position: invitation.position,
      },
      invitation.companyId,
      invitation.role
    );

    try {
      await invitation.update({ isAccepted: true });
    } catch (error) {
      this.logger.error(
        `Failed to update invitation: ${invitation.id}`,
        error.stack
      );
      throw new BadRequestException('Unable to accept an invitation');
    }

    return user;
  }

  async update(
    userId: string,
    dto: UpdateCompanyUserReq
  ): Promise<User | null> {
    try {
      const updateUserResult = await this.userModel.update(dto, {
        where: { id: userId },
        returning: true,
      });

      if (!updateUserResult[0]) {
        throw new NotFoundException('User not found');
      }

      return updateUserResult[1][0];
    } catch (error) {
      this.logger.error(`Failed to update user with ID: ${userId}`, error.stack);
      throw new BadRequestException('Unable to update user');
    }
  }

  async remove(userId: string): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.usersService.findById(userId);

      await Promise.all([
        this.userModel.destroy({
          where: { id: userId },
          transaction,
        }),
        this.invitationModel.destroy({
          where: { email: user.email },
          transaction,
        }),
      ]);

      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to remove user with ID: ${userId}`, error.stack);
      throw new BadRequestException('Unable to remove user');
    }
  }
}
