import TranslationsKeyGenerator from './translations.key-generator';

describe('getExtension', () => {
  it('does return proper key for given filters', () => {
    const translationsKeyGenerator = new TranslationsKeyGenerator();

    const result = translationsKeyGenerator.generateKey('x', ['test', 'test2', 'test3'], 'extension-xml');

    expect(result).toBe('x-test,test2,test3-extension-xml-0-0');
  });
  it('does return proper key for comments option', () => {
    const translationsKeyGenerator = new TranslationsKeyGenerator();

    const result = translationsKeyGenerator.generateKey('x', ['test', 'test2', 'test3'], 'extension-xml', false, true);

    expect(result).toBe('x-test,test2,test3-extension-xml-0-1');
  });
  it('does return proper key for keepLocale option', () => {
    const translationsKeyGenerator = new TranslationsKeyGenerator();

    const result = translationsKeyGenerator.generateKey('x', ['test', 'test2', 'test3'], 'extension-xml', true, false);

    expect(result).toBe('x-test,test2,test3-extension-xml-1-0');
  });
});
