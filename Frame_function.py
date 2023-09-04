import numpy as np
import cv2
import os
import math

# For the players the json could be taken down from the db 
# with the new data added then overwrites the previous

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
        

def maybe_final_mask(timestamp):
    # calls the function that saves frames as images
    # saves the first frame in the video 
    # and the frame at the supplied timestamp

    millieseconds = timestamp*1000
    save_frame('../Video_seg_test/2023-08-21 09-23-42.mkv', 10000,'./sample_image/master_image.PNG')
    save_frame('../Video_seg_test/2023-08-21 09-23-42.mkv', millieseconds,'./sample_image/test_image.PNG')
    
    #Carrara Court 2 Video.MP4
    
    # loads the saved images into memory
    master_image = cv2.imread('./sample_image/master_image.PNG')
    pos_image = cv2.imread('./sample_image/test_image.PNG')

    
    # subtracts the master image from the timestamped image and saves the result as an image
    # BIG NOTE CHANGE LATER SO IT IS SCALABLE AND CAN BE USED WITH EVERYTHING
    # DON'T BE DUMB.
    # MAKE ANOTHER COPY SO THIS DOESN'T GET BLOATED WITH RAMMBALING COMMENTS
    image_sub = cv2.subtract(master_image, pos_image)
    court = np.zeros((1080,1920,1), dtype='uint8')
    shape = np.array([[703,503],[1214,503],[1580,1075],[333,1075]])
    # shape = np.array([[419,315],[837,319],[1090,706],[145,696]])
    cv2.fillPoly(court, pts=[shape],color=(255))
    court_mask = cv2.bitwise_and(image_sub, image_sub, mask=court)
    cv2.imwrite('./sample_image/result_image.PNG', court_mask)
    
    
    # this is just here to view the results easily won't be in the final iteration
    cv2.namedWindow("Original", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Original", 792, 412)
    cv2.imshow('Original', pos_image)
    cv2.waitKey(0)
    
    cv2.namedWindow("Mask", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Mask", 792, 412)
    cv2.imshow('Mask',court_mask)
    cv2.waitKey(0)
    
    cv2.destroyAllWindows()
    return court_mask
    
    
def pixel_coords(mask):
    # Getting length and width of mask image
    h, w, _ = mask.shape

    # Found that black points still had a little colour
    # so cutting that out below
    # showing affected points as blue    
#    for x in range(h-1,0,-1):
 #       for y in range(w-1,0,-1):
  #          rgb = mask[x,y]
   #         if rgb[0] < 50 and rgb[1] < 50 and rgb[2] < 50:
    #            mask[x,y] = [255,0,0]

    # Display our little blued out image
    cv2.namedWindow("Blue Mask", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Blue Mask", 792, 412)
    cv2.imshow('Blue Mask',mask)
    cv2.waitKey(0)
    
    # Find the lowest point and give it the colour of red
    break_out_flag = False     
    for x in range(h-1,0,-1):
        for y in range(w-200,200,-1):
            rgb = mask[x,y]
            if rgb[0] > 50 and rgb[1] > 50 and rgb[2] > 50:
#            if rgb[0] != 255:
                mask[x,y] = [0,0,255]
                if 200 < x+1 < w-200:
                    mask[x+1,y] = [0,0,255]
                if 200 < x-1 < w-200:
                    mask[x-1,y] = [0,0,255]
                if 0 < y+1 < h-1:
                    mask[x,y+1] = [0,0,255]
                if 0 < y-1 < h-1:
                    mask[x,y-1] = [0,0,255]
                print(f"It has been found that at height {x} width {y}, the lowest point occurs.")
                xcoord = y
                ycoord = x
                break_out_flag = True
                break
        if break_out_flag:
            break
        
    
    # Show the found lowest point a bit more clearly by blacking out everything thats not super red
    # this will be for testing
    for x in range(h-1,0,-1):
        for y in range(w-1,0,-1):
            rgb = mask[x,y]
            if rgb[2] != 255:
                mask[x,y] = [0,0,0]

    # Display our resulting lowest point
    cv2.namedWindow("Lowest Point", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Lowest Point", 792, 412)
    cv2.imshow('Lowest Point',mask)
    
    # Save image of lowest point
    lowest_point_path = "lowest_point_image.PNG"
    success = cv2.imwrite(f"./sample_image/{lowest_point_path}", mask)
    print("Directory " + lowest_point_path + " created. Result is " + str(success) + ".")
    
    cv2.waitKey(0)
    
    cv2.destroyAllWindows()
    return (xcoord, ycoord)   
    

def location(p_coords):
    # make code that creates a trapezoid mask from the four corner coords
    # after that figure out the math to to determine the coord
    # probably just if statements
    # check for T zone 3rd
    # order top left, top right, Tzone, bottom left, bottom right
    # if between so and so and between so and so
    # maybe split the them in half with the top half and the bottom half
    # the Tzone is going to be annoying
    # possible idea split the grid into 7
    # top right and top left remain unaffected
    # region where the the Tzone is split into 3 then under that is the rest of the bottom half 
    # this could of been written down better
    
    # a couple of if statements can change ratios later after the next meeting
    # 0.45 is pretty good to find the short line
    # the center line is just /2
    
    # the final will have the couch select the corners of the court 
    # and the left and right side of the short line
    
    # make an algorithm that sorts the coords into a certain order
    # order = TL, TR, SL, SR, BL, BR
    # O(N^2) with N being 6 and always 6 since 6 points are always given
    
    
    # these points will be what the couch selects in the final
    # might to standarise what corners they pick first
    shape = np.array([[703,503],[1214,503],[1580,1075],[333,1075]])
    #shape = np.array([[419,315],[837,319],[1090,706],[145,696]])
    short_line_y = (shape[3][1]+shape[0][1])*0.45
    sec_1_lower = short_line_y - (((shape[3][1]+shape[0][1])*0.5)-short_line_y)
    half_line = (shape[2][0]+shape[3][0])/2
    
    
    a1 = abs(shape[0][0]-shape[3][0])
    a2 = abs(shape[1][0]-shape[2][0])
    b1 = abs(shape[0][1]-shape[3][1])
    b2 = abs(shape[1][1]-shape[2][1])
    
    
    l_short_line_x = shape[0][0] - ((short_line_y - shape[0][1]) / math.tan(math.atan(b1 / a1)))
    
    r_short_line_x = shape[1][0] + ((short_line_y - shape[1][1]) / math.tan(math.atan(b2 / a2)))
    
    l_t_zone = (r_short_line_x - l_short_line_x) * 0.375 + l_short_line_x
    
    r_t_zone = (r_short_line_x - l_short_line_x) * 0.625 + l_short_line_x
    
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

#coords = pixel_coords(maybe_final_mask(20))
#print(coords)
#maybe_final_mask(12)
print(location(pixel_coords(maybe_final_mask(46))))


