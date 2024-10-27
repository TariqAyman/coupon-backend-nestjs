import slugify from 'slugify';
import {
  BilingualString,
  BilingualStringObject,
} from '../dto/bilingual-string.dto';

// Generate a basic slug
function generateSlug(name: string): string {
  return slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
}

// Append numbers to make the slug unique
export async function generateUniqueSlug(
  repository: any, // Pass the repository of the entity ex : (BrandRepository)
  name: BilingualStringObject,
  locale?: 'en' | 'ar',
): Promise<BilingualString> {
  let baseSlugAr = generateSlug(name.ar);
  let baseSlugEn = generateSlug(name.en);

  let slug = { en: baseSlugEn, ar: baseSlugAr }; // Default slug structure in both languages

  // Use a raw SQL query to check for slug existence using JSON_EXTRACT
  let existingSlug = await repository
    .createQueryBuilder('entity')
    .where(
      'JSON_EXTRACT(entity.slug, "$.en") = :en OR JSON_EXTRACT(entity.slug, "$.ar") = :ar',
      {
        en: slug.en,
        ar: slug.ar,
      },
    )
    .getOne();

  // If it exists, keep modifying the slug until it's unique
  let suffix = 1;
  while (existingSlug) {
    slug.en = `${baseSlugEn}-${suffix}`;
    slug.ar = `${baseSlugAr}-${suffix}`;
    existingSlug = await repository
      .createQueryBuilder('entity')
      .where(
        'JSON_EXTRACT(entity.slug, "$.en") = :en OR JSON_EXTRACT(entity.slug, "$.ar") = :ar',
        {
          en: slug.en,
          ar: slug.ar,
        },
      )
      .getOne();
    suffix++;
  }

  return slug;
}
