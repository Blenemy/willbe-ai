import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LeadScenarioFilterModel, User, LeadScenarioFilterValueModel, LeadScenarioModel } from '@willbe-server/db-core';
import { CreateLeadScenarioFilterReq } from './dto/create-filter.dto';
import { UpdateLeadScenarioFilterReq } from './dto/update-filter.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class LeadScenariosFiltersService {
  private readonly logger = new Logger(LeadScenariosFiltersService.name);

  constructor(
      @InjectModel(LeadScenarioModel)
      private readonly leadScenarioModel: typeof LeadScenarioModel,
      @InjectModel(LeadScenarioFilterModel)
      private readonly leadScenarioFilterModel: typeof LeadScenarioFilterModel,
      @InjectModel(LeadScenarioFilterValueModel)
      private readonly leadScenarioFilterValueModel: typeof LeadScenarioFilterValueModel,
      private readonly sequelize: Sequelize,
  ) {}

  async create(
      dto: CreateLeadScenarioFilterReq,
      userId: string,
  ): Promise<LeadScenarioFilterModel | null | any> {
      const transaction = await this.sequelize.transaction();
      try {
        const leadScenario = await this.leadScenarioModel.findOne({
          where: { id: dto.leadScenarioId },
          transaction,
        });

        if (!leadScenario) {
          throw new NotFoundException('Lead scenario not found');
        }

        const leadScenarioFilter = await this.leadScenarioFilterModel.create(
          {
            name: dto.name,
            userId,
          },
          { transaction },
          
        );

        if (dto?.filterValues && dto.filterValues.length) {
          const filterValues = dto.filterValues.map((value) => {
            return { ...value, filterId: leadScenarioFilter.id };
          });
    
          await this.leadScenarioFilterValueModel.bulkCreate(filterValues, {
            transaction,
          });
        }

        leadScenario.filterId = leadScenarioFilter.id;
        await leadScenario.save({ transaction });

        await transaction.commit();
        return leadScenarioFilter;
      } catch(error) {
        await transaction.rollback();
        this.logger.error(
          `Failed to create lead scenario filter`,
          error,
        );

        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        }

        throw new BadRequestException('Unable to create lead scenario filter');
      }
    }
  
  async findAll(companyId: string): Promise<LeadScenarioFilterModel[]> {
    const leadScenarioFilters = await this.leadScenarioFilterModel.findAll({
      include: [
        {
          model: User,
          where: { companyId },
          required: true,
          attributes: [],
        }
      ],
    });
    return leadScenarioFilters;
  }

  async findById(id: string): Promise<LeadScenarioFilterModel | null> {
    const leadScenarioFilter = await this.leadScenarioFilterModel.findOne({
      where: { id },
      include: [
        {
          model: LeadScenarioFilterValueModel,
          attributes: ['filterKey', 'filterValue'],
        }
      ],
    });

    if (!leadScenarioFilter) {
      throw new NotFoundException('Lead scenario filter not found');
    }

    return leadScenarioFilter;
  }

  async update(
    filterId: string,
    dto: UpdateLeadScenarioFilterReq,
  ): Promise<LeadScenarioFilterModel> {
    const transaction = await this.sequelize.transaction();
    try {
      const leadScenarioFilter = await this.leadScenarioFilterModel.findOne({
        where: { id: filterId },
        transaction,
      });

      if (!leadScenarioFilter) {
        throw new NotFoundException('Lead scenario filter not found');
      }

      if (dto.name) {
        leadScenarioFilter.name = dto.name;
        await leadScenarioFilter.save({ transaction });
      }

      if (dto?.filterValues) {
        const filterValues = dto.filterValues.map((value) => {
          return { ...value, filterId: leadScenarioFilter.id };
        });
  
        await Promise.all([
          this.leadScenarioFilterValueModel.destroy({
            where: { filterId },
            transaction,
          }),
          this.leadScenarioFilterValueModel.bulkCreate(filterValues, {
            transaction,
          }),
        ]);
      }

      await transaction.commit();
      return leadScenarioFilter;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        `Failed to update lead scenario filter`,
        error,
      );
      throw new BadRequestException('Unable to update lead scenario filter');
    }
  }

  async remove(filterId: string): Promise<void> {
    await this.leadScenarioFilterModel.destroy({
      where: { id: filterId },
    });
    return;
  }
}
