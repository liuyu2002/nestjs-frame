
export interface IPagination {
    current?: number;   // 当前页码，从1开始
    pageSize?: number;  // 每页数量
    order?: string;     // 排序字段
    desc?: boolean;     // 排序方式
}