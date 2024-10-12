import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

export class CreateNotificationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BilingualString)
  title: BilingualString;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BilingualString)
  body: BilingualString;
}
