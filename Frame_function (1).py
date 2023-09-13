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


# Function for determining how many pixels in a range match that of a Player 1's colour
def countColourMatches(location1,location2):
    #save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/Carrara Court 2 Video.MP4', 0,'./sample_image/test_image.PNG')
    try:
        master_image = cv2.imread('./sample_image/test_image2.PNG')
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
    h, w, _ = master_image.shape    

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
            pixel = master_image[x,y]
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
            pixel = master_image[x,y]
            if((p1_b-colour_range)<pixel[0]<(p1_b+colour_range)):
                if((p1_g-colour_range)<pixel[1]<(p1_g+colour_range)):
                    if((p1_r-colour_range)<pixel[2]<(p1_r+colour_range)):
                        match2 = match2+1
    
    return [match1,match2]      



def maybe_final_mask(timestamp):
    save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/Carrara Court 2 Video.MP4', 0,'./sample_image/test_image.PNG')
    save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/Carrara Court 2 Video.MP4', timestamp,'./sample_image/test_image2.PNG')
    master_image = cv2.imread('./sample_image/test_image.PNG')
    pos_image = cv2.imread('./sample_image/test_image2.PNG')
    
    mask = cv2.subtract(master_image, pos_image)
    
    cv2.namedWindow("Original", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Original", 792, 412)
    
    cv2.imshow('Original', pos_image)
    cv2.waitKey(0)  

    # Save mask before lowest point is found
    mask_path = "mask_test_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 
    os.chdir(directory)
    cv2.imwrite(mask_path, mask)    
    
    cv2.waitKey(0) 
    
    cv2.destroyAllWindows()
    
    
def findFirstPlayerLocations():
    # Get our Original Mask
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 
    os.chdir(directory)
    mask = cv2.imread('./mask_test_image.PNG')

    # display the mask and masked image      
    cv2.namedWindow("Mask", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Mask", 792, 412)  
    cv2.imshow('Mask',mask)
    cv2.waitKey(0)
    
    # Getting length and width of mask image
    h, w, _ = mask.shape

    # Make a copy of Mask called Blue Mask
    blue_mask = mask

    # Found that black points still had a little colour, so cutting that out below, showing affected points as blue.    
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = blue_mask[x,y]
            if rgb[0] < 50 and rgb[1] < 50 and rgb[2] < 50:
                blue_mask[x,y] = [255,0,0]

    # Display our little blued out image
    cv2.namedWindow("Blue Mask", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Blue Mask", 792, 412)
    cv2.imshow('Blue Mask',blue_mask)
    cv2.waitKey(0)

    # Create a copy of Blue Mask called First Player Position for finding our current lowest point.
    fpp_mask = blue_mask

    # Create variables for the first player height and width
    f_height = 0
    f_width = 0
    
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = fpp_mask[x,y]
            if rgb[0] != 255:
                fpp_mask[x,y] = [0,0,255]
                f_width = y
                f_height = x
                if 200 < x+1 < w-200:
                    fpp_mask[x+1,y] = [0,0,255]
                if 200 < x-1 < w-200:
                    fpp_mask[x-1,y] = [0,0,255]
                if 0 < y+1 < h-1:
                    fpp_mask[x,y+1] = [0,0,255]
                if 0 < y-1 < h-1:
                    fpp_mask[x,y-1] = [0,0,255]
                break_out_flag = True
                break
        if break_out_flag:
            break
    
    # Show the found lowest point a bit more clearly by blacking out everything thats not super red
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = fpp_mask[x,y]
            if rgb[2] != 255:
                fpp_mask[x,y] = [0,0,0]
    
    # Display our resulting lowest point
    cv2.namedWindow("Lowest Point First Player", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Lowest Point First Player", 792, 412)
    cv2.imshow('Lowest Point First Player',fpp_mask)    
    cv2.waitKey(0)
    
    # Save image of lowest point
    f_lowest_point_path = "f_lowest_point_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
    os.chdir(directory) 
    cv2.imwrite(f_lowest_point_path, fpp_mask)    

    cv2.waitKey(0) 
    
    cv2.destroyAllWindows()

    return [f_width,f_height]


def findSecondPlayerLocations(a):
    # Create variables for the first player width
    f_width = a
    
    # Get our Original Mask
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 
    os.chdir(directory)
    mask = cv2.imread('./mask_test_image.PNG')
    
    # Getting length and width of mask image
    h, w, _ = mask.shape

    # Make a copy of Mask called Blue Mask
    blue_mask = mask

    # Found that black points still had a little colour, so cutting that out below, showing affected points as blue.    
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = blue_mask[x,y]
            if rgb[0] < 50 and rgb[1] < 50 and rgb[2] < 50:
                blue_mask[x,y] = [255,0,0]

    # Create copy of Blue Mask called Second Player Position Mask for the lowest location after the first player's
    # location is ignored.
    spp_mask = blue_mask

    # Cut out our first players location
    for x in range(0,h-1):
        for y in range(0,w-1):
            if y < 200 or y > w-200:
                spp_mask[x,y] = [255,0,0]
            else:
                pass           
            if (f_width - 100) < y < (f_width + 100):
                spp_mask[x,y] = [255,0,0] 
            else:
                pass

    # Display our relevant search area for the second player out image
    cv2.namedWindow("Second Player Search Area", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Second Player Search Area", 792, 412)
    cv2.imshow('Second Player Search Area',spp_mask)
    
    
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = spp_mask[x,y]
            if rgb[0] != 255:
                spp_mask[x,y] = [0,0,255]
                s_width = y
                s_height = x
                if 200 < x+1 < w-200:
                    spp_mask[x+1,y] = [0,0,255]
                if 200 < x-1 < w-200:
                    spp_mask[x-1,y] = [0,0,255]
                if 0 < y+1 < h-1:
                    spp_mask[x,y+1] = [0,0,255]
                if 0 < y-1 < h-1:
                    spp_mask[x,y-1] = [0,0,255]
                break_out_flag = True
                break
        if break_out_flag:
            break
    
    # Show the found lowest point a bit more clearly by blacking out everything thats not super red
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = spp_mask[x,y]
            if rgb[2] != 255:
                spp_mask[x,y] = [0,0,0]
    
    # Display our resulting lowest point
    cv2.namedWindow("Lowest Point", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Lowest Point", 792, 412)
    cv2.imshow('Lowest Point',spp_mask)    
    cv2.waitKey(0)
    
    # Save image of lowest point
    s_lowest_point_path = "s_lowest_point_image.PNG"
    directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
    os.chdir(directory) 
    cv2.imwrite(s_lowest_point_path, spp_mask)    

    cv2.waitKey(0) 
    
    cv2.destroyAllWindows()

    return [s_width,s_height]

# Create our mask
maybe_final_mask(300)

# Obtain position of first player
[w1,h1] = findFirstPlayerLocations()
print("Lowest player is at " + str(w1) + ".")

# Obtain position of second player
[w2,h2] = findSecondPlayerLocations(w1)
print("Higher player is at " + str(w2) + ".")



# Determine number of colour matches for the first and second player
[m1,m2] = countColourMatches(w1,w2)

# Estimate player identities
if(m1>m2):
    print("Player 1: Height = " + str(h1) + ", Width = " + str(w1) + ".")
    print("Player 2: Height = " + str(h2) + ", Width = " + str(w2) + ".")
    print("Option 1 as " + str(m1) + " is greater than " + str(m2) + ".")
else:
    print("Player 1: Height = " + str(h2) + ", Width = " + str(w2) + ".")
    print("Player 2: Height = " + str(h1) + ", Width = " + str(w1) + ".")
    print("Option 2 as " + str(m2) + " is greater than " + str(m1) + ".")


    
    