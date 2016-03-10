'use strict';
/* global Parse */

var Survey = Parse.Object.extend('Survey');
var SurveyResult = Parse.Object.extend('SurveyResult');

Parse.Cloud.define('surveys', function(request, response) {
  Parse.Cloud.useMasterKey();

  var user = request.user;
  if (!user) {
    return response.error({message: 'Not logged in'});
  }

  new Parse.Query(SurveyResult)
    .equalTo('user', user)
    .equalTo('rawAnswers', null)
    .include('survey')
    .include('survey.session')
    .find()
    .then(toSurveys)
    .then(
      function(value) { response.success(value); },
      function(error) { response.error(error); }
    );
});

Parse.Cloud.define('submit_survey', function(request, response) {
  Parse.Cloud.useMasterKey();

  var user = request.user;
  if (!user) {
    return response.error({message: 'Not logged in'});
  }

  var params = request.params;
  if (!params.id || !params.answers) {
    return response.error({message: 'Need id and answers'});
  }

  new Parse.Query(SurveyResult)
    .equalTo('user', user)
    .equalTo('objectId', params.id)
    .find()
    .then(function(results) {
      if (results.length === 0) {
        throw new Error('No user/id combination found');
      }
      return results[0].save({
        a1: params.answers[0],
        a2: params.answers[1],
        rawAnswers: JSON.stringify(params.answers)
      });
    }).then(
      function(value) { response.success(value); },
      function(error) { response.error(error); }
    );
});

function toSurveys(emptyResults) {
  return emptyResults.map(function(emptyResult) {
    var survey = emptyResult.get('survey');
    return {
      id: emptyResult.id,
      sessionId: survey.get('session').id,
      questions: [{
        text: survey.get('q1'),
        lowLabel: 'Not at all',
        highLabel: 'Very useful',
      }, {
        text: survey.get('q2'),
        lowLabel: 'Not likely',
        highLabel: 'Very likely',
      }]
    }
  });
}
