import {
    MainInstance,
    PublisherModel,
    SubscriptionModel,
    RequisitionModel,
    TestsAnalyzer,
    Test,
    ReportFormatter
} from 'enqueuer-plugins-template';
export class XunitReportFormatter implements ReportFormatter {
    private reportBuilder: any;
    private currentReportId: string = 'suite 1';
    public format(report: RequisitionModel): string {
        this.reportBuilder = require('junit-report-builder').newBuilder();
        this.buildTestSuite(report);
        return this.reportBuilder.build();
    }
    private buildTestSuite(report: RequisitionModel) {
        this.setCurrentReportId(report);
        if (this.hasTests(report)) {
            const suite = this.reportBuilder.testSuite().name(this.currentReportId);
            if (report.time) {
                suite.time(report.time.totalTime);
            }
            this.buildTestsFromReportObject(report, suite);
        }
        report.requisitions = report.requisitions || [];
        report.requisitions!.forEach((req: RequisitionModel) => this.buildTestSuite(req));
    }
    private setCurrentReportId(report: RequisitionModel) {
        if (typeof report.id === 'string' && report.id !== '') {
            this.currentReportId = report.id;
        }
    }
    private buildTestsFromReportObject(report: any, suite: any) {
        const testAnalyzer = new TestsAnalyzer(report);
        const testsNumber = testAnalyzer.getTests().length;
        if (testsNumber > 0) {
            testAnalyzer.getTests().forEach((test: Test) => {
               const testCase = suite.testCase();
               testCase.name(this.getTestName(test));
               if (!test.test.valid) {
                   testCase.failure(test.test.description);
               }
            });
        }
    }
    private getTestName(test: Test): string {
        let hierarchy: string = this.currentReportId;
        if (test.hierarchy !== null && test.hierarchy.length > 0) {
            hierarchy = test.hierarchy[test.hierarchy.length - 1];
            if (hierarchy.toLowerCase().includes('requisition #')) {
                hierarchy = this.currentReportId;
            }
        }
        const name = `${hierarchy}: ${test.test.name}`;
        return name;
    }
    private hasTests(report: RequisitionModel): boolean {
        report.tests = report.tests || [];
        report.subscriptions = report.subscriptions || [];
        report.publishers = report.publishers || [];
        let hasTests: boolean = false;
        hasTests = hasTests || report!.tests.length > 0;
        report!.publishers!.forEach((pub: PublisherModel) => {
            hasTests = pub!.tests!.length > 0;
        });
        report!.subscriptions!.forEach((sub: SubscriptionModel) => {
           hasTests = sub!.tests!.length > 0;
        });
        return hasTests;
    }

}

export function entryPoint(mainInstance: MainInstance): void {
    mainInstance.reportFormatterManager.addReportFormatter(() => new XunitReportFormatter(), 'xunit');
}