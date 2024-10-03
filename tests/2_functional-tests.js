/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let testBookId;

chai.use(chaiHttp);

// chai
//   .request(server)
//   .keepOpen()
//   .post('/api/books')
//   .send({ title: "Filler Book 1" })
//   .end((req, res) => {
//     console.log(res.body)
//   });


// chai
//   .request(server)
//   .keepOpen()
//   .post('/api/books')
//   .send({ title: "Filler Book 2" })
//   .end((req, res) => {
//     console.log(res.body)
//   });

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  }).timeout(10000);
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({ title: "Greatest Book Ever" })
          .end((req, res) => {
            console.log("1) id value before assignment", res.body._id)
            testBookId = res.body._id;
            console.log("2) testBookId  after variable assignment", testBookId)
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Greatest Book Ever")
          });
        done();
      }).timeout(10000);

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({ title: "" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title')
          });
        done();
      });

    }).timeout(10000);


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
          });
        done();
      });

    }).timeout(10000);


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/404cba71b4bc82800d345404')
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
          });
        done();
      }).timeout(10000);


      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/' + testBookId)
          .end((req, res) => {
            console.log("3) just GET testBookId", testBookId);
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Greatest Book Ever");
            assert.equal(res.body._id, testBookId);
          });
        done();
      });
    }).timeout(10000);

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/' + testBookId)
          .send({ comments: "I will read this 100 times" })
          .end((req, res) => {
            console.log("4) just posted comment to testBookId", testBookId);
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Greatest Book Ever");
            assert.equal(res.body.comments, "I will read this 100 times");
          });
        done();
      }).timeout(10000);


      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/' + testBookId)
          .send({ comments: "" })
          .end((req, res) => {
            console.log("5) posted testBookId without comment", testBookId);
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
          });
        done();
      }).timeout(10000);


      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/404cba71b4bc82800d345404')
          .send({ comments: "I will read this 100 times" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
          });
        done();
      }).timeout(10000);
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/' + testBookId)
          .end((req, res) => {
            console.log("6) test just deleted testBookId", testBookId);
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
          });
        done();
      }).timeout(10000);

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/404cba71b4bc82800d345404')
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
          });
        done();
      });

    });

  });

});
