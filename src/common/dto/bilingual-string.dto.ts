import { IsNotEmpty, IsString } from 'class-validator';

export class BilingualString {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ar: string;
}

export interface BilingualStringObject {
  en: string;
  ar: string;
}
