Template.postPage.helpers({
  comments: function(){
    return Comments.find({postID: this._id});
  },
  postedMomemnt: function(){
    return moment(this.postedOn).fromNow();
  },
  count: function(){
    return Comments.find({postID: this._id}).count();
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
  }
});

Template.postPage.events({
  'submit form': function(e){
    e.preventDefault();
    var currentUserID = Meteor.userID;
    var comment = {
      comment: $(e.target).find('[name=comment]').val(),
      postID: this._id,
      likes: 0,
      user: Meteor.userId(),
      dislikes: 0
    }
    Comments.insert(comment);
    Posts.update(this._id, {$inc: {comments: 1}});
    Router.go('postPage', {_id: this._id});
    $('[name=comment]').val('');
  },
  'click .voteUp': function(e){
    e.preventDefault;
    var comment = Comments.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(comment.dislikedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $inc: {dislikes: -1},
          $pull: {dislikedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(comment.likedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $pull: {likedBy: Meteor.userId()},
          $inc: {likes: -1}
        }
      )
    }
    else{
      Comments.update(this._id,
        {
          $addToSet: {likedBy: Meteor.userId()},
          $inc: {likes: 1}
        }
      )
    }
  },
  'click .voteDown': function(e){
    e.preventDefault;
    var comment = Comments.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(comment.likedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $inc: {likes: -1},
          $pull: {likedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(comment.dislikedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $pull: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: -1}
        }
      )
    }
    else{
      Comments.update(this._id,
        {
          $addToSet: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: 1}
        }
      )
    }
  }
});
