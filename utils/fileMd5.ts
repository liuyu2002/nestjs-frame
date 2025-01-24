import { createHash } from "crypto";
import { readFileSync } from "fs";
import * as xml2js from "xml2js";

export async function getFileMd5(filePath: string) {
    try {
        const buffer = readFileSync(filePath)
        const hash = createHash('md5');
        hash.update(buffer as any, 'utf8');
        return hash.digest('hex');
    } catch (error) {
        return null
    }
}
export function buildXML(json) {
    var builder = new xml2js.Builder({
        // @ts-ignore
        renderOpts: { pretty: false, cdata: true },
    });
    return builder.buildObject(json);
}
