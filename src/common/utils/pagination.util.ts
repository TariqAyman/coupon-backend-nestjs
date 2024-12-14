import {
  Repository,
  ObjectLiteral,
  getMetadataArgsStorage,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationOptionsDto } from '../dto/pagination-options.dto';
import { log } from 'console';

class PaginationOptions<Entity> extends PaginationOptionsDto {}

export async function findWithPagination<Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  options: PaginationOptions<Entity>,
  relations?: string[],
  modifyQueryBuilder?: (queryBuilder: SelectQueryBuilder<Entity>) => void,
): Promise<{
  data: Entity[];
  total: number;
  pageNumber: number;
  limitNumber: number;
}> {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    searchField,
    relationFilterBy,
    relationFilterValue,
    simple,
    hiddenRelationFilterBy,
  } = options;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || isNaN(limitNumber)) {
    throw new Error('Invalid page or limit value');
  }

  // Fetch entity metadata to get valid fields dynamically
  const validFields: string[] = getMetadataArgsStorage()
    .columns.filter((column) => column.target === repository.target)
    .map((column) => column.propertyName);

  // Create query builder for the entity
  const queryBuilder = repository.createQueryBuilder('entity'); // 'entity' is an alias for the main entity

  // Add joins for relations if provided
  if (relations) {
    relations.forEach((relation: string) => {
      if (hiddenRelationFilterBy?.includes(relation)) {
        queryBuilder.leftJoin(`entity.${relation}`, relation);
      } else {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      }
    });
  }

  // Add filters for relation fields if provided
  if (relationFilterBy && relationFilterValue) {
    queryBuilder.andWhere(`${relationFilterBy} = :relationFilterValue`, {
      relationFilterValue,
    });
  }

  // Add search functionality
  if (search && searchField && validFields.includes(searchField as string)) {
    queryBuilder.andWhere(`entity.${searchField} LIKE :search`, {
      search: `%${search}%`,
    });
  }

  // Add sorting functionality
  if (sortBy) {
    queryBuilder.orderBy(
      `entity.${sortBy}`,
      (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'DESC',
    );
  }

  // If `simple=true`, select only the 'id', 'name', and 'image' fields
  if (simple) {
    const selectFields = ['entity.id', 'entity.name', 'entity.image'];

    if (sortBy && !selectFields.includes(`entity.${sortBy}`)) {
      selectFields.push(`entity.${sortBy}`);
    }

    if (searchField && !selectFields.includes(`entity.${searchField}`)) {
      selectFields.push(`entity.${searchField}`);
    }

    queryBuilder.select(selectFields);
  }

  // Apply the custom query modifications if provided
  if (modifyQueryBuilder) {
    modifyQueryBuilder(queryBuilder);
  }

  // Apply pagination
  queryBuilder.skip((pageNumber - 1) * limitNumber).take(limitNumber);

  // Execute query and get data and total count
  const [data, total] = await queryBuilder.getManyAndCount();

  return {
    data,
    total,
    pageNumber,
    limitNumber,
  };
}
