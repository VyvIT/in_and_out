const fetch = require('node-fetch');

class BaseConfigLoader {
  constructor(name, url) {
    if (!name) {
      throw new Error('Config loader name not provided');
    }
    if (!url) {
      throw new Error('Config loader url not provided');
    }
    if (!this.validate) {
      throw new Error('validate function not implemented');
    }
    if (!this.parseConfig) {
      throw new Error('parseConfig function not implemented');
    }
    this.name = name;
    this.url = url;
  }

  async load() {
    const configResponse = await fetch(this.url);
    if (!configResponse.ok) {
      throw new Error(`Unable to load ${this.name} configuration data`);
    }

    let config;
    try {
      config = await configResponse.json();
    } catch (e) {
      throw new Error(`${this.name} configuration is not a json`);
    }

    this.validate(config);
    this.config = this.parseConfig(config);
    return this.config;
  }
}

module.exports = BaseConfigLoader;
