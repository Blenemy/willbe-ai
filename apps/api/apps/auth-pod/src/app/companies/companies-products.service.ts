import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyProduct } from '@willbe-server/db-core'
import { CreateCompanyProductReq } from './dto/create-company-product.dto';
import { UpdateCompanyProductReq } from './dto/update-company-product.dto';

@Injectable()
export class CompaniesProductsService {
  constructor (
    private companiesService: CompaniesService,
    @InjectModel(CompanyProduct)
    private companyProductModel: typeof CompanyProduct
  ) {}

  async create(
      companyId: string,
      dto: CreateCompanyProductReq,
  ) {
      await this.companiesService.findById(companyId);
      const companyProduct = await this.companyProductModel.create({
        ...dto,
        companyId,
      });
  
      return companyProduct;
    }
  
    async findAll(companyId: string) {
      await this.companiesService.findById(companyId);
      const companyProducts = await this.companyProductModel.findAll({
        where: { companyId },
      });
  
      return companyProducts;
    }
  
    async findById(id: string) {
      const companyProduct = await this.companyProductModel.findOne({ where: { id } });
      if (!companyProduct) {
        throw new NotFoundException('Company product or service not found');
      }
      return companyProduct;
    }
    
    async update(id: string, dto: UpdateCompanyProductReq) {
      const updateCompanyProductResult = await this.companyProductModel.update(dto, {
        where: { id },
        returning: true,
      });
      if (!updateCompanyProductResult[0]) {
        throw new NotFoundException('Company product or service not found');
      }
      return updateCompanyProductResult[1][0];
    }
  
    async remove(id: string) {
      await this.companyProductModel.destroy({ where: { id } });
      return;
    }
}
