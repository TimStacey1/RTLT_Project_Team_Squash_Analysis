import numpy as np
import cv2
import os

success : bool
break_out_flag : bool

# This function saves a frame from a video with given timestamp
# right now it uses a frame and not a timestamp
def save_frame(video_path, timestamp, result_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return    
    os.makedirs(os.path.dirname(result_path), exist_ok=True)    
    cap.set(cv2.CAP_PROP_POS_FRAMES, timestamp)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(result_path, frame)  

def testing_mask(master,pos):
    master_image = cv2.imread(master)
    pos_image = cv2.imread(pos)    
    mask = cv2.subtract(master_image, pos_image) 
    # Save mask before lowest point is found
    mask_path = "mask_test_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 
    os.chdir(directory)
    cv2.imwrite(mask_path, mask) 

def maybe_final_mask(timestamp,video_file):
    save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/' + video_file +'', 0,'./sample_image/empty.PNG')
    save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/' + video_file +'', timestamp,'./sample_image/playing.PNG')
    master_image = cv2.imread('./sample_image/empty.PNG')
    pos_image = cv2.imread('./sample_image/playing.PNG')    
    mask = cv2.subtract(master_image, pos_image) 
    # Save mask before lowest point is found
    mask_path = "mask_test_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 
    os.chdir(directory)
    cv2.imwrite(mask_path, mask)     
    
    
def findFirstPlayerLocations(directory):
    # Get our Mask
    os.chdir(directory)
    mask = cv2.imread('./mask_test_image.PNG') 
    # Getting length and width of mask image
    h, w, _ = mask.shape
    # Create variables for the first player height and width
    f_height = 0
    f_width = 0    
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = mask[x,y]
            if rgb[0] > 50 or rgb[1] > 50 or rgb[2] > 50:
                mask[x,y] = [0,0,255]
                f_width = y
                f_height = x
                for g in range(1,10):
                    if 200 < x+g < w-200:
                        mask[x+g,y] = [0,0,255]
                    if 200 < x-g < w-200:
                        mask[x-g,y] = [0,0,255]
                    if 0 < y+g < h-1:
                        mask[x,y+g] = [0,0,255]
                    if 0 < y-g < h-1:
                        mask[x,y-g] = [0,0,255]
                break_out_flag = True
                break
        if break_out_flag:
            break    
    # Show the found lowest point a bit more clearly by blacking out everything thats not super red
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = mask[x,y]
            if rgb[2] != 255:
                mask[x,y] = [0,0,0]    
    # Save image of lowest point
    f_lowest_point_path = "f_lowest_point_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
    os.chdir(directory) 
    cv2.imwrite(f_lowest_point_path, mask) 
    return [f_width,f_height]


def findSecondPlayerLocations(a, b, directory):
    # Create variables for the first player width
    f_width = a
    f_height = b    
    # Get our Mask
    os.chdir(directory)
    mask = cv2.imread('./mask_test_image.PNG')    
    # Getting length and width of mask image
    h, w, _ = mask.shape
    # Define range of player 1
    f_range = round(h*0.25)  
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = mask[x,y]
            if (f_width - f_range) < y < (f_width + f_range):
                pass
            elif(rgb[0] > 50 or rgb[1] > 50 or rgb[2] > 50):
                mask[x,y] = [0,0,255]
                s_width = y
                s_height = x
                for g in range(1,10):
                    if 200 < x+g < w-200:
                        mask[x+g,y] = [0,0,255]
                    if 200 < x-g < w-200:
                        mask[x-g,y] = [0,0,255]
                    if 0 < y+g < h-1:
                        mask[x,y+g] = [0,0,255]
                    if 0 < y-g < h-1:
                        mask[x,y-g] = [0,0,255]
                break_out_flag = True
                break
        if break_out_flag:
            break     
    # If no other points are found on the mask, assign player 1's location to player 2's location
    if(not break_out_flag):
        mask[f_width,f_height] = [0,0,255]
        s_width = f_width
        s_height = f_height
        for g in range(1,10):
            if 200 < x+g < w-200:
                mask[x+g,y] = [0,0,255]
            if 200 < x-g < w-200:
                mask[x-g,y] = [0,0,255]
            if 0 < y+g < h-1:
                mask[x,y+g] = [0,0,255]
            if 0 < y-g < h-1:
                mask[x,y-g] = [0,0,255]
    # Show the found lowest point a bit more clearly by blacking out everything thats not super red
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = mask[x,y]
            if rgb[2] != 255:
                mask[x,y] = [0,0,0]
    # Save image of lowest point
    s_lowest_point_path = "s_lowest_point_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
    os.chdir(directory) 
    cv2.imwrite(s_lowest_point_path, mask) 
    return [s_width,s_height]


# Function for determining how many pixels in a range match that of a Player 1's colour
def countColourMatches(location1,location2):
    try:
        examined_image = cv2.imread("./sample_image/playing.PNG")
    except:
        print("Unable to obtain original image.")     
    # Obtain Player 1 colours
    print("Please enter the red, green, and blue colours of Player 1's shirt, separated by commas and spaces:")
    p1_rgb = input()
    p1_rgb = p1_rgb.split(", ")
    p1_r = int(p1_rgb[0])
    p1_g = int(p1_rgb[1])
    p1_b = int(p1_rgb[2])
    # Getting length and width of master image
    h, w, _ = examined_image.shape    
    if(location1-50 > 0):
        far_left1 = location1-50
    else:
        far_left1 = 0
    if(location1+50 < w):
        far_right1 = location1+50
    else:
        far_right1 = 0    
    # Initialise count variable for seeing how many pixels match
    match1 = 0
    # Create range to check all pixels
    colour_range = 25
    # Count the matches
    for x in range(0,h-1):
        for y in range(far_left1,far_right1):
            pixel = examined_image[x,y]
            if((p1_b-colour_range)<pixel[0]<(p1_b+colour_range)):
                if((p1_g-colour_range)<pixel[1]<(p1_g+colour_range)):
                    if((p1_r-colour_range)<pixel[2]<(p1_r+colour_range)):
                        match1 = match1+1
    if(location2-50 > 0):
        far_left2 = location2-50
    else:
        far_left2 = 0
    if(location2+50 < w):
        far_right2 = location2+50
    else:
        far_right2 = 0    
    # Initialise count variable for seeing how many pixels match
    match2 = 0
    # Count the matches
    for x in range(0,h-1):
        for y in range(far_left2,far_right2):
            pixel = examined_image[x,y]
            if((p1_b-colour_range)<pixel[0]<(p1_b+colour_range)):
                if((p1_g-colour_range)<pixel[1]<(p1_g+colour_range)):
                    if((p1_r-colour_range)<pixel[2]<(p1_r+colour_range)):
                        match2 = match2+1    
    p1_location = [0,0]
    p2_location = [0,0]
    if(match1>match2):
        p1_location[0] = location1[0]
        p1_location[1] = location1[1]
        p1_count = match1
        p2_location = location2[0]
        p2_location = location2[1]
        p2_count = match2
    elif(match1==match2):
        p1_location[0] = p2_location[0] = location1[0]
        p1_location[1] = p2_location[1] = location1[1]
        p1_count = p2_count = match1
    else:
        p1_location = location2[0]
        p1_location = location2[1]
        p1_count = match2
        p2_location = location1[0]
        p2_location = location1[1]
        p2_count = match1
    
    return [p1_location,p1_count,p2_location,p2_count]

# Function for determining how many pixels in a range match that of a Player 1's colour
def test_countColourMatches(location1,location2, examined, console_entry):
    #save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/Carrara Court 2 Video.MP4', 0,'./sample_image/playing.PNG')
    try:
        examined_image = cv2.imread(examined)
    except:
        print("Unable to obtain original image.")     
    # Obtain Player 1 colours
    if(console_entry):
        print("Please enter the red, green, and blue colours of Player 1's shirt, separated by commas and spaces:")
        p1_rgb = input()
    else:
        p1_rgb = "236, 42, 49"
    
    p1_rgb = p1_rgb.split(", ")
    p1_r = int(p1_rgb[0])
    p1_g = int(p1_rgb[1])
    p1_b = int(p1_rgb[2])
    # Getting length and width of master image
    h, w, _ = examined_image.shape   
    # Create range for count
    ranges = round(1080*0.069) 
    if(location1[0]-ranges > 0):
        far_left1 = location1[0]-ranges
    else:
        far_left1 = 0
    if(location1[0]+ranges < w):
        far_right1 = location1[0]+ranges
    else:
        far_right1 = 0    
    # Initialise count variable for seeing how many pixels match
    match1 = 0
    # Create range to check all pixels
    colour_range = 25
    # Count the matches
    for x in range(0,int(h)-1):
        for y in range(far_left1,far_right1):
            pixel = examined_image[x,y]
            if((p1_b-colour_range)<pixel[0]<(p1_b+colour_range)):
                if((p1_g-colour_range)<pixel[1]<(p1_g+colour_range)):
                    if((p1_r-colour_range)<pixel[2]<(p1_r+colour_range)):
                        match1 = match1+1
    if(location2[0]-ranges > 0):
        far_left2 = location2[0]-ranges
    else:
        far_left2 = 0
    if(location2[0]+ranges < w):
        far_right2 = location2[0]+ranges
    else:
        far_right2 = 0    
    # Initialise count variable for seeing how many pixels match
    match2 = 0
    # Count the matches
    for x in range(0,int(h)-1):
        for y in range(far_left2,far_right2):
            pixel = examined_image[x,y]
            if((p1_b-colour_range)<pixel[0]<(p1_b+colour_range)):
                if((p1_g-colour_range)<pixel[1]<(p1_g+colour_range)):
                    if((p1_r-colour_range)<pixel[2]<(p1_r+colour_range)):
                        match2 = match2+1    
    
    p1_w = 0
    p1_h = 0
    p2_w = 0
    p2_h = 0
    
    if(match1>match2):
        p1_w = location1[0]
        p1_h = location1[1]
        p1_count = match1
        p2_w = location2[0]
        p2_h = location2[1]
        p2_count = match2
    elif(match1==match2):
        p1_w = p2_w = location1[0]
        p1_h = p2_h = location1[1]
        p1_count = p2_count = match1
    else:
        p1_w = location2[0]
        p1_h = location2[1]
        p1_count = match2
        p2_w = location1[0]
        p2_h = location1[1]
        p2_count = match1
    
    return [p1_w,p1_h,p1_count,p2_w,p2_h,p2_count]


def display_player_identities(p1_w, p1_h, p1_count, p2_w, p2_h, p2_count):
    print("Player 1: Height = " + str(p1_h) + ", Width = " + str(p1_w) + ". Colour matches were " + str(p1_count) + ".")
    print("Player 2: Height = " + str(p2_h) + ", Width = " + str(p2_w) + ". Colour matches were " + str(p2_count) + ".")


    