Template.postList.events({
  'click .load-more': function(e){
    e.preventDefault;
    console.log(Session.get("limit"));
    Session.set("limit", Session.get("limit") + 15);
      console.log(Session.get("limit"));
  }
});
Posts.find().observe({
  added: function(){
    console.log('hello');
  }
});
