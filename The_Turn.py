# Import necessary functions
from The_Setup import *

# Set video to be observed and timestamp to be used
video = "Carrara Court 2 Video.mp4"
timestamp = 300

# Set bland image and coloured in image
blank_image = "./sample_image/blank_test_image.PNG"
coloured_image = "./sample_image/blank_test_image_redupbluedown.png"

# Create our mask
testing_mask(blank_image,coloured_image)
# maybe_final_mask(timestamp,video)

# Establish our directory to be used
directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 

# Obtain position of first player
first_player_found = findFirstPlayerLocations(directory)
print("Lowest player is at width " + str(first_player_found[0]) + " and height " + str(first_player_found[1]) + ".")

# Obtain position of second player
second_player_found = findSecondPlayerLocations(first_player_found[0], first_player_found[1], directory)
print("Higher player is at width " + str(second_player_found[1]) + " and height " + str(second_player_found[0]) + ".")

# Determine number of colour matches for the first and second player
[p1_w,p1_h,m1,p2_w,p2_h,m2] = test_countColourMatches(first_player_found,second_player_found,coloured_image,False)

# Estimate player identities
display_player_identities(p1_w,p1_h,m1,p2_w,p2_h,m2)