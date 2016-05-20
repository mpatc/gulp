'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Picup = mongoose.model('Picup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, picup;

/**
 * Picup routes tests
 */
describe('Picup CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Picup
    user.save(function () {
      picup = {
        name: 'Picup name'
      };

      done();
    });
  });

  it('should be able to save a Picup if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picup
        agent.post('/api/picups')
          .send(picup)
          .expect(200)
          .end(function (picupSaveErr, picupSaveRes) {
            // Handle Picup save error
            if (picupSaveErr) {
              return done(picupSaveErr);
            }

            // Get a list of Picups
            agent.get('/api/picups')
              .end(function (picupsGetErr, picupsGetRes) {
                // Handle Picup save error
                if (picupsGetErr) {
                  return done(picupsGetErr);
                }

                // Get Picups list
                var picups = picupsGetRes.body;

                // Set assertions
                (picups[0].user._id).should.equal(userId);
                (picups[0].name).should.match('Picup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Picup if not logged in', function (done) {
    agent.post('/api/picups')
      .send(picup)
      .expect(403)
      .end(function (picupSaveErr, picupSaveRes) {
        // Call the assertion callback
        done(picupSaveErr);
      });
  });

  it('should not be able to save an Picup if no name is provided', function (done) {
    // Invalidate name field
    picup.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picup
        agent.post('/api/picups')
          .send(picup)
          .expect(400)
          .end(function (picupSaveErr, picupSaveRes) {
            // Set message assertion
            (picupSaveRes.body.message).should.match('Please fill Picup name');

            // Handle Picup save error
            done(picupSaveErr);
          });
      });
  });

  it('should be able to update an Picup if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picup
        agent.post('/api/picups')
          .send(picup)
          .expect(200)
          .end(function (picupSaveErr, picupSaveRes) {
            // Handle Picup save error
            if (picupSaveErr) {
              return done(picupSaveErr);
            }

            // Update Picup name
            picup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Picup
            agent.put('/api/picups/' + picupSaveRes.body._id)
              .send(picup)
              .expect(200)
              .end(function (picupUpdateErr, picupUpdateRes) {
                // Handle Picup update error
                if (picupUpdateErr) {
                  return done(picupUpdateErr);
                }

                // Set assertions
                (picupUpdateRes.body._id).should.equal(picupSaveRes.body._id);
                (picupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Picups if not signed in', function (done) {
    // Create new Picup model instance
    var picupObj = new Picup(picup);

    // Save the picup
    picupObj.save(function () {
      // Request Picups
      request(app).get('/api/picups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Picup if not signed in', function (done) {
    // Create new Picup model instance
    var picupObj = new Picup(picup);

    // Save the Picup
    picupObj.save(function () {
      request(app).get('/api/picups/' + picupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', picup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Picup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/picups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Picup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Picup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Picup
    request(app).get('/api/picups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Picup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Picup if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picup
        agent.post('/api/picups')
          .send(picup)
          .expect(200)
          .end(function (picupSaveErr, picupSaveRes) {
            // Handle Picup save error
            if (picupSaveErr) {
              return done(picupSaveErr);
            }

            // Delete an existing Picup
            agent.delete('/api/picups/' + picupSaveRes.body._id)
              .send(picup)
              .expect(200)
              .end(function (picupDeleteErr, picupDeleteRes) {
                // Handle picup error error
                if (picupDeleteErr) {
                  return done(picupDeleteErr);
                }

                // Set assertions
                (picupDeleteRes.body._id).should.equal(picupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Picup if not signed in', function (done) {
    // Set Picup user
    picup.user = user;

    // Create new Picup model instance
    var picupObj = new Picup(picup);

    // Save the Picup
    picupObj.save(function () {
      // Try deleting Picup
      request(app).delete('/api/picups/' + picupObj._id)
        .expect(403)
        .end(function (picupDeleteErr, picupDeleteRes) {
          // Set message assertion
          (picupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Picup error error
          done(picupDeleteErr);
        });

    });
  });

  it('should be able to get a single Picup that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Picup
          agent.post('/api/picups')
            .send(picup)
            .expect(200)
            .end(function (picupSaveErr, picupSaveRes) {
              // Handle Picup save error
              if (picupSaveErr) {
                return done(picupSaveErr);
              }

              // Set assertions on new Picup
              (picupSaveRes.body.name).should.equal(picup.name);
              should.exist(picupSaveRes.body.user);
              should.equal(picupSaveRes.body.user._id, orphanId);

              // force the Picup to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Picup
                    agent.get('/api/picups/' + picupSaveRes.body._id)
                      .expect(200)
                      .end(function (picupInfoErr, picupInfoRes) {
                        // Handle Picup error
                        if (picupInfoErr) {
                          return done(picupInfoErr);
                        }

                        // Set assertions
                        (picupInfoRes.body._id).should.equal(picupSaveRes.body._id);
                        (picupInfoRes.body.name).should.equal(picup.name);
                        should.equal(picupInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Picup.remove().exec(done);
    });
  });
});
