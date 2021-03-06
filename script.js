
   var level = 0; //0 main menu 1//pizza 2//size 3//piece 4//Enter nameAddress 5//EnterPhone 6//cart
   var working=0;var choosedpizza = 0;var choosedsize = 0;var choosedqua = 0;var choosedadd = '';var chooseph = '';
   var pizzalist = [['Fresh Veggie',120,220,340],['Veg Paneer Loaded',140,220,400],['Veg Paradise',180,300,500],['Cheese Corn',120,220,290]];
   var siz = ["","Regular","Medium","Large"];
   $(function(){
     $messages = $('.messages');
     $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
     $('.send_message').click(function (e) {
         msgsend();
     });
     $('.message_input').keyup(function (e) {
         if (e.which === 13) {
            msgsend();
         }
     });
     templatess("start","");
   });

   function msgsendfinal(msg){    //continue to the level work if no special request is found

     if(level==0){
       templatess("displaymsg","Unable to understand the request!");
     }
     if(level==1){
       msg = msg.toLowerCase();
       var fnd = 0;
       for(i=0;i<pizzalist.length;i++){
         if(pizzalist[i][0].toLowerCase()==msg){
           itemchoosed(i+1);fnd = 1;return;
         }
       }
       if(fnd==0){
         templatess("displaymsg","No Matching item found!");
       }
     }
     if(level==2){
       msg = msg.toLowerCase();
       var fnd = 0;
       for(i=0;i<siz.length;i++){
         if(siz[i].toLowerCase()==msg){
           choosedsize=i;fnd = 1;
           itempiece();
           return;
         }
       }
       if(fnd==0){
         templatess("displaymsg","No Matching size found!");
       }
     }
     if(level==3){

         var q = parseInt(msg);
         if(q>0){
           choosedqua = q;level=4;
           templatess("displaymsg","Please enter your name & address!");
           return;
         }else{
           templatess("displaymsg","Please enter valid quantity!");
         }

     }
     if(level==4){
       choosedadd = msg;level=5;
       templatess("displaymsg","Please enter your phone number!");
       return;
     }
     if(level==5){
       chooseph = msg;level=6;
       showcart();
       return;
     }
     if(level==6){
        msg = msg.toLowerCase();
        if(msg=="yes"||msg=="confirm"||msg=="ok"){
          level = 0;
          orderthis();
          return;
        }else{
          level = 0;
          templatess("mainmenu","");
          return;
        }
     }
     if(level==7){
       checkstatus(msg);
       level = 0;
     }
   }


   function msgsend(){        //input message is being processed by this function
     var msg = $('.message_input').val();
     if(msg.length>0){
       if(working==0){
         //0 main menu 1//pizza 2//size 3//piece  4//Enter nameAddress 5//EnterPhone 6//cart 7//status
         showmymsg(msg);working=1;$('#dstat').show().html("Loading...").css('color','green');
         $('.message_input').val('');
         learning(msg);
       }
     }else{
       $('#dstat').show().html("Please enter your message!").css('color','red');
     }
   }

   function showmymsg(g){         //Append user message to the chat
     out = '<li class="message right appeared"><div class="text_wrapper"><div class="text">'+g+'</div></div></li>';

     $('.messages').append(out);
     $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);

   }

   function learning(msg){        //check if user is request some special request with wit.ai NLP
     $.ajax({
         url: 'https://api.wit.ai/message',
         data: {
           'q': msg,
           'access_token' : '776E253ZL3MZHXWA2Z6PW2B3HQ2LFDR2'
         },
         dataType: 'jsonp',
         method: 'GET',
         success: function(response) {
             console.log("success!", JSON.stringify(response));
            // alert(response['entities']['submenu']['value']);

             var con = 0;

             if(response.entities.submenu){
               var kk = response.entities.submenu[0].value;
               var cof = response.entities.submenu[0].confidence;
               if(cof>0.7){
                 if(kk=="back"){
                   templatess("displaymsg","Back to Home");
                   level = 0;
                   templatess("mainmenu","");
                   return;
                 }
                 if(kk=="menu"){
                   templatess("displaymsg","Showing Menu");
                   level = 1;
                   showmenu();
                   return;
                 }
                 if(kk=="status"){
                   if(response.entities.number){

                     var oi = response.entities.number[0].value;
                     if(oi>0){
                       templatess("displaymsg","Checking status of "+oi);
                       level = 7;
                       checkstatus(oi);
                     }else{
                       showorder();
                     }
                     return;
                   }else{
                     showorder();
                     return;
                   }
                 }
                 if(kk=="support"){
                   showsupport();
                   return;
                 }
               }
               //alert(kk+" "+cof);
             }
             if(con==0){
               msgsendfinal(msg);
             }
         }
        });
   }

   function checkstatus(msg){       //checking status of ORDERID : in parameter.
     if(msg>0){
       $.ajax({
            data: {'type': 'orderdet','oid': msg},
            url: 'api.php',
            method: 'POST',
            success: function(msg){
              templatess("displaymsg",msg);
              level = 0;
              templatess("mainmenu","");
            }
          });
     }else{
       templatess("displaymsg","Invalid OrderID!");
     }

   }

   function orderthis(){        //Order function to add order to the database using webapi
     if(choosedpizza==0||choosedqua==0||choosedsize==0){
       level=1;choosedpizza=0;choosedqua=0;choosedsize=0;
       templatess("displaymsg","You haven't confirmed any pizza yet!");
       showmenu();
       return;
     }
     $.ajax({
          data: {'type': 'addorder','pizzid': choosedpizza,'pizzsz':choosedsize,'pizzqt':choosedqua,'uadd':choosedadd,'umob':chooseph},
          url: 'api.php',
          method: 'POST',
          success: function(msg){
            if(msg>0){
              checkstatus(msg);
            }else{
              level=1;choosedpizza=0;choosedqua=0;choosedsize=0;
              templatess("displaymsg","Unable to add pizza! please try again");
              showmenu();
            }
          }
        });

   }

   function showorder(){
     level = 7;
     var out = 'What is your order ID?';
     templatess("displaymsg",out);
   }


   function showmenu(){
     level = 1;
     templatess("showmenu","");
   }
   function showsupport(){
     level = 0;
     var out = 'Sorry, No human support is avaiable now, Please mail your issue on xyz@abc.com';
     templatess("displaymsg",out);
   }

   function itemchoosed(r){
     level = 2;choosedpizza = r;
     templatess("displaymsg","Choosed: "+pizzalist[r-1][0]);
     var out = 'Please enter pizza size : Regular (&#8377;'+pizzalist[r-1][1]+') / Medium (&#8377;'+pizzalist[r-1][2]+') / Large (&#8377;'+pizzalist[r-1][3]+')';
     templatess("displaymsg",out);
   }

   function itempiece(r){
     level = 3;
     var out = 'Please enter pizza quantity';
     templatess("displaymsg",out);
   }

   function showcart(){
     if(choosedpizza==0||choosedqua==0||choosedsize==0){
       level=1;choosedpizza=0;choosedqua=0;choosedsize=0;
       templatess("displaymsg","You haven't confirmed any pizza yet!");
       showmenu();
       return;
     }
     level = 6;
     var tot = pizzalist[choosedpizza-1][choosedsize]*choosedqua;
     var out = '<div class="text"><b><u>Pizza Cart</u></b><br><b>'+pizzalist[choosedpizza-1][0]+'</b> - '+siz[choosedsize]+' - '+choosedqua+' Pcs<br>Total : &#8377;'+tot+'<br>Should I confirm this pizza?</div>';
      templatess("displaymsg",out);
   }


   function templatess(typ,text1){          //display the bot message to chat
     var out = "";
     if(typ=="displaymsg"){
       out = '<div class="text">'+text1+'</div>';
     }
     if(typ=="start"){
       out = '<div class="text">Welcome to YoYo Pizza! I am Yo-Bot, how may i help you?</div><div class="button1" onclick="showmenu()">Menu/Order</div><div class="button1" onclick="showorder()">Track Order</div><div class="button1" onclick="showsupport()">Support</div>';
     }
     if(typ=="mainmenu"){
       out = '<div class="text"><div class="button1" onclick="showmenu()">Menu/Order</div><div class="button1" onclick="showorder()">Track Order</div><div class="button1" onclick="showsupport()">Support</div>';
     }
     if(typ=="showmenu"){
       out = '<div class="text">Please choose your pizza?</div>';
       for(i=0;i<pizzalist.length;i++){
         out += '<div class="button1" onclick="itemchoosed('+(i+1)+')">'+pizzalist[i][0]+'</div>';
       }
     }

     var outf = '<li class="message left appeared"><div class="text_wrapper">'+out+'</div></li>';

     $('.messages').append(outf);
     $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
     $('#dstat').hide().html("").css('color','red');working=0;
     $('.message_input').focus();

   }
