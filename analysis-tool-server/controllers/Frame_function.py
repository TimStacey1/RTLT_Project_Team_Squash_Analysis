import numpy as np
import cv2
import os
import math
import sys

# This function saves a frame from a video with given timestamp
# right now it uses a frame and not a timestamp
def save_frame(video_path, timestamp, result_path):
    # opens the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return
    
    # checks if the result path exists
    # creates directories if it doesn'e exist
    os.makedirs(os.path.dirname(result_path), exist_ok=True)
    cap.set(cv2.CAP_PROP_POS_MSEC, timestamp)
    ret, frame = cap.read()

    if ret:
        # if a valid timestamp is supplied the image will be saved
        cv2.imwrite(result_path, frame)
        

def player_mask(timestamp,fileName,bounds,empty_time):
    # calls the function that saves frames as images
    # saves the first frame in the video 
    # and the frame at the supplied timestamp

    millieseconds = int(timestamp)*1000
    empty = int(empty_time)*1000
    save_frame(f'./videos/{fileName}.mp4', empty,'./temp_images/master_image.PNG')
    save_frame(f'./videos/{fileName}.mp4', millieseconds,'./temp_images/pos_image.PNG')
    
    cap = cv2.VideoCapture(f'./videos/{fileName}.mp4')
    if not cap.isOpened():
        return
    x = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    y = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    #Carrara Court 2 Video.MP4
    
    # loads the saved images into memory
    master_image = cv2.imread('./temp_images/master_image.PNG')
    pos_image = cv2.imread('./temp_images/pos_image.PNG')
    # subtracts the master image from the timestamped image and saves the result as an image
    image_sub = cv2.subtract(master_image, pos_image)
    court = np.zeros((int(y),int(x),1), dtype='uint8')
    shape = np.array([bounds[0],bounds[1],bounds[3],bounds[2]])
    cv2.fillPoly(court, pts=[shape],color=(255))
    court_mask = cv2.bitwise_and(image_sub, image_sub, mask=court)
    cv2.imwrite('./temp_images/result_image.PNG', court_mask)
    
    
    return court_mask
    
    
def pixel_coords(mask):
    # Getting length and width of mask image
    h, w, _ = mask.shape

    
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = mask[x,y]
            if rgb[0] > 50 or rgb[1] > 50 or rgb[2] > 50:
                xcoord = y
                ycoord = x
                break_out_flag = True
                break
        if break_out_flag:
            break
    return (xcoord, ycoord)   

def findSecondPlayerLocations(mask, a, b):
    # Create variables for the first player width
    f_width = a
    f_height = b
    # Get our Original Mask
    
    # Getting length and width of mask image
    h, w, _ = mask.shape

    # Create copy of Blue Mask called Second Player Position Mask for the lowest location after the first player's
    f_range = round(h*0.25)
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = mask[x,y]
            if rgb[0] > 50 or rgb[1] > 50 or rgb[2] > 50:
                mask[x,y] = [0,0,255]
                if not((f_width - f_range) < y < (f_width + f_range)):
                    break_out_flag = True
                    s_width = y
                    s_height = x
                    break
        if break_out_flag:
            break
        
    if (break_out_flag == False):
        s_width=f_width
        s_height=f_height
    return (s_width,s_height)
    



def countColourMatches(location1, location2, colors, player_num):
    try:
        master_image = cv2.imread('./temp_images/pos_image.PNG')
    except:
        print("Unable to obtain original image.")  
    
    splitColors = str(colors).split(',')
    
    
    # Obtain Player 1 colours
    if (int(player_num) == 1):
        p1_r = int(splitColors[0])
        p1_g = int(splitColors[1])
        p1_b = int(splitColors[2])
    else:
        p1_r = int(splitColors[3])
        p1_g = int(splitColors[4])
        p1_b = int(splitColors[5])

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



def location(p_coords,bounds):
    # these points will be what the couch selects
    shape = np.array([bounds[0],bounds[1],bounds[3],bounds[2],bounds[4],bounds[5]])
    short_line_y = shape[4][1]
    # top of the T-zone
    sec_1_lower = short_line_y - (((shape[3][1]+shape[0][1])*0.5)-short_line_y)
    half_line = (shape[2][0]+shape[3][0])/2
    
    l_t_zone = (shape[5][0]- shape[4][0]) * 0.375 + shape[4][0]
    
    r_t_zone = (shape[5][0]- shape[4][0]) * 0.625 + shape[4][0]
    # bottom of the T-zone
    sec_2_lower = sec_1_lower + abs(l_t_zone - r_t_zone)
    
    if p_coords[1] >= shape[0][1] and p_coords[1] <= sec_1_lower:
        if p_coords[0] < half_line:
            return 1
        return 2
    
    if p_coords[1] >= sec_1_lower and p_coords[1] <= short_line_y:
        if p_coords[0] < l_t_zone:
            return 1
        if p_coords[0] < r_t_zone:
            return 5
        return 2
    
    if p_coords[1] >= short_line_y and p_coords[1] <= sec_2_lower:
        if p_coords[0] < l_t_zone:
            return 3
        if p_coords[0] < r_t_zone:
            return 5
        return 4
    
    if p_coords[0] < half_line:
        return 3
    if p_coords[0] < shape[2][0]:
        return 4
    return -1


def boundsConverter(bounds,video_path):
    # JavaScript parses nested number arrays as a string seperating the values with commas
    fixed_bounds = str(bounds).split(',')

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return
    x = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    y = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    
    # ratio to convert the court bounds to fit the resolution of the video
    ratio_x = x/1280
    ratio_y = y/720

    new_bounds = np.array([[math.floor(float(fixed_bounds[0])*ratio_x),math.floor(float(fixed_bounds[1])*ratio_y)],
                          [math.floor(float(fixed_bounds[2])*ratio_x),math.floor(float(fixed_bounds[3])*ratio_y)],
                          [math.floor(float(fixed_bounds[4])*ratio_x),math.floor(float(fixed_bounds[5])*ratio_y)],
                          [math.floor(float(fixed_bounds[6])*ratio_x),math.floor(float(fixed_bounds[7])*ratio_y)],
                          [math.floor(float(fixed_bounds[8])*ratio_x),math.floor(float(fixed_bounds[9])*ratio_y)],
                          [math.floor(float(fixed_bounds[10])*ratio_x),math.floor(float(fixed_bounds[11])*ratio_y)]])
    
    return new_bounds


def playerLocations(timeStamp,fileName,courtBounds,color,player_num, empty_court): 
    current_bounds = boundsConverter(courtBounds, f'./videos/{fileName}.mp4')
    playerMask = player_mask(timeStamp, fileName, current_bounds, empty_court)
    pixelLocation = pixel_coords(playerMask)
    second_player = findSecondPlayerLocations(playerMask, pixelLocation[0], pixelLocation[1])
    if (pixelLocation[0]==second_player[0] and pixelLocation[1]==second_player[1]): 
        player1 = location(pixelLocation,current_bounds)
        player2 = location(second_player,current_bounds)
        return f"{player1} {player2}"
    else:
        order = countColourMatches(pixelLocation[0], second_player[0], color,player_num)
        if (order[0]>order[1]):
            player1 = location(pixelLocation,current_bounds)
            player2 = location(second_player,current_bounds)
            return f"{player1} {player2}"
        else:
            player1 = location(pixelLocation,current_bounds)
            player2 = location(second_player,current_bounds)
            return f"{player2} {player1}"


print(playerLocations(sys.argv[1], sys.argv[2], sys.argv[3], 
                      sys.argv[4], sys.argv[5], sys.argv[6]))

sys.stdout.flush()
