// var init_time;
var activate_tab = "TAB1";
// var hitID = '';
// var assignmentID = '';
// var workerID = '';
var startTime = new Date();
var endTime = "";
var useranswer_names = {};
var XY_names = {};
var QA_names={};
var ele = document.getElementsByTagName('input'); 
var Step3Flag=false;
var searchParams = new URLSearchParams(window.location.search);
var input = searchParams.get("groupindex");
var dataset=input.split("_")[0]
var group_id=input.split("_")[1]
var finishFlags={};
var finishStep12={};
var finishStep123={};
var qualifications={};
var URL_=document.location.toString()
var mode = document.location.toString().split("//")[1].split("/")[1].split("?")[0]//qualification/qualifiationGT/index

$( document ).ready(function() {
    $('[data-toggle="popover"]').popover();   
    $(ControlStep2());
    $(ControlStep3());//initial: disable step3
    $(ControlNext());
    $(ControlCanvas());//delete?
    
   

    
    if (qualification_mode==false)
    {
        //Difference between train mode and qualification mode: train mode has Control Next button. Qualification mode will alert users. 
        $ ('input[type=radio]').click(function(){ControlStep2();ControlStep3();ControlCanvas();ControlNext();});//2 'No' radios clicked or unclicked: enable step3
        $('.image_wrap').click(function(){ControlNext()});
        $('#nodraw').click(function(){ControlNext();ControlCanvas();NoDrawControlReason();});    
        $('#nodrawreason').on('input', function() {ControlNext()});    
        // $('#WholeImage:checkbox').click(function(){ControlNext()});
    }
    else{
        $ ('input[type=radio]').click(function(){ControlStep2();ControlStep3();ControlCanvas();});//2 'No' radios clicked or unclicked: enable step3
        $('#nodraw').click(function(){ControlCanvas();NoDrawControlReason();});
        
        // CheckAnswer();

    }
  });


if (dataset=="val" || dataset=="train" ||dataset=="test"){  
    var tabnumber=5;       
    var qualification_mode=false;
}

else if (dataset=="qualification"){
    
    var tabnumber=10;
    var gt_useranswer_names={};
    var gt_XY_names={};

    if (mode == "qualification"){
    var qualification_mode=true;//set true when set to qualification_eva, set false when set to qualification_gt


    $.getJSON("/static/Results/quali_gt/"+dataset+"_gt_results.json", function(data){

        for (j=1; j<tabnumber+1;j++){
            gt_useranswer_names['useranswersTAB'+j]=data[input]['useranswersTAB'+j];
            gt_XY_names['xyTAB'+j]=data[input]['xyTAB'+j];

        }            
        }).fail(function(){
        console.log("Fail to load qualification Ground Truth.");
        });    

    }
    else if (mode == "qualificationGT"){
    
    var qualification_mode=false;
    }





    // $.ajax({
    //     type:'get',
    //     url:"https://raw.githubusercontent.com/CCYChongyanChen/CCYChongyanChen.github.io/master/TraditionalGroundingV2/qualification_gt_results.json",
    //     dataType:'json',
    //     success:function(data){
    //             for (j=1; j<tabnumber+1;j++){
    //                 gt_useranswer_names['useranswersTAB'+j]=data[input]['useranswersTAB'+j];
    //                 gt_XY_names['xyTAB'+j]=data[input]['xyTAB'+j];
    //             }
    
    // }}
    // )

}

for (var i =1; i < tabnumber+1; i++){
    XY_names['xyTAB'+i]=[]; 
    useranswer_names['useranswersTAB'+i]={};
    QA_names['qaTAB'+i]={};
    finishFlags['finishFlagTAB'+i]=false;
    finishStep12['finishStep12TAB'+i]=false;
    finishStep123['finishStep123TAB'+i]=false;
    if (qualification_mode==true)
    {
        qualifications["qualiTAB"+i]=false;}
}


//PLEASE NOTICE THAT: tab is indexed from 1 while QA pais are indexed from 1


loadQApairs= $.getJSON("/static/QA_annotations/"+dataset+"_grouped.json", function(data){
            // if (dataset=="val" || dataset=="train" ||dataset=="test"){            
            for (j=1; j<tabnumber+1;j++){
            QA_names['qaTAB'+j]["Answer"]=data[group_id][j-1]["answers"][0];
            QA_names['qaTAB'+j]["Question"]=data[group_id][j-1]["question"];
                
            if (dataset=="val" || dataset=="train" ||dataset=="test"){            
                QA_names['qaTAB'+j]["Imgsrc"]="https://ivc.ischool.utexas.edu/VizWiz_visualization_img/"+data[group_id][j-1]["image"];
            } 

            else{         
                QA_names['qaTAB'+j]["Imgsrc"]="https://ivc.ischool.utexas.edu/VizWiz_grounding/vizwiz_qualification/"+data[group_id][j-1]["image"];
            } 
            }
}).fail(function(){
    console.log("An error has occurred.");
});


// $.ajax({
//     type:'get',    
//     url:"https://visualgrounding.ischool.utexas.edu/static/QA_annotations/"+dataset+"_grouped.json",
//     // url:"https://raw.githubusercontent.com/CCYChongyanChen/CCYChongyanChen.github.io/master/TraditionalGroundingV2/static/QA_annotations/"+dataset+"_grouped.json",
//     dataType:'json',
//     success:function(data){
//             // if (dataset=="val" || dataset=="train" ||dataset=="test"){            
//                 for (j=1; j<tabnumber+1;j++){
//                 QA_names['qaTAB'+j]["Answer"]=data[group_id][j-1]["answers"][0];
//                 QA_names['qaTAB'+j]["Question"]=data[group_id][j-1]["question"];
//                 QA_names['qaTAB'+j]["Imgsrc"]="https://ivc.ischool.utexas.edu/VizWiz_visualization_img/"+data[group_id][j-1]["image"];

//                 }
//             // }

// }}
// )


$.when(loadQApairs).done(function(){
    DisplayCurrentQApairs();
}

)



// Switch Tabs

function find_activated_tab(clicked_id)
{   
    StorePreviousAnswers();
    activate_tab=clicked_id;
    ClearAll();
    DisplayCurrentAnswers();
    DisplayCurrentQApairs();
    ControlStep2();
    // console.log("step2"+document.getElementById('WholeImage').disabled);
    ControlStep3();
    // console.log("step3"+document.getElementById('WholeImage').disabled);
    ControlCanvas();
    // NoDrawControl();
    // console.log("canvas"+document.getElementById('WholeImage').disabled);
    ControlNext();
    // console.log("next"+document.getElementById('WholeImage').disabled);
    // console.log(QA_names);
}


function DisplayCurrentQApairs(){
    document.getElementById("answer").innerHTML="Answer: "+  QA_names['qa'+activate_tab]["Answer"];
    document.getElementById("question").innerHTML="Question: "+QA_names['qa'+activate_tab]["Question"];
    document.getElementById("image").src=QA_names['qa'+activate_tab]["Imgsrc"];
    
}


function StorePreviousAnswers() { 
    
    var step1 = $("input[type='radio'][name='MULTI_QUESTION_DETECT']:checked").val();
    var step2 = $("input[type='radio'][name='MULTI_FOCUS_DETECT']:checked").val();
    var step3_nodraw =$("input[type='checkbox'][name='NoDraw']").is(':checked');
    // var step3_nodraw = $("input[type='checkbox'][name='NoDraw']:checked").val();
    var step3_nodrawreason = $("input[type='text'][name='NoDrawReason']").val();
    var step3_wholeimage = $("input[type='checkbox'][name='WholeImage']:checked").val();

    useranswer_names['useranswers'+activate_tab]['MULTI_QUESTION_DETECT']=step1;
    
    if (step1=="N"){
        useranswer_names['useranswers'+activate_tab]['MULTI_FOCUS_DETECT']=step2;
        if (step2=="N"){
            // no draw checked: 
            if(step3_nodraw==true){
                useranswer_names['useranswers'+activate_tab]['NoDraw']="CANNOT_DRAW";
                useranswer_names['useranswers'+activate_tab]['NoDrawReason']=step3_nodrawreason;
                useranswer_names['useranswers'+activate_tab]['WholeImage']=""
                DeleteAllThenInit();
            }
            else if(step3_wholeimage=="WholeImage"){
                useranswer_names['useranswers'+activate_tab]['WholeImage']=step3_wholeimage;
                useranswer_names['useranswers'+activate_tab]['NoDraw']=""
                useranswer_names['useranswers'+activate_tab]['NoDrawReason']=""
            }
            else{
                useranswer_names['useranswers'+activate_tab]['NoDraw']=""
                useranswer_names['useranswers'+activate_tab]['NoDrawReason']=""
            }
            
        }
        else{
        useranswer_names['useranswers'+activate_tab]['NoDraw']=""
        useranswer_names['useranswers'+activate_tab]['NoDrawReason']=""
        useranswer_names['useranswers'+activate_tab]['WholeImage']=""
        DeleteAllThenInit();
        }
    }
    else{
        useranswer_names['useranswers'+activate_tab]['MULTI_FOCUS_DETECT']=""
        useranswer_names['useranswers'+activate_tab]['NoDraw']=""
        useranswer_names['useranswers'+activate_tab]['NoDrawReason']=""
        useranswer_names['useranswers'+activate_tab]['WholeImage']=""
        DeleteAllThenInit();
    }





















    // for(i = 0; i < ele.length; i++) { 
    //     // console.log(ele[i].name)

    //     if(ele[i].type=="radio") { 
          
    //         if(ele[i].checked) {
                
    //             //storing answers
    //             // Example: 
    //             // useranswer_names['useranswersTAB1']['MULTI_FOCUS_DETECT']='N'
    //             useranswer_names['useranswers'+activate_tab][ele[i].name] = ele[i].value;
    //         }
    //     }

    //     if(ele[i].type=="checkbox") { 
    //         if ($('input[value=N]:checked').length!=2){
    //             useranswer_names['useranswers'+activate_tab][ele[i].name] = 'Not activated';
    //         }
    //         else {
    //             if(ele[i].checked) {
    //                 useranswer_names['useranswers'+activate_tab][ele[i].name] = ele[i].value;
    //             }

    //             else{
    //                 if(ele[i].name=="NoDraw"){
    //                     useranswer_names['useranswers'+activate_tab][ele[i].name] = 'Draw';
    //                 }
    //                 else if(ele[i].name=="WholeImage"){
    //                     useranswer_names['useranswers'+activate_tab][ele[i].name] = 'WholeImage';
    //                 }
    //                 }

    //         } 
                
    //     }
    //     else if(ele[i].type=="text") { 
    //         useranswer_names['useranswers'+activate_tab][ele[i].name]  = ele[i].value;
    //         }

    // } 
}

function ClearAll() { 
    for(i = 0; i < ele.length; i++) { 
          
        if(ele[i].type=="radio" || ele[i].type=="checkbox") { 
            ele[i].checked=false;
        }
        

        else if(ele[i].type=="text") { 
            ele[i].value="";
            }

    } 
    clearCanvas();
}

function DisplayCurrentAnswers(){
    for(i = 0; i < ele.length; i++) { 

        if (useranswer_names['useranswers'+activate_tab][ele[i].name])
        {
            tmpvalue=useranswer_names['useranswers'+activate_tab][ele[i].name];
            if(ele[i].type=="radio") 
            { 
                if(tmpvalue=="Y" && ele[i].value=="Y"){
                    ele[i].checked=true;
                }
                
                else if(tmpvalue=="N" && ele[i].value=="N"){
                    ele[i].checked=true;
                }
            }
            else if (ele[i].type=="checkbox"){
                // if(tmpvalue=="Draw" ||tmpvalue=="Not activated"){
                //     ele[i].checked=false;
                // }
                // else{ele[i].checked=true;
                // console.log(tmpvalue)

                if(tmpvalue=="WholeImage" ||tmpvalue=="CANNOT_DRAW"){
                    ele[i].checked=true;
                }
                else{
                    ele[i].checked=false;
                }
            }

            else if(ele[i].type=="text") { 
                ele[i].value=useranswer_names['useranswers'+activate_tab][ele[i].name] ;
                }

        }
    }

}


  
  



