// Within the template where you want to show your data
Template.postList.onCreated(function() {
  var self = this;
  var options = null; // Define non-time options
  Session.setDefault("limit", 7);
  self.subscribe("posts", {sort: {postedOn: -1}});
  // Subscribe to the data so everything is loaded into the client
  // Include relevant options to limit data but exclude timestamps

  // Create and initialise a reactive variable with the current date
  self.loadedTime = new ReactiveVar(new Date());
  // Create a reactive variable to see when new data is available
  // Create an autorun for whenever the subscription changes ready() state
  // Ignore the first run as ready() should be false
  // Subsequent false values indicate new data is arriving
  self.newData = new ReactiveVar(false);
  self.autorun(function(computation) {
    if(!computation.firstRun) {
      alert('Second Run');
      if(!self.subscriptionsReady) {
        self.newData.set(true);
      }
    }
  });
});

// Fetch the relevant data from that subscribed (cached) within the client
// Assume this will be within the template helper
// Use the value (get()) of the Reactive Variable
Template.postList.helpers({
  posts: function(){
    return Posts.find({}, {sort: {postedOn: -1}, limit: Session.get("limit")});
  },
  morePosts: function(){
    return Posts.find().count() > Session.get("limit");
  },
  ready: function(){
    return true;
  },
  displayedPosts: function() {
    return Posts.find({postedOn: {$lt: Template.instance().loadedTime.get()}}, {sort: {postedOn: -1}, limit: Session.get("limit")});
  },
  // Second helper to determine whether or not new data is available
  // Can be used in the template to notify the user
  newData: function() {
    var newestPost = Posts.find({},{sort: {postedOn: -1}, limit: 1});
    return newestPost.postedBy;
  }
});
Template.postList.events({
   'click .load-more': function(e){
     e.preventDefault;
    Session.set("limit", Session.get("limit") + 7);
  },
  'click .reLoad': function(event, template) {
    event.preventDefault;
    template.loadedTime.set(new Date());
  },
  'submit form': function(e){
      e.preventDefault();
      var user;
      if(Meteor.user()){
        user = Meteor.user().username;
      }
      else{
        user = ''
      }
      var post = {
        post: $(e.target).find('[name=post]').val(),
        postedBy: user,
        likes: 0,
        dislikes: 0,
        commentsCount: 0,
        views: 0,
        fb_shares: 0,
        tweets: 0
      }
      Posts.insert(post);
      Router.go('postList');
  }
 });
