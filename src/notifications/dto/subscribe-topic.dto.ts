import { IsString, IsNotEmpty } from 'class-validator';

export class SubscribeTopicDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  topic: string;
}
