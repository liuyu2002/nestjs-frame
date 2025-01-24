/**************************************
@File    :   excel.ts
@Time    :   2023/01/19 16:36:58
@Author  :   路拾遗
@Version :   1.0
@Contact :   lk920125@hotmail.com
yarn add exceljs
***************************************/
import Excel = require('exceljs')
import { Response } from 'express';

export class ExcelUtil {
    private constructor() { }
    /**
     * 导出Excel文件
     * @param fileName 文件名：模板.xlsx
     * @param data // sheetName lineHeader：表头数据，支持多行 data：数据
     * @param response express 返回数据
     */
    static async exportExcel(fileName: string, data: { sheetName: string, lineHeader: string[][], data: string[][] }[], response: Response) {
        response.set({
            'Access-Control-Expose-Headers': 'Content-Disposition', // 开放，否则axios拿不到Content-Disposition
            'Content-Type': 'application/xlsx',
            'Content-Disposition': 'attachment;filename=' + encodeURI(fileName) // 告诉前端，文件名称
        })

        const workbook = new Excel.stream.xlsx.WorkbookWriter(
            {
                stream: response, // I need to somehow declare the reply stream here
                useStyles: false,
                useSharedStrings: true
            }
        ); // new Excel.Workbook();
        workbook.creator = 'nestjs'
        workbook.lastModifiedBy = 'nestjs'
        workbook.created = new Date()
        workbook.modified = new Date()

        data.map(tmp => {
            const sheet = workbook.addWorksheet(tmp.sheetName)
            tmp.lineHeader.map(t => { sheet.addRow(t) })
            tmp.data.map(t => { sheet.addRow(t) })
            sheet.commit()
        })

        workbook.commit()
    }

    /**
     * 
     * @param fileName 文件路径
     * @param start 指定读取第几行的数据
     * @param sheet 指定第几个表
     */
    static async readExcel(fileName: string, start: number, sheet: number = 1) {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(fileName)
        const worksheet = workbook.getWorksheet(sheet);
        const data: any[] = []
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber <= start) return
            const rowSize = row.cellCount;
            const numValues = row.actualCellCount;
            // console.log(`rowSize:${rowSize}, numValues:${numValues}`);
            const rowData: any[] = []
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                rowData.push(cell.type == 6 ? cell.result : cell.value)
            })
            data.push(rowData)
        })

        return data
    }
}