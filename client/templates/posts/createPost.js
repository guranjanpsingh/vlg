Template.createPost.events({
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
      comments: 0,
      views: 0,
      fb_shares: 0,
      tweets: 0
    }
    Posts.insert(post);
    Router.go('postList');
  }
});
