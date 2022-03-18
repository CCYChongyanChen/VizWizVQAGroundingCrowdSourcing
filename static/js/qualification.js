

function get_IOU(Seg=[]){     
    var list1=XY_names['xy'+activate_tab];
    if (Seg.length==0){

        var list2=gt_XY_names['xy'+activate_tab];
    }
    else{
        var list2=Seg;
    }
    var Data = JSON.stringify({ev:list1, gt:list2});
    postIOU=$.ajax({
        type:'POST',
        url:"/getIOU",
        data:Data,
        async: false,
        contentType:"application/json; charset=utf-8",
        dataType:'json',
        success:function(response){
            var IOUscore=parseFloat(response["iou"]).toFixed(2);
            // document.getElementsByClassName("testeva").innerHTML=IOUscore;
            if (Seg.length==0){
            qualifications["quali"+activate_tab]=IOUscore>0.6;
            }
            else{
                // console.log(response["intersection"])
                if (response["intersection"]>1500000){
                    includeThumb=true;
                }
                else{includeThumb=false;
                }
                
            }
    }}
    )
}

//
function Alert(Text){
    $('#AlertModalLg h3').text(Text);
    $('#AlertModalLg').modal("show");
}
//============================================CheckAnswer=====================================
//used in "Whole_HTML.js" file and "EnableDisable.js" file
function AlertAnswer(){
    // var condition = FinishStatus();
    // if (!condition){
    //     if ($('#nodraw:checked').length>0){
    //         alert("Please input your reason for not drawing the polygon. For example: 'Answer is not displayed in the image.'");
    //     }
    //     else{alert("You are not finished!")
    //     }
    // }



    var Step1correct=false;
    var Step2correct=false;
    var Step3correct=false;
    var currenttabID=(parseInt(activate_tab.slice(3)));
    // console.log(gt_useranswer_names['useranswers'+activate_tab]);
    // console.log($('input[name=MULTI_QUESTION_DETECT]:checked').val());
    // console.log($('input[name=MULTI_FOCUS_DETECT]:checked').val());

    // check step 1 answer: (1) if step 1 is finished (2) if step 1 is correct
    // (1) if step 1 is not finished
    if ($('input[name=MULTI_QUESTION_DETECT]:checked').length==0){
        Alert("You are not finished! Please finish step 1.")
        return false
    }
    // (2) Step 1 is finished; step 1 is correct?
    else{
        if (gt_useranswer_names['useranswers'+activate_tab]["MULTI_QUESTION_DETECT"] ==$('input[name=MULTI_QUESTION_DETECT]:checked').val()){
            Step1correct=true;
        }
        else{
            Alert("The answer to step 1 is incorrect.")
                DisableTab(currenttabID);
                return false
        }
    }

    // Only step 1? 
    if ($('input[name=MULTI_QUESTION_DETECT]:checked').val() =="Y"){
            Alert("All answers are correct.")
            EnableTab(currenttabID);
            return true
    }// Step 2 activated

    else{
        // check step 2 answer: (1) if step 2 is finished (2) if step 2 is correct
        // (1) if step 2 is not finished
        if ($('input[name=MULTI_FOCUS_DETECT]:checked').length==0){
            Alert("You are not finished! Please finish step 2.")
            DisableTab(currenttabID);
            return false
        }
        else{
            if (gt_useranswer_names['useranswers'+activate_tab]["MULTI_FOCUS_DETECT"] ==$('input[name=MULTI_FOCUS_DETECT]:checked').val()){
                Step2correct=true;

            };

            if (Step2correct==false){
                Alert("The answer to step 2 is incorrect.")
                
                DisableTab(currenttabID);
                return false
            }    
            else{        
                //check step 3
            }    
        }
    };
    
    if ($('input[value=N]:checked').length!=2){//STEP 3-NOT ACTIVATED
        EnableTab(currenttabID);
        Alert("All answers are correct.")
        return true
    }
    else {//STEP3 ACTIVATED; 4 conditions: 

        if ($('input[name=NoDraw]').is(':checked')) {
            //checked, gt-checked =>true
            if (gt_useranswer_names['useranswers'+activate_tab]["NoDraw"] =='CANNOT_DRAW'){
                if ($('#nodrawreason').val().length>0){
                    Step3correct=true;
                    Alert("All answers are correct.");
                }
                else{
                    Alert("You are not finished! Please input your reason for not drawing the polygon.");
                    DisableTab(currenttabID);
                    return false;
                }
            }
            //checked, gt-unchecked=>false
            else{
                Step3correct=false;
                Alert("The answer to step 3 is incorrect. Please draw the region the answer is referring to.");
            };
        }
        else{
            //not checked, gt-not checked=>check iou
            if (gt_useranswer_names['useranswers'+activate_tab]["NoDraw"] =='Draw'){
                //finished => check iou
                //gt =="Draw"; eva == ""
                if (finishFlags['finishFlag'+activate_tab]==true){
                    get_IOU();

                    if (activate_tab=="TAB10"){
                        get_IOU(thumb);
                        if (includeThumb==true){
                            var alertinfoStep3 = TabInstructions[activate_tab];
                            Alert(alertinfoStep3);
                            Step3correct=false;

                        }
                        else{
                            Step3correct = qualifications["quali"+activate_tab];
                            if (Step3correct){
                                Alert("All answers are correct.")
                            }
                            else{
                               Alert("The grounding is insufficient. Please refer to the instructions and review Step 3");
                            }
                           
                        }
                    }
                    else{
                        Step3correct = qualifications["quali"+activate_tab];
                        if (Step3correct){
                            Alert("All answers are correct.")
                        }
                        else{
                            // console.log(activate_tab);
                            var alertinfoStep3 = TabInstructions[activate_tab]
                            Alert(alertinfoStep3);
                        }
                    }
                    
                // console.log("Iou score is"+qualifications["quali"+activate_tab])

                }
                //not finished
                else{
                    if (XY_names['xy'+activate_tab].length==0){
                        Alert("You are not finished. Please draw for the image.")
                        DisableTab(currenttabID);
                        return false
                    }
                    else{
                        Alert("You are not finished. Please click the first point again to finish (the polygon will turn purple when your cursor is on the first point again).")
                        DisableTab(currenttabID);
                        return false
                    }
                   
                }
            } 
            else{
            //not checked, gt-checked=>false
                if (XY_names['xy'+activate_tab].length==0){
                    Alert("You are not finished. Please finish step 3.")
                    DisableTab(currenttabID);
                    return false
                }
                else{
                    Step3correct=false;
                    Alert("The answer to Step 3 is incorrect. You don't need to draw for this image.");
                }
            }
        }

        if (Step3correct){
            EnableTab(currenttabID);
            return true
        }
        else{
            DisableTab(currenttabID);
            return false
        }
        }

}

function DisableTab(currenttabID){
        for (i = currenttabID; i < tabnumber+1; i++) {
            $('#TAB'+i).parent().addClass("disabled");
        }
        finishStep123["finishStep123"+activate_tab]=false;

}

function EnableTab(currenttabID){
        finishStep123["finishStep123"+activate_tab]=true;
        var j =currenttabID;
        while(finishStep123["finishStep123TAB"+j]==true){
            $('#TAB'+j).parent().removeClass("disabled");
            j++;
        }
}

var TabInstructions={"TAB1":"The grounding is insufficient. Please refer to the instructions and review Step 3 - option (b) - Examples: 'Whole Image'.",
                    "TAB2":"The grounding is insufficient. Please refer to the instructions and review Step 3 - option (b) - Examples: 'Text related'.",
                    // "TAB3":"Please see Step 3's instructions and examples.",
                    "TAB4":"The grounding is insufficient. Please refer to the instructions and review Step 2 (connected region) and Step 3.",
                    "TAB5":"The grounding is insufficient. Please refer to the instructions and review Step 3 - option (b) - Examples:'Complex boundary'.",
                    // "TAB6":"Please see Step 3 - 'Whole Image' section's instructions and examples.",
                    "TAB7":"The grounding is insufficient. Please refer to the instructions and review Step 3 - option (b) - Examples: 'Complex boundary' and 'Image with hole'.",
                    "TAB8":"The grounding is insufficient. Please refer to the instructions and review Step 2 and Step 3.",
                    // "TAB9":"Please see Step 3's 'Whole Image' section's instructions and examples.",
                    "TAB10":"The grounding is insufficient. Please refer to the instructions and review Step 3 - option (b) - Examples: 'Occlusion'.",
                    }

var includeThumb=false;
var thumb=[
    {
        "x": 104.6187515258789,
        "y": 300.60003662109375
    },
    {
        "x": 127.6187515258789,
        "y": 296.60003662109375
    },
    {
        "x": 163.6187515258789,
        "y": 278.60003662109375
    },
    {
        "x": 179,
        "y": 282.73333740234375
    },
    {
        "x": 186,
        "y": 297.73333740234375
    },
    {
        "x": 187,
        "y": 319.73333740234375
    },
    {
        "x": 177,
        "y": 337.73333740234375
    },
    {
        "x": 164,
        "y": 351.73333740234375
    },
    {
        "x": 131,
        "y": 364.73333740234375
    },
    {
        "x": 118,
        "y": 372.73333740234375
    },
    {
        "x": 104.6187515258789,
        "y": 300.60003662109375
    }
];