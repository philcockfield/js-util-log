import { log, COLORS, METHODS, ILogger } from '../src/log';
import { expect } from 'chai';
import { chalk } from './common';

describe('logging to console (NB: Tests hidden because this mucks with the console)', () => {
  let items: any[];
  let fnLog: (...values: any[]) => void;
  beforeEach(() => {
    fnLog = console.log;
    items = [];
    console.log = (value: any) => items.push(value);
  });
  afterEach(() => {
    console.log = fnLog;
    log.silent = false;
  });

  it('logs a single value', () => {
    log.info('info');
    log.warn('warn');
    log.error('error');
    expect(items[0]).to.equal('info');
    expect(items[1]).to.contain('warn');
    expect(items[2]).to.contain('error');
  });

  it('logs multiple parameter values', () => {
    log.info('my', 'info');
    log.warn('my', 'warn');
    log.error('my', 'error');

    expect(items[0]).to.equal('my info');
    expect(items[1]).to.contain('my warn');
    expect(items[2]).to.contain('my error');
  });

  it('is not silent by default', () => {
    expect(log.silent).to.equal(false);
  });

  it('does not log when silent', () => {
    log.silent = true;
    log.info(1);
    log.warn(2);
    log.error(3);
    expect(items).to.eql([]);
  });

  it('has a colors methods for each log method', () => {
    METHODS.forEach(method => {
      COLORS.forEach(color => {
        expect(log[method][color]).to.be.an.instanceof(Function);
        log[method][color]('abc');
        log[method][color]('foo', 'bar');
        expect(items[0]).to.contain('abc');
        expect(items[1]).to.contain('foo');
        expect(items[1]).to.contain('bar');
      });
    });
  });

  it('returns a string from color methods on root log function', async () => {
    COLORS.forEach(color => {
      const logColor = log[color] as ILogger;
      const result = logColor('foo');
      expect(result.length).to.be.greaterThan('foo'.length);
      expect(result).to.contain('foo');
    });
  });

  it('exposes raw color methods for formatting', () => {
    COLORS.forEach(color => {
      expect(log[color]('foo')).to.equal(chalk[color]('foo'));
    });
  });

  it('logs an error stack from all methods', () => {
    const err = new Error('Foo');
    log.info(err);
    const stack = err.stack as string;
    expect(items[0]).to.contain(stack);
  });

  it('converts errors to red', () => {
    const red = chalk.red('red');
    log.error('red');
    expect(items[0]).to.equal(red);
  });

  it('logs an empty object {}', () => {
    log.info('hello', {});
    fnLog(items);
  });
});
