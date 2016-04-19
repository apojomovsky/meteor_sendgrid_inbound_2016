// Set up a collection to contain background ole.log(olor information. On the server,
// it is backed by a MongoDB collection named "bgcolor".

Inbound = new Meteor.Collection("Inbound");

Router.route('/',{

});

Router.route('/inbound', function () {
  var req = this.request;
  var res = this.response;

  var rawEmail = JSON.stringify(req.body.toString());
  var emailSubjectSub = rawEmail.substring(rawEmail.search("Subject: ") + 9);
  var emailSubject = emailSubjectSub.substring(0, emailSubjectSub.indexOf('\\n'));
  var emailBodySub = rawEmail.substring(rawEmail.search("ltr") + 6);
  var emailBody = emailBodySub.substring(0, emailBodySub.indexOf('<'));
  var emailDateSub = rawEmail.substring(rawEmail.search("Date: ") + 6);
  var emailDate = emailDateSub.substring(0, emailDateSub.indexOf('\\n'));
  console.log(emailSubject);
  console.log(emailBody);
  console.log(emailDate);
  res.statusCode = 200;
  res.end('email received\n');


  Inbound.insert({
      Subject: emailSubject,
      Body: emailBody,
      Date: emailDate,
  });

}, {where: 'server'});


if (Meteor.isClient) {

}

if (Meteor.isServer) {
  Router.configureBodyParsers = function(){
    //Router.onBeforeAction( Iron.Router.bodyParser.json(), {except: ['inbound'], where: 'server'});
    // Enable incoming XML requests for creditReferral route
    Router.onBeforeAction( Iron.Router.bodyParser.raw({type: '*/*', only: ['inbound'],
    verify: function(req, res, body){
      req.rawBody = body.toString();
    }, where: 'server'}));
    //Router.onBeforeAction( Iron.Router.bodyParser.urlencoded({ extended: false }), {where: 'server'});
};
}
