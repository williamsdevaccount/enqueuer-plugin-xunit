import * as formatter from './xunit-formatter';
import {MainInstance} from 'enqueuer-plugins-template';

export function entryPoint(mainInstance: MainInstance): void {
    formatter.entryPoint(mainInstance);
}
