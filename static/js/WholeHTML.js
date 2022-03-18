//Tab(previous,next)
//Example Tab(previous,next)
//instruction
//submit

assignmentID = turkGetParam('assignmentId', "");
console.log(assignmentID);

$(document).ready(function() {
    // $('[data-toggle="popover"]').popover();   
  
    $('.btnPrevious').click(function(){
    $('.controlImg > .active').prev('li').find('a').trigger('click');
    });
    if (qualification_mode==false)
    {
        $('.btnNext').click(function(){
            $('.controlImg> .active').next('li').find('a').trigger('click');
          });
    }
    else if (qualification_mode==true){
        $('.btnNext').click(function(){
            // if(AlertFinish()){
                if (AlertAnswer()){
                    $('.controlImg> .active').next('li').find('a').trigger('click');
                }
            // }
            // else{
            //     alert("you are not finished!");
            // }
            });
          
    }




  $('.ExamplebtnNext').click(function(){
    $('.Examplenav-tabs > .active').next('li').find('a').trigger('click');
  });
  
  $('.ExamplebtnPrevious').click(function(){
    $('.Examplenav-tabs > .active').prev('li').find('a').trigger('click');
  });

  






//=========================================Hide show examples======================

$("summary").html("See details and examples");

$("summary").click(function() {
    str = this.id
    summary = "#"+str
    details = "#details"+summary.charAt(summary.length-1)
    console.log($(details)[0].hasAttribute("open"))
        if ($(details)[0].hasAttribute("open")) {
            $(summary).html("See details and examples");
        } else {
            $(summary).html("Hide details and examples");
        }
        

});




//==========================================Instruction===============================================
  $('#hideDtl').click(function()
  {
      $('#dtlPane').collapse('hide');

  });
  

  // delete cookie when user clicks show details
  $('#showDtl').click(function()
  {
      $('#dtlPane').collapse('show');
  });



  // set cookie when details pane is hidden
  $('#dtlPane').on('hidden.bs.collapse', function ()
  {
      // as user has hidden details, set cookie to keep it hidden
      // so it never comes back within 30 mins

    //   var date = new Date(); var delay_mins = 60;
    //   date.setTime(date.getTime() + (delay_mins * 60 * 1000));
    //   document.cookie = "DtlHide=true; expires=" + date.toGMTString() + "; path=/";

      localStorage.DtlPane = "hide";
  });

  $('#dtlPane').on('shown.bs.collapse', function ()
  {
        // as user has shown details, delete cookie to keep it shown
        // document.cookie = "DtlHide=true; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
        localStorage.DtlPane = "show";

  });



//==========================================Submit===============================================

function Submit(){

    StorePreviousAnswers();//store for Image5
    $('#hiddenXY').val(JSON.stringify(XY_names));
    $("#hiddenAnswer").val(JSON.stringify(useranswer_names));
    var date= new Date();
    endTime=date;
    var sjc = ((endTime.getTime()-startTime.getTime())/1000);
    $("#usetime").val(JSON.stringify(sjc));
    $("#browser").val(JSON.stringify(navigator.userAgent));
    // WORKER_COMMENTS???


}
// modalsubmit=function() {
//     if(qualification_mode==false) {
        
//       Submit();
//       return "modal";
//     }
//     else{
//         if(CheckFinish()){
//             if (CheckAnswer()){
//                 Submit();
//                 return "modal";
//             }
//         }
//         return "";
//     }

// }

$('#FinalSubmit').click(function(ev){
    if (qualification_mode==true){
        localStorage.qualification="Submitted";
        // $.ajax({
        //     type:'POST',
        //     url:"/AssociateQworker",
        //     data:1,
        //     contentType:"application/json; charset=utf-8",
        //     dataType:'json',
        //     error: function(xhr, status, error) {
        //         var err = eval("(" + xhr.responseText + ")");
        //         alert(err.Message);
        //     },
        //     success:function(response){
        //         alert("Congratulations! You have been granted with our qualification! You can find and work for the main task!")
        //         console.log("Congratulations! You have been granted with our qualification!")
    
        // }})

    }
});

$('#submitbtn').click(function(ev)
{


    ev.preventDefault();
    if (qualification_mode==false){
                // $('#centralModalLg').modal("show");
                Submit();
           

    }
    else{

        // if(AlertFinish()){
            if (AlertAnswer()){
                $('#AlertModalLg').one('hidden.bs.modal',function(){
         
                        $('#centralModalLg').modal("show");
                        Submit();
          
                });
            }
        // }
        // else{
        //     alert("you are not finished!");
        // }
    }

});

});


