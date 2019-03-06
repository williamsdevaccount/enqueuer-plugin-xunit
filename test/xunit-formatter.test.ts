import {XunitReportFormatter} from '../src/xunit-formatter';
import * as fs from 'fs';

const getInputFile = (name: string): string => {
    const path = `./test/data/input/${name}.json`;
    return fs.readFileSync(path).toString();
};
const getOutputFile = (name: string): string => {
    const path = `./test/data/output/${name}.xml`;
    return fs.readFileSync(path).toString();
};
const trimXml = (xml: string): string => {
  return xml.replace(/\s/g, '');
};
const runFileTest = (fileName: string): void => {
    const formatter = new XunitReportFormatter();
    const input = JSON.parse(getInputFile(fileName));
    const output = trimXml(getOutputFile(fileName));
    const actual = trimXml(formatter.format(input));
    expect(actual).toEqual(output);
};
describe('XunitFormatterTests', () => {

    it('should correctly parse a single level of tests with no test failures', () => {
        const fileName = 'singlepass';
        runFileTest(fileName);
    });
    it('should correctly parse a single level of tests with failures', () => {
        const fileName = 'singlefail';
        runFileTest(fileName);
    });
    it('should correctly parse a multi level of tests with no failures', () => {
       const fileName = 'multiplepass';
       runFileTest(fileName);
    });
    it('should correctly parse a multi level of tests with failures', () => {
       const fileName = 'multiplefail';
       runFileTest(fileName);
    });
});