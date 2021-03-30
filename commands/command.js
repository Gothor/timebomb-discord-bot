module.exports = class Command {
  static parse(message) {
    if (this.matches(message)) {
      this.action(message);
      return true;
    }
    return false;
  }

  static matches(message) {
    throw new Exception('Not implemented');
  }

  static action(message) {
    throw new Exception('Not implemented');
  }
}
