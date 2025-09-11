import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { IPaginationRes } from 'src/types/interfaces';

@Injectable()
export class GlobalService {
    async getList<M>(
        model: Model<M>,
        page: number,
        size: number,
        sortBy?: string,
        sortDir: 'asc' | 'desc' = 'asc',
        search?: string,
        searchFields: string[] = [], // ✅ Add searchable fields
        filter?: { column: string; value: string },
    ): Promise<{ data: M[]; meta: IPaginationRes }> {
        const pageNum = Math.max(1, Number(page) || 1);
        const pageSize = Math.max(1, Number(size) || 10);
        const skip = (pageNum - 1) * pageSize;

        // ✅ Start with empty filter object
        const conditions: FilterQuery<M> = {};

        // 🔎 Search
        if (search && searchFields.length > 0) {
            const conditionList = searchFields.map((field: any) => ({
                [field]: { $regex: search, $options: 'i' },
            }));
            conditions['$or'] = conditionList;
        }

        // 🎯 Custom filter
        if (filter?.column && filter?.value) {
            (conditions as any)[filter.column] = filter.value;
        }

        // 🔀 Sorting
        const sort: Record<string, 1 | -1> = {};
        if (sortBy) {
            sort[sortBy] = sortDir === 'desc' ? -1 : 1;
        }

        const [data, total] = await Promise.all([
            model.find(conditions).sort(sort).skip(skip).limit(pageSize).exec(),
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
