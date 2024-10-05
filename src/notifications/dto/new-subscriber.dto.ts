import { IsString, IsNotEmpty } from 'class-validator';

export class NewSubscriberDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  os: string;

  @IsNotEmpty()
  @IsString()
  osVersion: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
