import * as mask from 'json-mask';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import ITransformer from './transformer';

export default class JsonToJsonMaskedTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private maskInput: MaskInput, private maskConverter: MaskConverter) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: object },
    {
      filters,
    }: {
      filters?: string[];
    }
  ): { [key: string]: object } {
    const { tags, ...translations } = source;
    if (filters && filters.length) {
      const maskInput = this.maskInput.convert(filters);
      const filtersMask = this.maskConverter.convert(maskInput, tags);
      const maskedTranslations = mask(translations, filtersMask);

      return maskedTranslations;
    }
    return translations;
  }
}