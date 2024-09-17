import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityClass, column, ignoreId] = args.constraints;

    try {
      // Get the repository dynamically
      const repository = this.dataSource.getRepository(entityClass);

      // Build the where clause
      const whereClause: Record<string, any> = { [column]: value };

      const objectId = (args.object as any)?.id;

      if (objectId) {
        whereClause.id = Not(objectId);
      }

      // Check if entity with the given column value exists
      const count = await repository.count({ where: whereClause });

      // Return true if no entity is found, meaning the value is unique
      return count === 0;
    } catch (error) {
      console.error(`Error validating uniqueness: ${error}`);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, column] = args.constraints;
    return `${column} must be unique`;
  }
}
