import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindLeadsRes, SavedLead } from '@willbe-server/db-core';
import { LeadRes, RemoveLeadsReq } from './dto/lead.dto';
import { Op } from 'sequelize';
import { CreateLeadReq, UpdateLeadReq } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectModel(SavedLead) private savedLeadModel: typeof SavedLead,
  ) {}

  async findById(savedLeadId: string): Promise<LeadRes> {
    const savedLead = await this.savedLeadModel.findOne({
      where: {
        id: savedLeadId,
      }
    });

    if (!savedLead) {
      throw new NotFoundException('Lead not found');
    }

    return {
      id: savedLead.id,
      firstName: savedLead.leadData?.first_name ?? null,
      lastName: savedLead.leadData?.last_name ?? null,
      position: savedLead.leadData?.current_positions[0]?.role ?? null,
      positionDescription: savedLead.leadData?.position_description ?? null,
      email: savedLead.leadData?.email ?? null,
      phone: savedLead.leadData?.phone ?? null,
      company: savedLead.leadData?.current_positions[0]?.company ?? null,
      industry: savedLead.leadData?.industry ?? null,
      language: savedLead.leadData?.language ?? null,
      locationCountry:
        savedLead.leadData?.location_country
        ?? savedLead.leadData?.location
        ?? null,
      locationCity:
        savedLead.leadData?.location_city
        ?? savedLead.leadData?.location
        ?? null,
      subtitle: savedLead.leadData?.headline ?? null,
      summary: savedLead.leadData?.summary ?? null,
      linkedin: savedLead.leadData?.public_profile_url ?? null,
      isConnectedToHubspot: savedLead.isSyncedWithCrm,
    };
  }

  async createLead(
    dto: CreateLeadReq,
    companyId: string,
  ) {
    try {
      const leadData: FindLeadsRes = {
        type: 'PEOPLE',
        id: null,
        industry: dto?.industry || null,
        name: `${dto?.firstName || ''} ${dto?.lastName || ''}`,
        first_name: dto?.firstName || null,
        last_name: dto?.lastName || null,
        member_urn: null,
        public_identifier: null,
        public_profile_url: dto?.linkedin || null,
        profile_url: null,
        profile_picture_url: null,
        profile_picture_url_large: null,
        network_distance: null,
        location: null,
        headline: dto?.subtitle || null,
        summary: dto?.summary || null,
        pending_invitation: false,
        current_positions: [],
        open_profile: null,
        premium: null,
        shared_connections_count: 0,
        recent_posts_count: 0,
        email: dto?.email || null,
        phone: dto?.phone || null,
        language: dto?.language || null,
        location_country: dto?.locationCountry || null,
        location_city: dto?.locationCity || null,
        position_description: dto?.positionDescription || null,
      };
  
      const lead = await this.savedLeadModel.create({
        leadData,
        companyId,
        accountId: dto.accountId,
        isSyncedWithCrm: false,
      });
  
      return lead;
    } catch (error) {
      this.logger.error(
        `Failed to create lead`,
        error.stack
      );
      throw new BadRequestException('Unable to create lead');
    }
  }

  async update(savedLeadId: string, dto: UpdateLeadReq) {
    const savedLead = await this.savedLeadModel.findOne({
      where: {
        id: savedLeadId,
      },
    });

    if (!savedLead) {
      throw new NotFoundException('Lead not found');
    }

    if (dto?.firstName) {
      savedLead.leadData.first_name = dto.firstName;
    }

    if (dto?.lastName) {
      savedLead.leadData.last_name = dto.lastName;
    }

    if (dto?.position) {
      savedLead.leadData.current_positions[0].role = dto.position;
    }

    if (dto?.positionDescription) {
      savedLead.leadData.position_description = dto.positionDescription;
    }

    if (dto?.email) {
      savedLead.leadData.email = dto.email;
    }

    if (dto?.phone) {
      savedLead.leadData.phone = dto.phone;
    }

    if (dto?.company) {
      savedLead.leadData.current_positions[0].company = dto.company;
    }

    if (dto?.industry) {
      savedLead.leadData.industry = dto.industry;
    }

    if (dto?.language) {
      savedLead.leadData.language = dto.language;
    }

    if (dto?.locationCountry) {
      savedLead.leadData.location_country = dto.locationCountry;
    }

    if (dto?.locationCity) {
      savedLead.leadData.location_city = dto.locationCity;
    }

    if (dto?.subtitle) {
      savedLead.leadData.headline = dto.subtitle;
    }

    if (dto?.summary) {
      savedLead.leadData.summary = dto.summary;
    }

    if (dto?.linkedin) {
      savedLead.leadData.public_profile_url = dto.linkedin;
    }
    
    savedLead.changed('leadData', true);
    await savedLead.save();

    return this.findById(savedLeadId);
  }

  async delete(dto: RemoveLeadsReq) {
    await this.savedLeadModel.destroy({
      where: {
        id: { [Op.in]: dto.leadIds},
      },
    });

    return;
  }
}

