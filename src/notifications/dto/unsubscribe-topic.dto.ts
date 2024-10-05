import { IsString, IsNotEmpty } from 'class-validator';

export class UnSubscribeTopicDto {
  @IsNotEmpty()
  @IsString()
  token: string;
  
  @IsString()
  topic?: string;
}
