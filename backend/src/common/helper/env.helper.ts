import { existsSync } from "fs";
import { resolve } from "path";

export function getEnvPath(dest: string): string {
  
  const env = process.env.NODE_ENV;
  const envFile = env ? resolve(dest, `.env.${env}`) : '';
  const fallbackEnv: string = resolve(dest, '.env');
  const filename: string = env ? `.env.${env}` : 'development.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if(!existsSync(filePath)){
    filePath = fallbackEnv;
  }

  return filePath;
}
