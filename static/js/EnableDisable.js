

//============================================CheckAnswer=====================================
function FinishStatus(){
    var CheckStep1Step2 = ($('input[value=Y]:checked').length>0);// && $('input[type=radio]:checked').length>1
    var NoDraw =($('#nodraw:checked').length>0 && $('#nodrawreason').val().length>0);
    var Drawfinished = finishFlags['finishFlag'+activate_tab]==true && ($('#nodraw:checked').length==0)
    var condition=(CheckStep1Step2 || NoDraw || Drawfinished);
    return condition
}

function AlertFinish(){
    var condition = FinishStatus();
    if (!condition){
        if ($('#nodraw:checked').length>0){
            alert("Please input your reason for not drawing the polygon. For example: 'Answer is not displayed in the image.'");
        }
        else{alert("You are not finished!")
        }
    }

    return condition
}

//=============================================STEP3 ===========================================
function checkStep2(){
    return ($('#step1inputN:checked').length>0);
}
function checkStep3(){
    return ($('input[value=N]:checked').length>1);
}


function ControlStep2() {
    if (checkStep2()==true) {
        $("input.Step2").removeAttr("disabled");
        $("div.step2").removeClass("noHover");
    
    } else {
        $("input.Step2").attr("disabled", true);
        $("div.step2").addClass("noHover");
    }
    }
function ControlStep3() {
if (checkStep3()==true) {
    $("input.Step3").removeAttr("disabled");
    $("div.step3").removeClass("noHover");

} else {
    $("input.Step3").attr("disabled", true);
    $("div.step3").addClass("noHover");
}
NoDrawControlReason();
}

function ControlCanvas(){

    if ($('input[value=N]:checked').length>1 && $('#nodraw:checked').length==0){
        draw_canvas();        
        enableBtn('#WholeImage');
        // console.log(document.getElementById('WholeImage').disabled);
    }
    else{
        disableBtn('#WholeImage');
        document.getElementById('WholeImage').disabled = true;
        clearCanvas();
    }
    
}
////no draw reason: only activated if step3 is activated &  # nodraw is checked 
////select the whole image: activated if step3 is activated AND #nodraw is not checked 


// function NoDrawControl(){
//     // NoDrawControlReason();
//     // NoDrawControlWholeImage();
// }
function NoDrawControlReason(){
    if ($('input[value=N]:checked').length>1 && $('#nodraw:checked').length==1){
        enableBtn('#nodrawreason');
        // enableBtn('#WholeImage');
    }
    else{
        disableBtn('#nodrawreason');
        // disableBtn('#WholeImage');
        // document.getElementById('WholeImage').disabled = true;
    }
}

//===========================================CONTROL NEXT BUTTON================================


function ControlNext(){
    var activate_btnid=activate_tab.toLowerCase();
    var currenttabID=(parseInt(activate_tab.slice(3)));
    var condition = FinishStatus();
    if (qualification_mode==false){
        if (condition==true){
            EnableNext(activate_btnid,currenttabID);}
        else{
            DisableNext(activate_btnid,currenttabID);
        }
    }

}





function EnableNext(activate_btnid,currenttabID){
    
    enableBtn('#'+activate_btnid+' > .btnNext');
    finishStep123["finishStep123"+activate_tab]=true;
    var j =currenttabID;
    while(finishStep123["finishStep123TAB"+j]==true){
        $('#TAB'+j).parent().removeClass("disabled");
        j++;
    }
    
    enableBtn('#'+activate_btnid+' > .btnsubmit');
}
function DisableNext(activate_btnid,currenttabID){
    disableBtn('#'+activate_btnid+' >.btnNext');

    for (i = currenttabID; i < tabnumber+1; i++) {
        $('#TAB'+i).parent().addClass("disabled");
        
    }

    finishStep123["finishStep123"+activate_tab]=false;
    disableBtn('#'+activate_btnid+' > .btnsubmit');
}

function disableBtn(button) {
    $(button).attr("disabled", true);
    $(button).addClass("noHover");
}

function enableBtn(button) {
    $(button).removeAttr("disabled");
    $(button).removeClass("noHover");
}

