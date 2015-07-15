Template.post.helpers({
  posted: function(){
    return moment(this.postedOn).format("hh:mmA MMMM Do, YYYY");
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
    return Comments.find({postID: this._id}, {sort: {postedOn: -1},limit: 2});
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
        Posts.update(this._id, {$inc: {comments: 1}});
        $('[name=comment]').val('');
      }
    });
  },
  'click .voteUp': function(e){
    e.preventDefault;
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
  'click .voteDown': function(e){
    e.preventDefault;
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
  }
})
