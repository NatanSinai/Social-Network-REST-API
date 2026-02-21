import type { DocumentMetadata, MakeAllOrUndefined } from '@utils';
import type {
  ApplyBasicCreateCasting,
  CreateOptions,
  DeepPartial,
  Model,
  QueryFilter,
  QueryOptions,
  Require_id,
  UpdateQuery,
} from 'mongoose';

export type FilterQuery<T extends Pick<DocumentMetadata, '_id'>> = Partial<
  MakeAllOrUndefined<Omit<T, keyof DocumentMetadata>>
>;

export type CreateDTO<T extends Pick<DocumentMetadata, '_id'>> = DeepPartial<ApplyBasicCreateCasting<Require_id<T>>> &
  Partial<Pick<DocumentMetadata, '_id'>>;

export default class Service<
  T extends Pick<DocumentMetadata, '_id'>,
  TCreateDTO extends CreateDTO<T>,
  UpdateDTO extends UpdateQuery<T>,
> {
  protected model: Model<T>;

  constructor(model: typeof this.model) {
    this.model = model;
  }

  createSingle(createDTO: TCreateDTO) {
    return this.model.create(createDTO);
  }

  createMany(createDTOs: TCreateDTO[], options?: CreateOptions) {
    return this.model.create(createDTOs, options);
  }

  async getMany(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.find(filter, {}, options);
  }

  getById(id: T['_id']) {
    return this.model.findById(id);
  }

  getOne(filter?: FilterQuery<T>) {
    return this.model.findOne(filter);
  }

  updateById(id: T['_id'], updateDTO: UpdateDTO, options?: QueryOptions<T>) {
    return this.model.findByIdAndUpdate(id, updateDTO, { new: true, ...options });
  }

  deleteSingle(filter?: FilterQuery<T>) {
    return this.model.findOneAndDelete(filter);
  }

  deleteById(id: T['_id']) {
    return this.model.findByIdAndDelete(id);
  }

  async exists(filter: QueryFilter<T>) {
    return !!(await this.model.exists(filter));
  }

  existsById(_id: T['_id']) {
    return this.exists({ _id });
  }

  count(filter?: QueryFilter<T>) {
    return this.model.countDocuments(filter);
  }
}
