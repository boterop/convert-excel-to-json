'use strict';

const excelToJson = require('../');
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

// This Excel contains dummy data and it was generated by https://www.mockaroo.com
const sourceFile = `${__dirname}/test-data.xlsx`.replace(/\\/g, '/');
const sourceBuffer = fs.readFileSync(sourceFile);

describe('Conversion', function () {
  it("should throw an error if no 'sourceFile' or 'source' is defined in config", function () {
    assert.throws(() => excelToJson({}), Error);
  });

  describe('Simple :: having an Object Literal as a param', function () {
    simple({
      sourceFile: sourceFile,
    });
  });

  describe('Simple :: having a JSON String as a param', function () {
    simple(`{
			"sourceFile": "${sourceFile}"
		}`);
  });

  describe('Simple :: having a Buffer as a source', function () {
    simple({
      source: sourceBuffer,
    });
  });

  describe('"sheets" config', function () {
    describe('get "sheet1" and "sheet2" configuring "sheets" with an array of string and object', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          'sheet1',
          {
            name: 'sheet2',
          },
        ],
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      it('should have two result sets (Object with two keys)', function () {
        assert.equal(Object.keys(jsonResult).length, 2);
      });

      describe('sheet1', function () {
        it('should have a key named "sheet1"', function () {
          assert.notEqual(jsonResult.sheet1, undefined);
        });

        describe('result data', function () {
          it('should have 25 "rows"', function () {
            assert.equal(jsonResult.sheet1.length, 25);
          });

          it('should have the following keys "A", "B", "C", "D", "E", "F"', function () {
            assert.deepEqual(
              ['A', 'B', 'C', 'D', 'E', 'F'],
              Object.keys(jsonResult.sheet1[0]),
            );
          });

          it('should have the header values (first row) on the first "row"', function () {
            assert.deepEqual(
              {
                A: 'id',
                B: 'first_name',
                C: 'last_name',
                D: 'email',
                E: 'gender',
                F: 'ip_address',
              },
              jsonResult.sheet1[0],
            );
          });

          it('should have the header values on the first position', function () {
            assert.deepEqual(
              {
                A: 'id',
                B: 'first_name',
                C: 'last_name',
                D: 'email',
                E: 'gender',
                F: 'ip_address',
              },
              jsonResult.sheet1[0],
            );
          });

          it('should have the last row data on the last position', function () {
            assert.deepEqual(
              {
                A: '24',
                B: 'Debra',
                C: 'Oliver',
                D: 'dolivern@yolasite.com',
                E: 'Female',
                F: '187.87.117.203',
              },
              jsonResult.sheet1[jsonResult.sheet1.length - 1],
            );
          });
        });
      });

      describe('sheet2', function () {
        it('should have a key named "sheet2"', function () {
          assert.notEqual(jsonResult.sheet2, undefined);
        });

        describe('result data', function () {
          it('should have 27 "rows"', function () {
            assert.equal(jsonResult.sheet2.length, 27);
          });

          it('should have the following keys "A", "B", "C", "D", "E", "F"', function () {
            assert.deepEqual(
              ['A', 'B', 'C', 'D', 'E', 'F'],
              Object.keys(jsonResult.sheet2[0]),
            );
          });

          it('should have the header values (forst row) on the first position', function () {
            assert.deepEqual(
              {
                A: 'id',
                B: 'first_name',
                C: 'last_name',
                D: 'email',
                E: 'gender',
                F: 'ip_address',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the last row data on the last position', function () {
            assert.deepEqual(
              {
                A: '50',
                B: 'Susan',
                C: 'Miller',
                D: 'smiller1d@china.com.cn',
                E: 'Female',
                F: '244.232.244.90',
              },
              jsonResult.sheet2[jsonResult.sheet2.length - 1],
            );
          });
        });
      });
    });

    describe('get only "sheet2" configuring with an array of strings', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: ['sheet2'],
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      it('should have one result set (Object with one key)', function () {
        assert.equal(Object.keys(jsonResult).length, 1);
      });

      describe('sheet1', function () {
        it('should not have a key named "sheet1"', function () {
          assert.equal(jsonResult.sheet1, undefined);
        });
      });

      describe('sheet2', function () {
        it('should have a key named "sheet2"', function () {
          assert.notEqual(jsonResult.sheet2, undefined);
        });

        describe('result data', function () {
          it('should have 27 "rows"', function () {
            assert.equal(jsonResult.sheet2.length, 27);
          });

          it('should have the following keys "A", "B", "C", "D", "E", "F"', function () {
            assert.deepEqual(
              ['A', 'B', 'C', 'D', 'E', 'F'],
              Object.keys(jsonResult.sheet2[0]),
            );
          });

          it('should have the header values on the first "row"', function () {
            assert.deepEqual(
              {
                A: 'id',
                B: 'first_name',
                C: 'last_name',
                D: 'email',
                E: 'gender',
                F: 'ip_address',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the header values on the first position', function () {
            assert.deepEqual(
              {
                A: 'id',
                B: 'first_name',
                C: 'last_name',
                D: 'email',
                E: 'gender',
                F: 'ip_address',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the last row data on the last position', function () {
            assert.deepEqual(
              {
                A: 50,
                B: 'Susan',
                C: 'Miller',
                D: 'smiller1d@china.com.cn',
                E: 'Female',
                F: '244.232.244.90',
              },
              jsonResult.sheet2[jsonResult.sheet2.length - 1],
            );
          });
        });
      });
    });

    describe('get only "sheet2" configuring with "header.rows"', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet2',
            header: {
              rows: 1,
            },
          },
        ],
      });

      it('should not have the header values on the first position', function () {
        assert.notDeepEqual(
          {
            A: 'id',
            B: 'first_name',
            C: 'last_name',
            D: 'email',
            E: 'gender',
            F: 'ip_address',
          },
          jsonResult.sheet2[0],
        );
      });
    });

    describe('get only "sheet2" configuring with "columToKey" and "header.rows" within "sheets"', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet2',
            header: {
              rows: 1,
            },
            columnToKey: {
              A: 'id',
              B: 'firstName',
              D: 'email',
            },
          },
        ],
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      it('should have one result set (Object with one key)', function () {
        assert.equal(Object.keys(jsonResult).length, 1);
      });

      describe('sheet1', function () {
        it('should not have a key named "sheet1"', function () {
          assert.equal(jsonResult.sheet1, undefined);
        });
      });

      describe('sheet2', function () {
        it('should have a key named "sheet2"', function () {
          assert.notEqual(jsonResult.sheet2, undefined);
        });

        describe('result data', function () {
          it('should have 26 "rows"', function () {
            assert.equal(jsonResult.sheet2.length, 26);
          });

          it('should have the following keys "id", "firstName", "email"', function () {
            assert.deepEqual(
              ['id', 'firstName', 'email'],
              Object.keys(jsonResult.sheet2[0]),
            );
          });

          it('should have the keys found on the header (first row)', function () {
            assert.notDeepEqual(
              {
                id: 'id',
                firstName: 'first_name',
                email: 'email',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the first row on the first position', function () {
            assert.deepEqual(
              {
                id: '25',
                firstName: 'Jack',
                email: 'jbishopo@businessinsider.com',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the last row data on the last position', function () {
            assert.deepEqual(
              {
                id: '50',
                firstName: 'Susan',
                email: 'smiller1d@china.com.cn',
              },
              jsonResult.sheet2[jsonResult.sheet2.length - 1],
            );
          });
        });
      });
    });

    describe('get only "sheet2" configuring with "columToKey" using cell variables (e.g. {{A1}})', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet2',
          },
        ],
        header: {
          rows: 1,
        },
        columnToKey: {
          A: '{{A1}}',
          B: '{{B1}}',
          D: '{{D1}}',
        },
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      it('should have one result set (Object with one key)', function () {
        assert.equal(Object.keys(jsonResult).length, 1);
      });

      describe('sheet1', function () {
        it('should not have a key named "sheet1"', function () {
          assert.equal(jsonResult.sheet1, undefined);
        });
      });

      describe('sheet2', function () {
        it('should have a key named "sheet2"', function () {
          assert.notEqual(jsonResult.sheet2, undefined);
        });

        describe('result data', function () {
          it('should have 26 "rows"', function () {
            assert.equal(jsonResult.sheet2.length, 26);
          });

          it('should have the keys found on the header (first row)', function () {
            assert.deepEqual(
              ['id', 'first_name', 'email'],
              Object.keys(jsonResult.sheet2[0]),
            );
          });

          it('should not have the header values on the first position', function () {
            assert.notDeepEqual(
              {
                id: 'id',
                first_name: 'first_name',
                email: 'email',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the first row on the first position', function () {
            assert.deepEqual(
              {
                id: '25',
                first_name: 'Jack',
                email: 'jbishopo@businessinsider.com',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the last row data on the last position', function () {
            assert.deepEqual(
              {
                id: '50',
                first_name: 'Susan',
                email: 'smiller1d@china.com.cn',
              },
              jsonResult.sheet2[jsonResult.sheet2.length - 1],
            );
          });
        });
      });
    });

    describe('get only "sheet2" configuring with "columToKey" and "header.rows" out of "sheets", within root config object', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet2',
          },
        ],
        header: {
          rows: 1,
        },
        columnToKey: {
          A: 'id',
          B: 'firstName',
          D: 'email',
        },
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      it('should have one result set (Object with one key)', function () {
        assert.equal(Object.keys(jsonResult).length, 1);
      });

      describe('sheet1', function () {
        it('should not have a key named "sheet1"', function () {
          assert.equal(jsonResult.sheet1, undefined);
        });
      });

      describe('sheet2', function () {
        it('should have a key named "sheet2"', function () {
          assert.notEqual(jsonResult.sheet2, undefined);
        });

        describe('result data', function () {
          it('should have 26 "rows"', function () {
            assert.equal(jsonResult.sheet2.length, 26);
          });

          it('should have the keys found on the header (first row)', function () {
            assert.deepEqual(
              ['id', 'firstName', 'email'],
              Object.keys(jsonResult.sheet2[0]),
            );
          });

          it('should not have the header values (first row) on the first position', function () {
            assert.notDeepEqual(
              {
                id: 'id',
                firstName: 'first_name',
                email: 'email',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the first row on the first position', function () {
            assert.deepEqual(
              {
                id: '25',
                firstName: 'Jack',
                email: 'jbishopo@businessinsider.com',
              },
              jsonResult.sheet2[0],
            );
          });

          it('should have the last row data on the last position', function () {
            assert.deepEqual(
              {
                id: '50',
                firstName: 'Susan',
                email: 'smiller1d@china.com.cn',
              },
              jsonResult.sheet2[jsonResult.sheet2.length - 1],
            );
          });
        });
      });
    });

    describe('get only "sheet2" configuring with "columToKey" using the special key "*" (all columns) and the special cell variable {{columnHeader}} (the value present on the current columnHeader)', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet2',
          },
        ],
        header: {
          rows: 1,
        },
        columnToKey: {
          '*': '{{columnHeader}}',
        },
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      it('should have one result set (Object with one key)', function () {
        assert.equal(Object.keys(jsonResult).length, 1);
      });

      describe('sheet1', function () {
        it('should not have a key named "sheet1"', function () {
          assert.equal(jsonResult.sheet1, undefined);
        });
      });

      describe('sheet2', function () {
        it('should have a key named "sheet2"', function () {
          assert.notEqual(jsonResult.sheet2, undefined);
        });

        describe('result data', function () {
          it('should have 26 "rows"', function () {
            assert.equal(jsonResult.sheet2.length, 26);
          });

          it('should have the keys found on the header (first row)', function () {
            assert.deepEqual(
              [
                'id',
                'first_name',
                'last_name',
                'email',
                'gender',
                'ip_address',
              ],
              Object.keys(jsonResult.sheet2[0]),
            );
          });
        });
      });
    });

    describe('get only "sheet3" configuring with "includeEmptyLines"', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet3',
          },
        ],
        header: {
          rows: 0,
        },
        includeEmptyLines: true,
      });

      // console.log(jsonResult.sheet3);

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      describe('sheet1', function () {
        it('should not have a key named "sheet1"', function () {
          assert.equal(jsonResult.sheet1, undefined);
        });
      });

      describe('sheet3', function () {
        it('should have a key named "sheet3"', function () {
          assert.notEqual(jsonResult.sheet3, undefined);
        });

        describe('result data', function () {
          it('should have 23 "rows"', function () {
            assert.equal(jsonResult.sheet3.length, 23);
          });

          it('should not have any data in first row', function () {
            assert.equal(undefined, jsonResult.sheet3[0]);
          });

          it('should have the header values on the second position', function () {
            assert.deepStrictEqual(
              {
                A: 'id',
                B: 'first_name',
                C: 'last_name',
                D: 'email',
                E: 'gender',
                F: 'ip_address',
              },
              jsonResult.sheet3[1],
            );
          });

          it('should not have any data in fourth row', function () {
            assert.equal(undefined, jsonResult.sheet3[3]);
          });

          it('should not consider a row as empty if one or more cell has spaces', function () {
            assert.deepStrictEqual(
              {
                A: '  ',
                B: '     ',
                C: '     ',
                D: '     ',
                E: '     ',
              },
              jsonResult.sheet3[16],
            );
          });
        });
      });
    });

    describe('get only "sheet3" configuring with "sheetStubs"', function () {
      const jsonResult = excelToJson({
        sourceFile: sourceFile,
        sheets: [
          {
            name: 'sheet3',
          },
        ],
        header: {
          rows: 0,
        },
        includeEmptyLines: false,
        sheetStubs: true,
      });

      it('should be an Object', function () {
        assert.equal(jsonResult.constructor, Object);
      });

      describe('sheet3', function () {
        it('should have a key named "sheet3"', function () {
          assert.notEqual(jsonResult.sheet3, undefined);
        });

        describe('result data', function () {
          it('should have null surname on one before last position', function () {
            assert.deepStrictEqual(
              {
                A: 42,
                B: 'Kenneth',
                C: null,
                D: 'kduncan15@people.com.cn',
                E: 'Male',
                F: '105.112.16.103',
              },
              jsonResult.sheet3[jsonResult.sheet3.length - 2],
            );
          });
        });
      });
    });
  });
});

describe('Execution via CLI', function () {
  const cliPath = path.resolve(`${__dirname}/../bin/cli.js`);
  const sourceFileTest = path.resolve(`${__dirname}/../tests/test-data.xlsx`);
  const expectedResult = `{"sheet1":[{"A":"id","B":"first_name","C":"last_name","D":"email","E":"gender","F":"ip_address"},{"A":1,"B":"Judith","C":"Bennett","D":"jbennett0@cargocollective.com","E":"Female","F":"190.37.72.226"},{"A":2,"B":"Denise","C":"Ramirez","D":"dramirez1@woothemes.com","E":"Female","F":"13.63.225.90"},{"A":3,"B":"Antonio","C":"Henderson","D":"ahenderson2@mapquest.com","E":"Male","F":"186.224.18.54"},{"A":4,"B":"Matthew","C":"Jacobs","D":"mjacobs3@hatena.ne.jp","E":"Male","F":"71.115.204.8"},{"A":5,"B":"Jacqueline","C":"Hawkins","D":"jhawkins4@usatoday.com","E":"Female","F":"112.161.144.113"},{"A":6,"B":"Betty","C":"George","D":"bgeorge5@cnbc.com","E":"Female","F":"151.9.214.150"},{"A":7,"B":"Nicholas","C":"Cole","D":"ncole6@digg.com","E":"Male","F":"130.113.34.123"},{"A":8,"B":"Christina","C":"Fields","D":"cfields7@icio.us","E":"Female","F":"158.175.78.96"},{"A":9,"B":"John","C":"Cole","D":"jcole8@github.com","E":"Male","F":"87.198.248.122"},{"A":10,"B":"Carolyn","C":"Marshall","D":"cmarshall9@acquirethisname.com","E":"Female","F":"169.241.125.206"},{"A":11,"B":"Albert","C":"Schmidt","D":"aschmidta@imdb.com","E":"Male","F":"82.36.174.49"},{"A":12,"B":"Lillian","C":"Bennett","D":"lbennettb@ca.gov","E":"Female","F":"227.130.226.191"},{"A":13,"B":"Kathy","C":"Payne","D":"kpaynec@mozilla.org","E":"Female","F":"189.92.180.236"},{"A":14,"B":"Jack","C":"Ferguson","D":"jfergusond@youku.com","E":"Male","F":"237.228.12.35"},{"A":15,"B":"Jean","C":"Gordon","D":"jgordone@tinypic.com","E":"Female","F":"82.238.48.246"},{"A":16,"B":"John","C":"Clark","D":"jclarkf@google.com","E":"Male","F":"43.126.79.189"},{"A":17,"B":"Pamela","C":"Gilbert","D":"pgilbertg@china.com.cn","E":"Female","F":"22.163.47.237"},{"A":18,"B":"Deborah","C":"Banks","D":"dbanksh@umn.edu","E":"Female","F":"221.123.73.42"},{"A":19,"B":"Emily","C":"Hamilton","D":"ehamiltoni@craigslist.org","E":"Female","F":"30.169.177.251"},{"A":20,"B":"Katherine","C":"Jones","D":"kjonesj@behance.net","E":"Female","F":"228.11.87.66"},{"A":21,"B":"Ruby","C":"Stanley","D":"rstanleyk@w3.org","E":"Female","F":"60.65.225.158"},{"A":22,"B":"Juan","C":"Pierce","D":"jpiercel@miitbeian.gov.cn","E":"Male","F":"116.251.134.70"},{"A":23,"B":"Rachel","C":"Long","D":"rlongm@usnews.com","E":"Female","F":"137.30.106.203"},{"A":24,"B":"Debra","C":"Oliver","D":"dolivern@yolasite.com","E":"Female","F":"187.87.117.203"}],"sheet2":[{"A":"id","B":"first_name","C":"last_name","D":"email","E":"gender","F":"ip_address"},{"A":25,"B":"Jack","C":"Bishop","D":"jbishopo@businessinsider.com","E":"Male","F":"154.11.84.148"},{"A":26,"B":"Alice","C":"Cook","D":"acookp@theatlantic.com","E":"Female","F":"253.251.171.169"},{"A":27,"B":"Denise","C":"Hart","D":"dhartq@free.fr","E":"Female","F":"41.7.18.202"},{"A":28,"B":"Susan","C":"Oliver","D":"soliverr@narod.ru","E":"Female","F":"30.73.25.111"},{"A":29,"B":"Christopher","C":"Watson","D":"cwatsons@ibm.com","E":"Male","F":"237.207.183.205"},{"A":30,"B":"Howard","C":"Ray","D":"hrayt@typepad.com","E":"Male","F":"110.31.192.119"},{"A":31,"B":"Doris","C":"Banks","D":"dbanksu@tripod.com","E":"Female","F":"93.158.23.15"},{"A":32,"B":"Tammy","C":"Duncan","D":"tduncanv@who.int","E":"Female","F":"36.223.211.101"},{"A":33,"B":"Brandon","C":"Nelson","D":"bnelsonw@nsw.gov.au","E":"Male","F":"149.230.247.47"},{"A":34,"B":"Janice","C":"Banks","D":"jbanksx@reverbnation.com","E":"Female","F":"225.10.207.129"},{"A":35,"B":"Randy","C":"Gardner","D":"rgardnery@cdc.gov","E":"Male","F":"136.250.243.202"},{"A":36,"B":"Denise","C":"Burton","D":"dburtonz@timesonline.co.uk","E":"Female","F":"254.185.104.57"},{"A":37,"B":"Paul","C":"Rogers","D":"progers10@npr.org","E":"Male","F":"188.219.107.207"},{"A":38,"B":"Johnny","C":"Fernandez","D":"jfernandez11@amazonaws.com","E":"Male","F":"233.164.136.180"},{"A":39,"B":"Jane","C":"Mason","D":"jmason12@phpbb.com","E":"Female","F":"156.240.141.240"},{"A":40,"B":"Scott","C":"Day","D":"sday13@prnewswire.com","E":"Male","F":"154.188.18.107"},{"A":41,"B":"Philip","C":"White","D":"pwhite14@exblog.jp","E":"Male","F":"73.100.195.152"},{"A":42,"B":"Kenneth","C":"Duncan","D":"kduncan15@people.com.cn","E":"Male","F":"105.112.16.103"},{"A":43,"B":"Joseph","C":"Price","D":"jprice16@cmu.edu","E":"Male","F":"33.92.219.103"},{"A":44,"B":"Edward","C":"Howard","D":"ehoward17@businessinsider.com","E":"Male","F":"38.179.117.21"},{"A":45,"B":"Frances","C":"Wells","D":"fwells18@slashdot.org","E":"Female","F":"75.126.73.137"},{"A":46,"B":"Ashley","C":"Davis","D":"adavis19@slideshare.net","E":"Female","F":"73.140.223.76"},{"A":47,"B":"Clarence","C":"Hicks","D":"chicks1a@epa.gov","E":"Male","F":"92.13.200.140"},{"A":48,"B":"Sharon","C":"Stone","D":"sstone1b@biblegateway.com","E":"Female","F":"38.83.41.214"},{"A":49,"B":"Scott","C":"Shaw","D":"sshaw1c@senate.gov","E":"Male","F":"84.180.189.90"},{"A":50,"B":"Susan","C":"Miller","D":"smiller1d@china.com.cn","E":"Female","F":"244.232.244.90"}],"sheet3":[{"A":"id","B":"first_name","C":"last_name","D":"email","E":"gender","F":"ip_address"},{"A":25,"B":"Jack","C":"Bishop","D":"jbishopo@businessinsider.com","E":"Male","F":"154.11.84.148"},{"A":26,"B":"Alice","C":"Cook","D":"acookp@theatlantic.com","E":"Female","F":"253.251.171.169"},{"A":27,"B":"Denise","C":"Hart","D":"dhartq@free.fr","E":"Female","F":"41.7.18.202"},{"A":28,"B":"Susan","C":"Oliver","D":"soliverr@narod.ru","E":"Female","F":"30.73.25.111"},{"A":29,"B":"Christopher","C":"Watson","D":"cwatsons@ibm.com","E":"Male","F":"237.207.183.205"},{"A":30,"B":"Howard","C":"Ray","D":"hrayt@typepad.com","E":"Male","F":"110.31.192.119"},{"A":31,"B":"Doris","C":"Banks","D":"dbanksu@tripod.com","E":"Female","F":"93.158.23.15"},{"A":32,"B":"Tammy","C":"Duncan","D":"tduncanv@who.int","E":"Female","F":"36.223.211.101"},{"A":33,"B":"Brandon","C":"Nelson","D":"bnelsonw@nsw.gov.au","E":"Male","F":"149.230.247.47"},{"A":34,"B":"Janice","C":"Banks","D":"jbanksx@reverbnation.com","E":"Female","F":"225.10.207.129"},{"A":35,"B":"Randy","C":"Gardner","D":"rgardnery@cdc.gov","E":"Male","F":"136.250.243.202"},{"A":36,"B":"Denise","C":"Burton","D":"dburtonz@timesonline.co.uk","E":"Female","F":"254.185.104.57"},{"A":37,"B":"Paul","C":"Rogers","D":"progers10@npr.org","E":"Male","F":"188.219.107.207"},{"A":"  ","B":"     ","C":"     ","D":"     ","E":"     "},{"A":38,"B":"Johnny","C":"Fernandez","D":"jfernandez11@amazonaws.com","E":"Male","F":"233.164.136.180"},{"A":39,"B":"Jane","C":"Mason","D":"jmason12@phpbb.com","E":"Female","F":"156.240.141.240"},{"A":40,"B":"Scott","C":"Day","D":"sday13@prnewswire.com","E":"Male","F":"154.188.18.107"},{"A":41,"B":"Philip","C":"White","D":"pwhite14@exblog.jp","E":"Male","F":"73.100.195.152"},{"A":42,"B":"Kenneth","D":"kduncan15@people.com.cn","E":"Male","F":"105.112.16.103"},{"A":43,"B":"Joseph","C":"Price","D":"jprice16@cmu.edu","E":"Male","F":"33.92.219.103"}]}`;

  it('should work when passing in a JSON to --config', function (done) {
    child_process.exec(
      `${cliPath}  --config='{"sourceFile": "${sourceFileTest}"}' `,
      (err, stdout, stderr) => {
        const result = stdout.replace(RegExp(os.EOL, 'g'), '');
        assert.equal(result, expectedResult);
        done();
      },
    );
  });

  it('should work when passing a file path to --sourceFile', function (done) {
    child_process.exec(
      `${cliPath}  --sourceFile=${sourceFileTest}`,
      (err, stdout, stderr) => {
        const result = stdout.replace(RegExp(os.EOL, 'g'), '');
        assert.equal(result, expectedResult);
        done();
      },
    );
  });
});

function simple(config) {
  const jsonResult = excelToJson(config);

  it('should be an Object', function () {
    assert.equal(jsonResult.constructor, Object);
  });

  it('should have two result sets (Object with two keys)', function () {
    assert.equal(Object.keys(jsonResult).length, 3);
  });

  describe('sheet1', function () {
    it('should have a key named "sheet1"', function () {
      assert.notEqual(jsonResult.sheet1, undefined);
    });

    describe('result data', function () {
      it('should have 25 "rows"', function () {
        assert.equal(jsonResult.sheet1.length, 25);
      });

      it('should have the following keys "A", "B", "C", "D", "E", "F"', function () {
        assert.deepEqual(
          ['A', 'B', 'C', 'D', 'E', 'F'],
          Object.keys(jsonResult.sheet1[0]),
        );
      });

      it('should have the header values on the first position', function () {
        assert.deepEqual(
          {
            A: 'id',
            B: 'first_name',
            C: 'last_name',
            D: 'email',
            E: 'gender',
            F: 'ip_address',
          },
          jsonResult.sheet1[0],
        );
      });

      it('should have the last row data on the last position', function () {
        assert.deepStrictEqual(
          {
            A: 24,
            B: 'Debra',
            C: 'Oliver',
            D: 'dolivern@yolasite.com',
            E: 'Female',
            F: '187.87.117.203',
          },
          jsonResult.sheet1[jsonResult.sheet1.length - 1],
        );
      });
    });
  });

  describe('sheet2', function () {
    it('should have a key named "sheet2"', function () {
      assert.notEqual(jsonResult.sheet2, undefined);
    });

    describe('result data', function () {
      it('should have 27 "rows"', function () {
        assert.equal(jsonResult.sheet2.length, 27);
      });

      it('should have the following keys "A", "B", "C", "D", "E", "F"', function () {
        assert.deepEqual(
          ['A', 'B', 'C', 'D', 'E', 'F'],
          Object.keys(jsonResult.sheet2[0]),
        );
      });

      it('should have the header values on the first position', function () {
        assert.deepEqual(
          {
            A: 'id',
            B: 'first_name',
            C: 'last_name',
            D: 'email',
            E: 'gender',
            F: 'ip_address',
          },
          jsonResult.sheet2[0],
        );
      });

      it('should have the last row data on the last position', function () {
        assert.deepStrictEqual(
          {
            A: 50,
            B: 'Susan',
            C: 'Miller',
            D: 'smiller1d@china.com.cn',
            E: 'Female',
            F: '244.232.244.90',
          },
          jsonResult.sheet2[jsonResult.sheet2.length - 1],
        );
      });
    });
  });

  describe('sheet3', function () {
    it('should have a key named "sheet3"', function () {
      assert.notEqual(jsonResult.sheet3, undefined);
    });

    describe('result data', function () {
      it('should have 21 "rows"', function () {
        assert.equal(jsonResult.sheet3.length, 21);
      });

      it('should have the following keys "A", "B", "C", "D", "E", "F"', function () {
        assert.deepEqual(
          ['A', 'B', 'C', 'D', 'E', 'F'],
          Object.keys(jsonResult.sheet3[0]),
        );
      });

      it('should have the header values on the first position', function () {
        assert.deepEqual(
          {
            A: 'id',
            B: 'first_name',
            C: 'last_name',
            D: 'email',
            E: 'gender',
            F: 'ip_address',
          },
          jsonResult.sheet3[0],
        );
      });

      it('should have the last row data on the last position', function () {
        assert.deepStrictEqual(
          {
            A: 43,
            B: 'Joseph',
            C: 'Price',
            D: 'jprice16@cmu.edu',
            E: 'Male',
            F: '33.92.219.103',
          },
          jsonResult.sheet3[jsonResult.sheet3.length - 1],
        );
      });
    });
  });
}
