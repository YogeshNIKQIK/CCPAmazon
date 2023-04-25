window.ccp = window.ccp || {};
agentCall = false;
console.log(window.ccp)
connect.core.initCCP(containerDiv, {
    ccpUrl: 'https://nikqikdevall.my.connect.aws/ccp-v2',        /*REQUIRED (*** has been replaced) */
    loginPopup: true,               // optional, defaults to `true`
    loginPopupAutoClose: true,      // optional, defaults to `true`
    loginOptions: {                 // optional, if provided opens login in new window
    autoClose: true,              // optional, defaults to `false`
    height: 600,                  // optional, defaults to 578
    width: 400,                   // optional, defaults to 433
    top: 0,                       // optional, defaults to 0
    left: 0    
       }, 
    region: "ap-southeast-2",        /*optional, default TRUE*/
    softphone:     {              /*optional*/
       allowFramedSoftphone: true
    }
 });
 connect.contact(function(contact) {
         connect.core.onAccessDenied(function(contact){
           window.open("https://nikqikdevall.awsapps.com/connect/login")
         })
         contact.onIncoming(function(contact) {
          console.log("Incoming call")
          var attributeMap = contact.getAttributes();
          var list = GiveAttributesList(attributeMap);
          RenderTable(list)
         });
 
         contact.onRefresh(function(contact) {
         });
 
         contact.onAccepted(function(contact) {

            window.open('https://nikqiktechnologies273.freshservice.com/a/tickets/new', '_blank');

            // window.open('https://nikqiktechnologies273.freshservice.com/a/tickets/new', '_blank', 'width=800,height=800');

           });
 
         contact.onEnded(function() {
          
         });
 
         contact.onConnected(function() {
                 console.log(`onConnected(${contact.getContactId()})`);
                 if (agentCall) {
                    console.log("This is agent to agent call")
                    window.ccp.agent.getEndpoints(window.ccp.agent.getAllQueueARNs(), {
                        success: function (data) {
                            console.log("Adding connection to selected agent")
                            var selectedIndex = $("#agentCalling").prop('selectedIndex');
                            window.ccp.agent.getContacts(connect.ContactType.VOICE)[0].addConnection(data.endpoints[selectedIndex], {});
                        },
                        failure: function () {
                            console.log("failed to place the call to the agent");
                        }
                    });
                }
         });
 });
 
 connect.agent(agent => {
    console.log("Agent connected")
    window.ccp.agent = agent;
    var config = agent.getConfiguration()
    getAgents(agent);
    GetAgentInfo()
});

function getAgents(agent) {
    console.log("Generating agent list")
    agent.getEndpoints(agent.getAllQueueARNs(), {
       success: function (data) {
           console.log("fetched the agent list")
           var dropdowns = data.endpoints;
           console.log(dropdowns.length);
           var i;
           var totalOptions = [];
           for (i = 0; i < dropdowns.length; i++) {
               var openDropdown = new Option(dropdowns[i].name);
               totalOptions.push(openDropdown);
           }
           console.log(totalOptions)
           $("#agentCalling").append(totalOptions);
               $('#agentCalling').on('change', function() {
                   console.log( $(this).find(":selected").val() );
               });
       },
       failure: function () {
           console.log("Failed to generate agent list")
       }
   });
   $("#placeCall").click(() => {
       console.log("Clicked on placing call")
       agentCall = true;
       agent.connect(connect.Endpoint.byPhoneNumber("+61272567820"), {});
   });
}



 $(document).ready(function(){
     console.log("Jquery working")
    //  $("#agent-name").html("Ankit")
    // var list = GiveAttributesList(obj);
    // RenderTable(list)
 });
 
 const GiveAttributesList = (obj) => {
    var attributesKeys = Object.keys(obj)
    if(attributesKeys.length > 0){
        var attributesArray = []
        for (var i = 0 ; i< attributesKeys.length ; i++){
            var item = {}
            item.name = attributesKeys[i]
            item.value = obj[attributesKeys[i]]['value'];         
            attributesArray.push(item)
        }
        return attributesArray
    }else{
        return []
    }   
 }
 
 const RenderTable = (list) => {
    console.log("Showing table")
    $(".attributes-table-row").remove();
    list.map((item , index) => {
       $("#attributes-table-body").append(`<tr class='attributes-table-row'><th scope='row'>${index+1}</th><td>${item.name}</td><td>${item.value}</td></tr>`)
    }
    )
   
 }
 

 const GetAgentInfo = () => {
    console.log("Getting Agent info")
     var agent = new connect.Agent
     console.log("Agent Object" , agent)
     var config = agent.getConfiguration()
     var agentName = agent.getName()
     var agentStates = agent.getAgentStates();
     var routingProfile = agent.getRoutingProfile();
     console.log("Retrived info")
     console.log(agentStates)
     console.log(config)
     console.log(agentName)
     console.log(routingProfile)
     $("#agent-name").html(agentName)
     $("#agent-routingprofile").html(routingProfile.name)
  } 


