import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { IPaginationRes } from 'src/types/interfaces';

export class IGetListParam {
    page: number;
    size: number;
    sortBy?: string;
    sortDir: 'asc' | 'desc' = 'asc';
    search?: string;
    searchFields: string[] = [];
    filter?: { column: string; value: any };
    // allow single or multiple populate options
    populate?: { column: string; value?: any } | { column: string; value?: any }[];
}

@Injectable()
export class GlobalService {
    async getList<M,D>(model: Model<D>, params: IGetListParam): Promise<{ data: D[]; meta: IPaginationRes }> {
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
        if (params.filter && params.filter?.column && params.filter?.value !== undefined) {
            (conditions as any)[params.filter.column] = params.filter.value;
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
                    query.populate(pop.column, pop.value);
                });
            } else {
                query.populate(params.populate.column, params.populate.value);
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
}
