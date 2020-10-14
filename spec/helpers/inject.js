const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('inject helper', function() {
    const context = {
        value1: "Big",
        value2: "Commerce",
        badChars: "&<>\"'`",
        jsonString: JSON.stringify({"big": "commerce"}),
        nested: {
            firstName: "&<>",
            lastName: "\"'`",
        }
    };

    const runTestCases = testRunner({context});

    it('should inject variables', function(done) {
        runTestCases([
            {
                input: "{{inject 'data1' value1}}{{inject 'data2' value2}}{{jsContext}}",
                output: '"{\\"data1\\":\\"Big\\",\\"data2\\":\\"Commerce\\"}"',
            },
        ], done);
    });

    it('should escape strings', function(done) {
        runTestCases([
            {
                input: "{{inject 'filtered' badChars}}{{jsContext}}",
                output: '"{\\"filtered\\":\\"&amp;&lt;&gt;&quot;&#x27;&#x60;\\"}"',
            }
        ], done);
    });

    it('should exclude JSON strings from filtering', function(done) {
        runTestCases([
            {
                input: "{{inject 'filtered' jsonString}}{{jsContext}}",
                output: '"{\\"filtered\\":\\"{\\\\\\"big\\\\\\":\\\\\\"commerce\\\\\\"}\\"}"',
            }
        ], done);
    });

    it('should escape strings nested in objects', function(done) {
        runTestCases([
            {
                input: "{{inject 'filtered' nested}}{{jsContext}}",
                output: '"{\\"filtered\\":{\\"firstName\\":\\"&amp;&lt;&gt;\\",\\"lastName\\":\\"&quot;&#x27;&#x60;\\"}}"',
            }
        ], done);
    });

});
