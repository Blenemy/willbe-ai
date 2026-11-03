import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyReq } from './dto/update-company.dto';
import { CreateCompanyProductReq } from './dto/create-company-product.dto';
import { UpdateCompanyProductReq } from './dto/update-company-product.dto';
import { CompaniesProductsService } from './companies-products.service';
import { ApiCreateCompanyProductDocs, ApiFindAllCompanyProductsDocs, ApiFindCompanyByIdDocs, ApiFindCompanyProductByIdDocs, ApiRemoveCompanyProductsDocs, ApiUpdateCompanyDocs, ApiUpdateCompanyProductsDocs } from '@willbe-server/swagger-docs';
import { CurrentUser, JwtAuthGuard, AbilityService } from '@willbe-server/shared-auth';
import { User } from '@willbe-server/db-core';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly companiesProductsService: CompaniesProductsService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get(':id')
  @ApiFindCompanyByIdDocs()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companiesService.findById(id);
  }

  @Patch(':id')
  @ApiUpdateCompanyDocs()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyReq,
    @CurrentUser() user: User,
  ) {
    const company = await this.companiesService.findById(id);
    this.abilityService.checkUpdateCompanyAbility(user, company);
    return await this.companiesService.update(id, dto);
  }

  @Post(':companyId/products-and-services')
  @ApiCreateCompanyProductDocs()
  async createCompanyProduct(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() dto: CreateCompanyProductReq,
    @CurrentUser() user: User,
  ) {
    const company = await this.companiesService.findById(companyId);
    this.abilityService.checkUpdateCompanyAbility(user, company);
    return await this.companiesProductsService.create(companyId, dto);
  }

  @Get(':companyId/products-and-services')
  @ApiFindAllCompanyProductsDocs()
  async findAllCompanyProducts(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return await this.companiesProductsService.findAll(companyId);
  }

  @Get('products-and-services/:id')
  @ApiFindCompanyProductByIdDocs()
  async findCompanyProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companiesProductsService.findById(id);
  }

  @Patch('products-and-services/:id')
  @ApiUpdateCompanyProductsDocs()
  async updateCompanyProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyProductReq,
    @CurrentUser() user: User,
  ) {
    const companyProduct = await this.companiesProductsService.findById(id);
    this.abilityService.checkManageCompanyProductsAbility(user, companyProduct);
    return await this.companiesProductsService.update(id, dto);
  }

  @Delete('products-and-services/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveCompanyProductsDocs()
  async removeCompanyProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const companyProduct = await this.companiesProductsService.findById(id);
    this.abilityService.checkManageCompanyProductsAbility(user, companyProduct);
    return await this.companiesProductsService.remove(id);
  }
}
