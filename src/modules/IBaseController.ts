export interface IControllerBase {

    create(params: any, request: any, response: any): any

    findAll(query: any, request: any): any

    findOne(id: number, request: any): any

    update(id: number, params: any, request: any): any

}
