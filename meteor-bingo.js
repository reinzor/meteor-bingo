// Init Collections and Schemas object
Collections = {}
Collections.Numbers = new Mongo.Collection("numbers");

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  url = url.toLowerCase(); // This is just to avoid case sensitiveness  
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

if (Meteor.isClient) {

  Template.main.helpers({
    numbers: function () {
      return Collections.Numbers.find({}, {limit: 4, sort: {timestamp: -1}}).fetch();
    },
    admin_view: function() {
      return getParameterByName("admin");
    }
  });

  Template.admin.events({
    'click button#remove': function () {
      Meteor.call("removeAllNumbers");
    },
    'click button#undo': function () {
      var lastElement = Collections.Numbers.findOne({}, {sort: {timestamp: -1}})
      if (lastElement)
      {
        Collections.Numbers.remove(lastElement._id);
      }
    },
    'submit .new-number': function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var number = parseInt(event.target.text.value);
 
      // Insert a task into the collection
      Collections.Numbers.insert({
        number: number,
        timestamp: (new Date).getTime() // current time
      });
 
      // Clear form
      event.target.text.value = "";
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    return Meteor.methods({

      removeAllNumbers: function() {

        return Collections.Numbers.remove({});

      }

    });
  });
}