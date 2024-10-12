import { IsString } from 'class-validator';

export class BilingualString {
  @IsString()
  en: string;

  @IsString()
  ar: string;
}

export interface BilingualStringObject {
  en: string;
  ar: string;
}