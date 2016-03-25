'use strict';
/* global Parse */

// Parse.Cloud.afterSave(Parse.User, function(request) {
//   Parse.Cloud.useMasterKey();
//   var installationsQ = new Parse.Query(Parse.Installation)
//     .equalTo('user', request.object)
//     .find();
//   var scheduleQ = request.object.relation('mySchedule')
//     .query()
//     .select(['id'])
//     .find();
//   Parse.Promise.when(installationsQ, scheduleQ)
//     .then(function(installations, schedule) {
//       console.log('Found ' + installations.length + ' installations and ' +
//         schedule.length + ' sessions in schedule');
//       var sessionIds = schedule.map(function(s) { return 'session_' + s.id; });
//       console.log(sessionIds);
//       return Parse.Promise.when(installations.map(function(installation) {
//         installation.set('channels', sessionIds);
//         return installation.save();
//       }));
//     })
//     .then(
//       function() {
//         console.log('Updated ' + arguments.length + ' installations');
//       },
//       function(errors) {
//         if (Array.isArray(errors)) {
//           for (var i = 0; i < errors.length; i++) {
//             console.error('Error! #' + i + ' ' + errors[i].message || errors[i]);
//           }
//         } else {
//           console.error('Error! ' + errors.message || errors);
//         }
//       }
//     );
// });
//
// Parse.Cloud.beforeSave(Parse.Installation, function(request, response) {
//   var installation = request.object;
//   var user = installation.get('user');
//   if (installation.dirtyKeys().indexOf('user') === -1) {
//     response.success();
//     return;
//   }
//
//   if (user) {
//     console.log('Set user, will fetch sessions');
//     user.relation('mySchedule')
//       .query()
//       .select(['id'])
//       .find()
//       .then(function(schedule) {
//         var sessionIds = schedule.map(function(s) { return 'session_' + s.id; });
//         installation.set('channels', sessionIds);
//         console.log('Updated channels to ' + installation.get('channels').join(', '));
//         response.success();
//       });
//   } else {
//     console.log('No user, will empty channels');
//     installation.set('channels', []);
//     response.success();
//   }
// });


Parse.Cloud.job('installationSync', function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;

  new Parse.Query(Parse.Installation)
    .each(function(installation) {
      return findUserChannels(installation.get('user'))
        .then(function(channels) {
          counter++;
          if (counter % 10 === 0) {
            status.message(counter + ' installations processed.');
          }
          installation.set('channels', channels);
          return installation.save();
        });
    })
    .then(function() {
      status.success('Sync finished successfully');
    }, function(error) {
      console.error(error);
      status.error('Error! ' + error.message);
    });
});

function findUserChannels(user) {
  if (!user) {
    return Parse.Promise.as([]);
  }

  return user.relation('mySchedule')
    .query()
    .select(['id'])
    .find()
    .then(function(schedule) {
      return schedule.map(function(s) { return 'session_' + s.id; });
    });
}
