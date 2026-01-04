import type { DocumentMetadata, MakeAllOrUndefined } from '@utils';
import type { DeleteOptions } from 'mongodb';
import type {
  ApplyBasicCreateCasting,
  CreateOptions,
  DeepPartial,
  Model,
  MongooseBaseQueryOptions,
  QueryFilter,
  QueryOptions,
  Require_id,
  UpdateQuery,
} from 'mongoose';

export type FilterQuery<T extends DocumentMetadata> = Partial<MakeAllOrUndefined<Omit<T, keyof DocumentMetadata>>>;
export type CreateDTO<T extends DocumentMetadata> = DeepPartial<ApplyBasicCreateCasting<Require_id<T>>> &
  Partial<Pick<DocumentMetadata, '_id'>>;

export default class Service<
  T extends DocumentMetadata,
  TCreateDTO extends CreateDTO<T>,
  UpdateDTO extends UpdateQuery<T>,
> {
  private model: Model<T>;

  constructor(model: typeof this.model) {
    this.model = model;
  }

  createSingle(createDTO: TCreateDTO) {
    return this.model.create(createDTO);
  }

  createMany(createDTOs: TCreateDTO[], options?: CreateOptions) {
    return this.model.create(createDTOs, options);
  }

  getMany(filter?: FilterQuery<T>) {
    return this.model.find(filter);
  }

  getById(id: T['_id']) {
    return this.model.findById(id);
  }

  updateById(id: T['_id'], updateDTO: UpdateDTO, options?: QueryOptions<T>) {
    return this.model.findByIdAndUpdate(id, updateDTO, { new: true, ...options });
  }

  deleteById(id: T['_id']) {
    return this.model.findByIdAndDelete(id);
  }

  deleteMany(filter?: QueryFilter<T>, options?: DeleteOptions & MongooseBaseQueryOptions<T>) {
    return this.model.deleteMany(filter, options);
  }

  async exists(filter: QueryFilter<T>) {
    return !!(await this.model.exists(filter));
  }
}
