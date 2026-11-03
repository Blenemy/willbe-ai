import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommModule } from '@willbe-server/comm';
import { ConfigCoreModule } from '@willbe-server/config-core';
import { baseModels, DbCoreModule } from '@willbe-server/db-core';
import { AbilityModule, googleConfig, microsoftConfig, SharedAuthModule, unipileConfig } from '@willbe-server/shared-auth';
import { LoggerMiddleware } from '@willbe-server/shared-logger';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HealthModule } from './health/health.module';
import { UsersService } from './users/users.service';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';
import { CompaniesProductsService } from './companies/companies-products.service';
import { UsersController } from './users/users.controller';
import { CompanyUsersController } from './users/company-users.controller';
import { CompanyUsersService } from './users/company-users.service';
import { HttpModule } from '@nestjs/axios';
import { UsersAccountsService } from './users/users-accounts.service';
import { UsersAccountsController } from './users/users-accounts.controller';
import { LeadScenariosController } from './lead-scenarios/lead-scenarios.controller';
import { LeadScenariosService } from './lead-scenarios/lead-scenarios.service';
import { LeadScenariosFiltersController } from './lead-scenarios/lead-scenarios-filters.controller';
import { LeadScenariosFiltersService } from './lead-scenarios/lead-scenarios-filters.service';
import { ScenarioParamsController } from './lead-scenarios/scenarios-params.controller';
import { AccountScenariosController } from './account-scenarios/account-scenarios.controller';
import { AccountScenariosService } from './account-scenarios/account-scenarios.service';
import { AccountScenarioParamsController } from './account-scenarios/account-scenario-params.controller';
import { MessageStructuresController } from './message-structures/message-structures.controller';
import { MessageStructuresService } from './message-structures/message-structures.service';
import { MessageTemplatesController } from './message-structures/message-templates.controller';
import { MessageTemplatesService } from './message-structures/message-templates.service';
import { MessageScenariosService } from './message-scenarios/message-scenarios.service';
import { MessageScenariosController } from './message-scenarios/message-scenarios.controller';
import { MessageEntriesController } from './message-scenarios/message-entries.controller';
import { MessageEntriesService } from './message-scenarios/message-entries.service';
import { ClaudeService } from './message-scenarios/claude.service';
import { BullModule } from '@nestjs/bullmq';
import { MessagesSendingProcessor } from './message-scenarios/processors/messages-sending.processor';
import { MessagesGenerationProcessor } from './message-scenarios/processors/messages-generation.processor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HubspotController } from './hubspot/hubspot.controller';
import { HubspotService } from './hubspot/hubspot.service';
import { HubspotProcessor } from './hubspot/processors/hubspot.processor';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsController } from './account-scenarios/accounts.controller';
import { AccountsService } from './account-scenarios/accounts.service';
import { LeadsController } from './lead-scenarios/leads.controller';
import { LeadsService } from './lead-scenarios/leads.service';
import { OpenaiService } from './message-scenarios/openai.service';
import { HubspotSynchronizeService } from './hubspot/hubspot-synchronize.service';
import { HubspotFieldsBindingService } from './hubspot/hubspot-fields-binding.service';
import { linkedinProviderFactory } from './linkedin/linkedin-provider.factory';
import { HomeController } from './home/home.controller';
import { HomeService } from './home/home.service';
import { DemoActivitySimulator } from './demo/demo-activity.simulator';

const redisConnection = {
  host: process.env['REDIS_HOST'] ?? 'localhost',
  port: Number(process.env['REDIS_PORT'] ?? 6379),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [googleConfig, microsoftConfig, unipileConfig],
    }),
    BullModule.registerQueue({
      name: 'messages-sending',
      connection: redisConnection,
    }),
    BullModule.registerQueue({
      name: 'messages-generation',
      connection: redisConnection,
    }),
    BullModule.registerQueue({
      name: 'hubspot-jobs',
      connection: redisConnection,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigCoreModule,
    SharedAuthModule,
    DbCoreModule.forRoot([...baseModels]),
    CommModule,
    HealthModule,
    AbilityModule,
    HttpModule,
  ],
  controllers: [
    AuthController,
    CompaniesController,
    UsersController,
    CompanyUsersController,
    UsersAccountsController,
    LeadScenariosController,
    LeadScenariosFiltersController,
    ScenarioParamsController,
    AccountScenariosController,
    AccountScenarioParamsController,
    MessageStructuresController,
    MessageTemplatesController,
    MessageScenariosController,
    MessageEntriesController,
    HubspotController,
    AccountsController,
    LeadsController,
    HomeController,
  ],
  providers: [
    AuthService,
    UsersService,
    CompaniesService,
    CompaniesProductsService,
    CompanyUsersService,
    UsersAccountsService,
    LeadScenariosService,
    LeadScenariosFiltersService,
    AccountScenariosService,
    MessageStructuresService,
    MessageTemplatesService,
    MessageScenariosService,
    MessageEntriesService,
    ClaudeService,
    OpenaiService,
    MessagesSendingProcessor,
    MessagesGenerationProcessor,
    HubspotService,
    HubspotProcessor,
    HubspotSynchronizeService,
    HubspotFieldsBindingService,
    AccountsService,
    LeadsService,
    HomeService,
    DemoActivitySimulator,
    linkedinProviderFactory,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
