// var init_time;
var activate_tab = "TAB1";
// var hitID = '';
// var assignmentID = '';
// var workerID = '';

var useranswer_names = {};
var XY_names = {};
var QA_names={};
var ele = document.getElementsByTagName('input'); 
var Step3Flag=false;
var searchParams = new URLSearchParams(window.location.search);
var input = searchParams.get("groupindex");
var workerID = searchParams.get("workerID");
var dataset=input.split("_")[0]
var group_id=input.split("_")[1]
var finishFlags={};
var finishStep12={};
var finishStep123={};
var Results={};
var worker =1;
// finishFlags['finishFlagTAB'+i]=false;


$(document).ready(function() {


    $('.btnNext').click(function(){
   
       $('.controlImg> .active').next('li').find('a').trigger('click');
     });
     
       $('.btnPrevious').click(function(){
       $('.controlImg > .active').prev('li').find('a').trigger('click');

     });
        
  
    
});

if (dataset=="val" || dataset=="train" ||dataset=="test"){  
    var tabnumber=5;       
}

else if (dataset=="qualification"){
    var tabnumber=10;
}

for (var i =1; i < tabnumber+1; i++){
    XY_names['xyTAB'+i]=[]; 
    useranswer_names['useranswersTAB'+i]={};
    QA_names['qaTAB'+i]={};
    finishFlags['finishFlagTAB'+i]=true;
    finishStep12['finishStep12TAB'+i]=true;
    finishStep123['finishStep123TAB'+i]=true;
}
//PLEASE NOTICE THAT: tab is indexed from 1 while QA pais are indexed from 1


loadQApairs=$.getJSON("/static/QA_annotations/"+dataset+"_grouped.json", function(data){
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

// loadQApairs=$.ajax({
//     type:'get',
//     url:"https://visualgrounding.ischool.utexas.edu/static/QA_annotations/"+dataset+"_grouped.json",
//     dataType:'json',
//     success:function(data){
//             for (j=1; j<tabnumber+1;j++){
//                 QA_names['qaTAB'+j]["Answer"]=data[group_id][j-1]["answers"][0];
//                 QA_names['qaTAB'+j]["Question"]=data[group_id][j-1]["question"];
//                 // QA_names['qaTAB'+j]["Imgsrc"]="/VizWiz_visualization_img/"+data[group_id][j-1]["image"];
//                 QA_names['qaTAB'+j]["Imgsrc"]="https://ivc.ischool.utexas.edu/VizWiz_visualization_img/"+data[group_id][j-1]["image"];

//                 }
                

// }}
// )

$ ('input[name=worker]').click(function(){SelectWorker();});

function SelectWorker(){
    
    if  (dataset=="qualification"||($('input[name=worker]:checked').val()=="1")){
        //select worker1
        worker = 1;
    }
    else{
        worker =2;
    }
    if (Results[worker]["Ready"]=="Yes"){  

        document.getElementById("browser").innerHTML="Browser: "+Results[worker]["browser"] ;
        document.getElementById("usetime").innerHTML="Consumed Time: "+Results[worker]["UseTime"] ;
        document.getElementById("workerid").innerHTML="Worker-ID: "+Results[worker]["Worker_id"] ;
        document.getElementById("hitid").innerHTML="HIT-ID: "+Results[worker]["Hit_id"] ;
        document.getElementById("comment").innerHTML="Comment: "+Results[worker]["comments"] ;
        for (j=1; j<tabnumber+1;j++){  
            useranswer_names['useranswersTAB'+j]=Results[worker]['useranswersTAB'+j];
            XY_names['xyTAB'+j]=Results[worker]['xyTAB'+j];
        
        }

        if (useranswer_names['useranswers'+activate_tab]["NoDraw"]=="" &&(XY_names['xy'+activate_tab].length!=0)){
            draw_canvas();
        }
        else{
            clearCanvas();
        }
        DisplayCurrentAnswers();
    }
}


if (dataset=="qualification"){      
    var Resultpath="/static/Results/quali_gt/LIVE_qualification_eva_results.json"
} 

else{         
    var Resultpath="/static/Results/mturk_results/all/all_annotations_results.json"
} 


loadResults=$.getJSON(Resultpath, function(data){

        if (dataset=="qualification"){   
            // console.log(workerID)
            // console.log(data[workerID])
            Results[1]=data[workerID][0];
            // for([key, val] of Object.entries(data)) {
            //     if (key!="qualification_0"){
            //         console.log(key,val)
            //     }

            // }
        } 
       
        else{    
            if (data[input]){         
            Results[1]=data[input][0];
            Results[2]=data[input][1];
        }
        }
 

}).fail(function(){
console.log("An error has occurred.");
});




// loadResults=$.ajax({
//     type:'get',
//     url:"https://visualgrounding.ischool.utexas.edu/static/Results/mturk_results/results.json",
//     dataType:'json',
//     success:function(data){
//         if (data[input] && data[input]["Ready"]=="Yes"){  

//                 document.getElementById("usetime").innerHTML="Consumed Time: "+data[input]["UseTime"] ;
//                 document.getElementById("hitid").innerHTML="HIT-ID: "+data[input]["Hit_id"] ;
//                 document.getElementById("comment").innerHTML="Comment: "+data[input]["comments"] ;
//                 for (j=1; j<tabnumber+1;j++){  
//                     useranswer_names['useranswersTAB'+j]=data[input]['useranswersTAB'+j];
//                     XY_names['xyTAB'+j]=data[input]['xyTAB'+j];
                
//                 }

//             }

// }
// }
// )

$.when(loadQApairs).done(function(){
    DisplayCurrentQApairs();
}

)

$.when(loadResults).done(function(){

    SelectWorker();
}

)



// Switch Tabs

function find_activated_tab(clicked_id)
{   
    
    activate_tab=clicked_id;
    ClearAll();
    DisplayCurrentAnswers();
    DisplayCurrentQApairs();
    
    if (useranswer_names['useranswers'+activate_tab]["NoDraw"]==""&&(XY_names['xy'+activate_tab].length!=0)){
        draw_canvas();
    }
}


function DisplayCurrentQApairs(){
    document.getElementById("answer").innerHTML="Answer: "+  QA_names['qa'+activate_tab]["Answer"];
    document.getElementById("question").innerHTML="Question: "+QA_names['qa'+activate_tab]["Question"];
    document.getElementById("image").src=QA_names['qa'+activate_tab]["Imgsrc"];
    
}


function ClearAll() { 
    for(i = 0; i < ele.length; i++) { 
          
        if((ele[i].type=="radio" && ele[i].name!="worker") || ele[i].type=="checkbox") { 
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


function next_href(){
    location.href='./visualization?groupindex='+ dataset+"_"+(parseInt(group_id)+1);
}
