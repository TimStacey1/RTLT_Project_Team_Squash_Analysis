# Import necessary functions
from The_Setup import *
import unittest

class TestSquashMethods(unittest.TestCase):
    # Test that masks can be successfully created, stored, and recovered
    def test_maybe_final_mask(self):        
        # Define timestamp
        timestamp = 300
        # Set video to be observed
        video = "Carrara Court 2 Video.MP4"
        # Call function to save a mask
        maybe_final_mask(timestamp,video)
        mask_path = "mask_test_image.PNG"
        directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype" 
        os.chdir(directory)
        mask_obtained = cv2.imread(mask_path) 
        # Complete masking function here
        save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/Carrara Court 2 Video.MP4', 0,'./sample_image/test_image.PNG')
        save_frame('C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype/Carrara Court 2 Video.MP4', timestamp,'./sample_image/test_image2.PNG')
        master_image = cv2.imread('./sample_image/test_image.PNG')
        pos_image = cv2.imread('./sample_image/test_image2.PNG')    
        mask_created = cv2.subtract(master_image, pos_image) 
        # Assert our masks are the same
        result_difference = cv2.subtract(mask_obtained, mask_created)
        b, g, r = cv2.split(result_difference)
        result_1 = (b > 0).all()
        result_2 = (g > 0).all()
        result_3 = (r > 0).all()
        self.assertFalse(result_1)
        self.assertFalse(result_2)
        self.assertFalse(result_3)

    # Test that the first players location can be found in a real life image
    def test_findFirstPlayerLocations_1(self): 
        # Define timestamp
        timestamp = 300
        # Set video to be observed
        video = "Carrara Court 2 Video.MP4"
        # Call function to save a mask
        maybe_final_mask(timestamp,video)       
        # List true location
        true_location = [473, 575]
        # Establish our directory to be used
        directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
        # List found location
        found_location = findFirstPlayerLocations(directory)
        # Assert that the true and found location match
        self.assertEqual(true_location, found_location)

    # Test that the first players location can be found in a trial image
    def test_findFirstPlayerLocations_2(self):
        # Create our mask
        testing_mask("./sample_image/blank_test_image.PNG","./sample_image/blank_test_image_redupbluedown.png")   
        # Establish our directory to be used
        directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
        # Obtain our estimated first player location
        estimated_location = findFirstPlayerLocations(directory)
        # List true location
        true_location = [1125, 1006]
        # Assert that the true and found location match
        self.assertEqual(true_location, estimated_location)

    # Test that the second players location can be found in a real image
    def test_findSecondPlayerLocations_1(self):        
        # Define timestamp
        timestamp = 300
        # Set video to be observed
        video = "Carrara Court 2 Video.MP4"
        # Call function to save a mask
        maybe_final_mask(timestamp,video)
        # Define first player location
        first_player_location = [473,575]
        # Establish our directory to be used
        directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
        # Define expected second player location
        exp_second_player = [767,537]
        # Obtain determined second player location
        obt_second_player = findSecondPlayerLocations(first_player_location[0],first_player_location[1], directory)
        # Check theres a match
        self.assertEqual(exp_second_player, obt_second_player)

    # Test that the second players location can be found in a trial image
    def test_findSecondPlayerLocations_2(self):        
        # Set bland image and coloured in image
        blank_image = "./sample_image/blank_test_image.PNG"
        coloured_image = "./sample_image/blank_test_image_redupbluedown.png"
        # Create our mask
        testing_mask(blank_image,coloured_image)
        # Define first player location
        first_player_location = [825,675]
        # Establish our directory to be used
        directory = "C:/Users/lbken/OneDrive/Desktop/Semester 8/IFB399/Initial_Code/Masking_Function/prototype"
        # Define expected second player location
        exp_second_player = [1125,1006]
        # Obtain determined second player location
        obt_second_player = findSecondPlayerLocations(first_player_location[0],first_player_location[1], directory)
        # Check theres a match
        self.assertEqual(exp_second_player, obt_second_player)

    # Test countColourMatches to ensure expected counts are returned
    def test_countColourMatches_2(self):        
        # Set bland image and coloured in image
        blank_image = "./sample_image/blank_test_image.PNG"
        coloured_image = "./sample_image/blank_test_image_redupbluedown.png"
        # Create our mask
        testing_mask(blank_image,coloured_image)
        # Define first player location
        first_player_location = [1006,1125]
        # Define second player location
        second_player_location = [900,1277]
        # Obtain values. Note that
        console_entry = False
        [p1_w,p1_h,m1,p2_w,p2_h,m2] = test_countColourMatches(first_player_location,second_player_location,coloured_image,console_entry)
        # Assert that m2 is greater than m1
        self.assertTrue(m1>m2)

if __name__ == '__main__':
    unittest.main()