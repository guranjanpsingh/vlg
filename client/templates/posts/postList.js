// Within the template where you want to show your data
Template.postList.onCreated(function() {
  var self = this;
  var options = null; // Define non-time options
  Session.setDefault("limit", 7);
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
    var loaded = self.loadedTime.get();
    var sub = self.subscribe("posts", Session.get("limit"));
    self.posts = function(){
      return Posts.find({postedOn: {$lte: self.loadedTime.get()}}, {sort: {postedOn: -1}, limit: Session.get("limit")});
    }
    if(!computation.firstRun) {
      if(self.subscriptionsReady) {
        self.newData.set(true);
      }
    }
  });

});


Template.postList.helpers({
  morePosts: function(){
    return Posts.find().count() >= Session.get("limit");
  },
  ready: function(){
    return true;
  },
  displayedPosts: function() {
    console.log(Template.instance().posts().count());
    return Template.instance().posts();
  },
  // Second helper to determine whether or not new data is available
  // Can be used in the template to notify the user
  newData: function() {
    var newestPost = Posts.find({},{sort: {postedOn: -1}, limit: 1});
    return newestPost.postedBy;
  },
  newPostCount: function(){
    return Posts.find().count() - Posts.find({postedOn: {$lte : Template.instance().loadedTime.get()}}).count();
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
  'submit form': function(e, template){
      e.preventDefault();
      var user;
      if(Meteor.user()){
        user = Meteor.userId().username;
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
      $('.reLoad').click();
  }
 });


 $(window).scroll(function () {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
       Session.set("limit", Session.get("limit") + 7);
    }
 });
