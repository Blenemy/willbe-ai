import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import {
  IUser,
  UserLanguage,
  UserRole,
  UserScopes,
  UserAuthProvider,
} from '../interfaces/user.interface';
import { systemSchema } from '../system-schema';
import { Company } from './company.model';
import { LeadScenarioModel } from './lead-scenario.model';
import { LeadScenarioFilterModel } from './lead-scenario-filter.model';
import { MessageStructure } from './message-structure.model';

@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'refreshToken'],
  },
}))
@Scopes(() => {
  return {
    [UserScopes.WITH_PASSWORD]: {
      attributes: {
        include: ['password'],
      },
    },
    [UserScopes.WITH_REFRESH_TOKEN]: {
      attributes: {
        include: ['refreshToken'],
      },
    },
  };
})
@Table({
  tableName: 'users',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class User extends Model<IUser> {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email',
    uniqueItems: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: 'User password',
    writeOnly: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @ApiProperty({
    example: 'CEO',
    description: 'User position in the company',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  position: string;

  @ApiProperty({
    example: 'admin',
    description: 'User role in the system',
  })
  @Column({
    type: DataType.ENUM(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER),
    allowNull: false,
  })
  role: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User company ID',
  })
  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  companyId: string;

  @BelongsTo(() => Company)
  company: Company;

  @ApiProperty({
    enum: UserLanguage
  })
  @Default(UserLanguage.EN)
  @Column({
    type: DataType.ENUM(UserLanguage.EN, UserLanguage.ES, UserLanguage.FR),
  })
  language: UserLanguage;

  @ApiProperty({
    example: 'refreshToken123',
    description: 'Refresh token',
    writeOnly: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken?: string;

  @ApiProperty({
    example: UserAuthProvider.GOOGLE,
    description: 'User authentication provider',
  })
  @Column({
    type: DataType.ENUM(
      UserAuthProvider.GOOGLE,
      UserAuthProvider.LINKEDIN,
      UserAuthProvider.MICROSOFT,
    ),
    allowNull: true,
  })
  authProvider?: UserAuthProvider;

  @HasMany(() => LeadScenarioModel)
  leadScenarios: LeadScenarioModel[]

  @HasMany(() => LeadScenarioFilterModel)
  leadScenariosFilters: LeadScenarioFilterModel[]

  @HasMany(() => MessageStructure)
  messageStructures: MessageStructure[]

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.password) {
      await this.hashPasswordHelper(instance);
    }
  }

  @BeforeUpdate
  static async hashPasswordUpdate(instance: User) {
    if (instance.changed('password')) {
      await this.hashPasswordHelper(instance);
    }
  }

  private static async hashPasswordHelper(instance: User) {
    const salt = await bcrypt.genSalt(10);
    instance.password = await bcrypt.hash(instance.password, salt);
  }
}
