import numpy as np
import cv2
import matplotlib.pyplot as plt
#This file is only used in two_alignments.py
# Routes.py has its own IoU function!
def Toarray(xycoo):
    xycooArray=[[xy["x"],xy["y"]] for xy in xycoo]
    return xycooArray

def IoU(xy1,xy2):
    img1 = np.zeros((500,400,3),np.uint8)
    img2 = np.zeros((500,400,3),np.uint8)
    pts1=np.array(Toarray(xy1),np.int32)
    pts2=np.array(Toarray(xy2),np.int32)
    gt=cv2.fillPoly(img1,[pts1],(255,255,255))
    
    usr=cv2.fillPoly(img2,[pts2],(255,255,255))
    # cv2.imshow("filledPolygon",gt)
    # cv2.waitKey(0)
    ROIand = cv2.bitwise_and(gt, usr)
    ROIor = cv2.bitwise_or(gt, usr)
    # print(np.sum(ROIand))
    # print(np.sum(ROIor))
    iou_score = np.sum(ROIand) / np.sum(ROIor)
    return iou_score


if __name__ == "__main__":

    GTpolygon=[
    {
        "x": 97,
        "y": 242
    },
    {
        "x": 73,
        "y": 466
    },
    {
        "x": 139,
        "y": 480
    },
    {
        "x": 240,
        "y": 494
    },
    {
        "x": 274,
        "y": 264
    },
    {
        "x": 223,
        "y": 257
    },
    {
        "x": 97,
        "y": 242
    }] 

    userpolygon=[
    {
        "x": 238.5,
        "y": 472
    },
    {
        "x": 142.5,
        "y": 459
    },
    {
        "x": 137.5,
        "y": 476
    },
    {
        "x": 239.5,
        "y": 492
    },
    {
        "x": 238.5,
        "y": 472
    }]
    print(IoU(GTpolygon,userpolygon))