/* eslint-disable no-new,class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
const fetchMock = require('node-fetch');
const BaseConfigLoader = require('./BaseConfigLoader');

describe('BaseConfigLoader ', () => {
  const testUrl = 'http://www.example.com/cash-in';
  const testName = 'Test config loader';

  describe('when BaseConfigLoader is created', () => {
    it('should throw an error, if name is not provided', () => {
      expect(() => {
        new BaseConfigLoader(null, testUrl);
      }).toThrow('Config loader name not provided');
    });

    it('should throw an error, if url is not provided', () => {
      expect(() => {
        new BaseConfigLoader(testName);
      }).toThrow('Config loader url not provided');
    });

    it('should throw an error, if validation function is not implemented', () => {
      expect(() => {
        new BaseConfigLoader(testName, testUrl);
      }).toThrow('validate function not implemented');
    });

    it('should throw an error, if parseConfig function is not implemented', () => {
      expect(() => {
        class TestConfigLoader extends BaseConfigLoader {
          validate() {
          }
        }

        new TestConfigLoader(testName, testUrl);
      }).toThrow('parseConfig function not implemented');
    });
  });

  describe('when config is being loaded', () => {
    it('should throw loading error in case of server error', async () => {
      expect.assertions(1);

      fetchMock.mock(testUrl, 500);

      class TestConfigLoader extends BaseConfigLoader {
        validate() {
        }

        parseConfig() {
        }
      }

      const loader = new TestConfigLoader(testName, testUrl);

      await expect(loader.load()).rejects.toEqual(new Error(`Unable to load ${testName} configuration data`));

      fetchMock.restore();
    });

    it('should throw parsing error in case of invalid json', async () => {
      expect.assertions(1);

      fetchMock.mock(testUrl, 'Bad response');

      class TestConfigLoader extends BaseConfigLoader {
        validate() {
        }

        parseConfig() {
        }
      }

      const loader = new TestConfigLoader(testName, testUrl);
      await expect(loader.load()).rejects.toEqual(new Error('Test config loader configuration is not a json'));

      fetchMock.restore();
    });

    describe('when config is loaded', () => {
      class TestConfigLoader extends BaseConfigLoader {
        validate() {
        }

        parseConfig() {
        }
      }

      it('should validate loaded configuration', async () => {
        expect.assertions(1);

        const responseJSON = { some: 'json' };
        fetchMock.mock(testUrl, responseJSON);

        jest.spyOn(TestConfigLoader.prototype, 'validate');
        const loader = new TestConfigLoader(testName, testUrl);

        await loader.load();
        expect(TestConfigLoader.prototype.validate).toHaveBeenCalledWith(responseJSON);

        TestConfigLoader.prototype.validate.mockRestore();
        fetchMock.restore();
      });

      it('should parse loaded configuration', async () => {
        expect.assertions(1);

        const responseJSON = { some: 'json' };
        fetchMock.mock(testUrl, responseJSON);

        jest.spyOn(TestConfigLoader.prototype, 'parseConfig');
        const loader = new TestConfigLoader(testName, testUrl);

        await loader.load();
        expect(TestConfigLoader.prototype.parseConfig).toHaveBeenCalledWith(responseJSON);

        TestConfigLoader.prototype.parseConfig.mockRestore();
        fetchMock.restore();
      });

      it('should return parsed configuration', async () => {
        expect.assertions(1);

        const configPart = { value: 'value' };
        const responseJSON = { ...configPart, someValues: { valueA: 'a', valueB: 'b' } };
        fetchMock.mock(testUrl, responseJSON);

        TestConfigLoader.prototype.parseConfig = ({ value }) => ({ value });
        const loader = new TestConfigLoader(testName, testUrl);

        const parsedConfig = await loader.load();
        expect(parsedConfig).toEqual(configPart);
        fetchMock.restore();
      });
    });
  });
});
