const path = require('path');
import { readdirSync, statSync, mkdirSync, unlinkSync, copyFileSync, existsSync, rmSync } from "fs"
import { getFileMd5 } from "./fileMd5"


export async function asyncfiles(srcDir: string, targetDir: string) {
    await copyCommon(srcDir, targetDir)
    deleteCommon(srcDir, targetDir)
}


export async function copyCommon(srcDir: string, targetDir: string) {
    const files = readdirSync(srcDir)
    for (const file of files) {
        const srcPath: string = path.join(srcDir, file)
        const tarPath: string = path.join(targetDir, file)
        const stats = statSync(srcPath)
        if (stats.isDirectory()) {
            try {
                mkdirSync(tarPath)
            } catch (error) {

            }
            copyCommon(srcPath, tarPath)
        } else {
            // 如果MD5一样，则不拷贝
            const tarMd5 = await getFileMd5(tarPath)
            const srcMd5 = await getFileMd5(srcPath)
            if (srcMd5 != tarMd5) {
                tarMd5 && unlinkSync(tarPath)
                copyFileSync(srcPath, tarPath)
            }
        }
    }
}

export function deleteCommon(srcDir: string, targetDir: string) {
    const files = readdirSync(targetDir)
    for (const file of files) {
        const srcPath: string = path.join(srcDir, file)
        const tarPath: string = path.join(targetDir, file)
        if (!existsSync(srcPath)) {
            const stats = statSync(tarPath)
            if (stats.isDirectory()) {
                rmSync(tarPath, { recursive: true })
            } else {
                unlinkSync(tarPath)
            }
            continue
        }
        const stats = statSync(tarPath)
        if (stats.isDirectory()) {
            try {
                deleteCommon(srcPath, tarPath)
            } catch (error) {

            }
        }
    }


}
