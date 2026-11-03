import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from '@willbe-server/db-core';
import { UpdateCompanyReq } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company)
    private companyModel: typeof Company,
  ) {}

  async findById(id: string): Promise<Company | null> {
    const company = await this.companyModel.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, dto: UpdateCompanyReq): Promise<Company | null> {
    const updateCompanyResult = await this.companyModel.update(dto, {
      where: { id },
      returning: true,
    });
    if (!updateCompanyResult[0]) {
      throw new NotFoundException('Company not found');
    }
    return updateCompanyResult[1][0];
  }
}
