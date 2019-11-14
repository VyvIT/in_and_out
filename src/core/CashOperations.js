/**
 * Registry to delegate cash operations
 */
class CashOperations {
  constructor() {
    this.processors = {};
  }

  add(name, processor) {
    if (!processor.process) {
      throw new Error(`Cash operation processor ${name} must implement a process function`);
    }
    this.processors[name] = processor;
  }

  getProcessor(name) {
    return this.processors[name];
  }

  processorExists(name) {
    return !!this.getProcessor(name);
  }

  selectProcessorBy(data) {
    return data.type;
  }

  process(data) {
    const processorName = this.selectProcessorBy(data);
    if (this.processorExists(processorName)) {
      return this.getProcessor(processorName).process(data);
    }
    throw new Error('Unable to process the data, cash operation processor not found.');
  }
}

module.exports = CashOperations;
