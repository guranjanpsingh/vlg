Template.post.helpers({
  posted: function(){
    return moment(this.postedOn).format("hh:mmA MMMM Do, YYYY");
  },
  postedRelative: function(){
    return moment(this.postedOn).fromNow();
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.likedBy, userId)) {
      return '';
    } else {
      return 'voted';
    }
  },
  downvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.dislikedBy, userId)) {
      return '';
    } else {
      return 'voted';
    }
  },
  comments: function(){
    var limit;
    var sortOrder;
    if(Router.current().route.getName() == "postPage"){
      limit = Comments.find({postID: this._id}).count();
      sortOrder =1;
    } else {
      limit = 2;
      sortOrder = -1;
    }
    return Comments.find({postID: this._id}, {sort: {postedOn: sortOrder},limit: limit});
  },
  commentsCount: function(){
    return Comments.find({postID: this._id}).count();
  }
});
Template.post.events({
  'submit form[name=comment]': function(e){
    e.preventDefault();
    e.stopPropagation();
      if (!Meteor.user()){
        return throwError('Please log in to post a comment.');
      }
    var currentUserID = Meteor.userID;
    var comment = {
      comment: $(e.target).find('[name=comment]').val(),
      postID: this._id,
      likes: 0,
      user: Meteor.userId(),
      dislikes: 0
    }
    Comments.insert(comment, function(error){
      if(!error){
        Posts.update(this._id, {$inc: {commentsCount: 1}});
        $('[name=comment]').val('');
      }
    });
  },
  'click .voteUpPost': function(e){
    e.preventDefault;
    console.log('upVote');
    var post = Posts.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(post.dislikedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $inc: {dislikes: -1},
          $pull: {dislikedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(post.likedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $pull: {likedBy: Meteor.userId()},
          $inc: {likes: -1}
        }
      )
    }
    else{
      Posts.update(this._id,
        {
          $addToSet: {likedBy: Meteor.userId()},
          $inc: {likes: 1}
        }
      )
    }
  },
  'click .voteDownPost': function(e){
    e.preventDefault;
    console.log('down vote');
    var post = Posts.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(post.likedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $inc: {likes: -1},
          $pull: {likedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(post.dislikedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $pull: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: -1}
        }
      )
    }
    else{
      Posts.update(this._id,
        {
          $addToSet: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: 1}
        }
      )
    }
  },
  'click .deletePost': function(e){
    e.preventDefault;
    if (!Meteor.userId()){
      return throwError("You must be logged in to delete posts");
    }
    if(this.postedBy === Meteor.user().username){
      if(confirm('Are you sure you want to delete this post?')){
        Posts.remove(this._id);
      } else {
        return throwError('Unable to delte post');
      }
    } else {
      return throwError("You don't have the permissions to delete this post?")
    }
  },
  'click .editPost': function(e){
    e.preventDefault;
    var element = $("#"+ this._id);
    $("p[name=" + this._id + "]").hide();
    element.css("display", "inline");
    if (!Meteor.userId()){
      return throwError("You must be logged in to edit posts");
    }
    element.focus();
  },
  'keypress .postBody': function(e){
    var element = $("#"+ this._id);
    console.log('h' + e.which);
    if(e.which === 13){
      e.preventDefault;
      var post = Posts.find(this._id);
      var newContent = element.val();
      if (!Meteor.userId()){
        return throwError("You must be logged in to edit posts");
      }
      Posts.update(this._id,{$set: {post: newContent}});
      element.css("display", "none");
      $("p[name=" + this._id + "]").show();
    }
  },
  'blur .postBody': function(e){
    var element = $("#"+ this._id);
    element.css("display", "none");
    $("p[name=" + this._id + "]").show();
  }
});
