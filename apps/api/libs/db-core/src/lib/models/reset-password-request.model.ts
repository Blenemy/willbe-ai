import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';
import { IResetPasswordRequest } from '../interfaces/reset-password-request.interface';
import { systemSchema } from '../system-schema';

@Table({
  tableName: 'reset_password_requests',
  schema: systemSchema,
  timestamps: true,
  underscored: true,
})
export class ResetPasswordRequest extends Model<IResetPasswordRequest>{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  email: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isReset: boolean;
}
