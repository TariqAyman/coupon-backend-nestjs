import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

export class NotificationDataDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BilingualString)
  title: BilingualString;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BilingualString)
  body: BilingualString;
}
