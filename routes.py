from flask import Flask, render_template, request,jsonify
import numpy as np
import json
import cv2
from flask_cors import cross_origin
import boto3
app = Flask(__name__)

# two decorators, same function
@app.route('/')
@app.route('/base')
def base():
    return render_template('base.html', the_title='VizWiz-Visual Grounding')

@app.route('/index')
def index():
    return render_template('index.html', the_title='VizWiz-Visual Grounding')

@app.route('/visualization')
def visual():
    return render_template('visualization.html', the_title='Visualization-Visual Grounding')
@app.route('/visualizationQ')
def visualQ():
    return render_template('visualizationQ.html', the_title='Visualization-qualification')

@app.route('/qualificationGT')
def qualifiationGT():
    return render_template('qualification.html', the_title='Qualification-Visual Grounding-GroundTruth Collection')

@app.route('/qualification')
def qualification():
    return render_template('qualification.html', the_title='Qualification-Visual Grounding')

@app.route('/IoUshow',methods=['GET','POST'])
def IoUshow():
    return render_template('IoUshow.html')
#background process happening without any refreshing
@app.route('/getIOU',methods=['GET','POST'])
@cross_origin()
def getIOU():
    if request.method=="GET":
        
        return ("nothing")
    if request.method=="POST":
        # print(request.form)
        # print(request.form.getlist("gt[x]"))
        postedJson=request.get_json()
        GTpolygon=postedJson["gt"]
        userpolygon=postedJson["ev"]
        # iouscore=str(IoU(GTpolygon,userpolygon))
        return (IoU(GTpolygon,userpolygon))
def Toarray(xycoo):
    xycooArray=[[xy["x"],xy["y"]] for xy in xycoo]
    return xycooArray

def IoU(xy1,xy2):
    img1 = np.zeros((400,500,3),np.uint8)
    img2 = np.zeros((400,500,3),np.uint8)
    pts1=np.array(Toarray(xy1),np.int32)
    pts2=np.array(Toarray(xy2),np.int32)
    gt=cv2.fillPoly(img1,[pts1],(255,255,255))
    usr=cv2.fillPoly(img2,[pts2],(255,255,255))
    ROIand = cv2.bitwise_and(gt, usr)
    ROIor = cv2.bitwise_or(gt, usr)

    intersection = np.sum(ROIand)
    union = np.sum(ROIor)
    iou_score = intersection /  union
    return jsonify({"iou":str(iou_score),"intersection":str(intersection),"union":str(union)})




@app.route('/AssociateQworker',methods=['GET','POST'])
@cross_origin()
def AssociateQworker():
    if request.method=="GET":
        return ("nothing")
    if request.method=="POST":
        
        live="false"
        worker_id=""
        task="qualification_eva"
        
        
        if live=="true" or live=="True":
            environment="LIVE"
            Qid=''
            keys_id=""
            keys=""
            endpoint="https://mturk-requester.us-east-1.amazonaws.com"
        else:
            environment="SANDBOX"
            Qid=''
            keys_id=""
            keys=""
            endpoint="https://mturk-requester-sandbox.us-east-1.amazonaws.com"

        hitID_path=environment+"_"+task+'_hitID.txt'#'/home/cc67459/VizWizEK/visualgrounding/'+
        mturk = boto3.client('mturk',
        aws_access_key_id = keys_id,
        aws_secret_access_key = keys,
        region_name='us-east-1',
        endpoint_url = endpoint
        )
        with open (hitID_path,'r') as f:
            lines=f.read().splitlines()
        for line in lines:
            hit_id = line.split(";")[1].split(":")[1]
            print("HIT-ID",hit_id)
            worker_results = mturk.list_assignments_for_hit(HITId=hit_id,AssignmentStatuses=['Submitted'])#'Approved',Submitted,Rejected
            if worker_results['NumResults'] > 0:
                for assignment in worker_results['Assignments']:
                    worker_id = assignment["WorkerId"]
                    print(worker_id)
                    response = mturk.associate_qualification_with_worker(
                    QualificationTypeId=Qid,
                    WorkerId=worker_id,
                    IntegerValue=123,
                    SendNotification=True
                    )
                
                print("Worker-ID",worker_id)
        if worker_id=="":
            return "2"
        else:
            return "1"
        
        # postedJson=request.get_json()
        # worker_id=postedJson["workerID"]
        # response = mturk.associate_qualification_with_worker(
        # QualificationTypeId=Qid,
        # WorkerId=worker_id,
        # IntegerValue=123,
        # SendNotification=True
        # )





















if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True, port=8898)
