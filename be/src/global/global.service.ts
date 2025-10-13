import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { modules } from 'src/types/constants';
import { IPaginationRes, PopulateParam, TOneOrMany } from 'src/types/interfaces';
export class IGetListParam {
  page: number;
  size: number;
  sortBy?: string = '';
  sortDir?: 'asc' | 'desc' = 'asc';
  search?: string = '';
  searchFields: string[] = [];
  filter?: TOneOrMany<{ column: string; value: any }>;
  // allow single or multiple populate options
  populate?: TOneOrMany<PopulateParam>;
}

@Injectable()
export class GlobalService {

  async getList<M>(model: Model<M>, params: IGetListParam): Promise<{ data: M[]; meta: IPaginationRes }> {
    const pageNum = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Number(params.size) || 10);
    const skip = (pageNum - 1) * pageSize;

    // ✅ Start with empty filter object
    const conditions: FilterQuery<M> = {};

    // 🔎 Search
    if (params.search && params.searchFields.length > 0) {
      const conditionList = params.searchFields.map((field: any) => ({
        [field]: { $regex: params.search, $options: 'i' },
      }));
      conditions['$or'] = conditionList;
    }

    // 🎯 Custom filter
    const addFilter = (filter) => {
      if (filter?.column && filter.value !== undefined) {
        if (Array.isArray((conditions as any)[filter.column])) {
          (conditions as any)[filter.column].push(filter.value);
        } else if ((conditions as any)[filter.column] !== undefined) {
          (conditions as any)[filter.column] = { $in: [(conditions as any)[filter.column], filter.value] }; // This way we can filter a column with multiple value as keys
        } else {
          (conditions as any)[filter.column] = filter.value;
        }
      }
    };

    if (params.filter) {
      if (Array.isArray(params.filter)) {
        params.filter.forEach((filter) => {
          addFilter(filter);
        })
      } else {
        addFilter(params.filter);
      }
    }


    // 🔀 Sorting
    const sort: Record<string, 1 | -1> = {};
    if (params.sortBy) {
      sort[params.sortBy] = params.sortDir === 'desc' ? -1 : 1;
    }

    const query = model.find(conditions).sort(sort).skip(skip).limit(pageSize);

    // ✅ Handle populate (single or array)
    if (params.populate) {
      if (Array.isArray(params.populate)) {
        params.populate.forEach((pop) => {
          query.populate({ path: pop.column, select: pop.select, match: pop.match, options: pop.options });
        });
      } else {
        query.populate({ path: params.populate.column, select: params.populate.select, match: params.populate.match, options: params.populate.options });
      }
    }

    const [data, total] = await Promise.all([
      query.exec(),
      model.countDocuments(conditions).exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        size: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  getPermissions() {
    return modules;
  }

}
