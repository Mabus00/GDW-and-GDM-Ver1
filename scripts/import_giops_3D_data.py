'''
code imports ten days of modelled giops 3D sea temperature data

'''

import os
import requests
import glob
from datetime import datetime
import re

# Define the base URL
base_url = "https://dd.weather.gc.ca/model_giops/netcdf/lat_lon/{nd}/{HH}/{hhh}/"

# Define parameters
nd = "3d"
HH = "12"
hhh_values = ["024", "048", "072", "096", "120", "144", "168", "192", "216", "240"]

# Create a folder to save the downloaded files
output_folder = "C:/Program Files/Apache Software Foundation/Tomcat 9.0/webapps/geoserver/data/giops_3D_data"
os.makedirs(output_folder, exist_ok=True)

# Delete all files in the output folder if they exist
file_paths = glob.glob(os.path.join(output_folder, "*"))
for file_path in file_paths:
    os.remove(file_path)

# Loop over hhh values and download data
for hhh in hhh_values:
    # Construct the URL
    url = base_url.format(nd=nd, HH=HH, hhh=hhh)

    # Send a GET request to download the file
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:

       # Split the response content by lines
        lines = response.content.decode("utf-8").split("\n")
        
        # Iterate over each line
        for line in lines:
            # Check if the line contains "votemper" and "20240501"
            if "votemper" in line and "20240501" in line:
               # Use regular expression to extract the filename
                match = re.search(r'href="([^"]+\.nc)"', line)
                if match:
                    file_name = match.group(1)
                    
                    # Define the output file path
                    output_file_path = os.path.join(output_folder, file_name)
                    
                    # Write the downloaded data to a file
                    with open(output_file_path, "wb") as output_file:
                        output_file.write(requests.get(url + file_name).content)
                        
                    print(f"Data downloaded successfully: {output_file_path}")
    else:
        print(f"Failed to download data for hhh = {hhh}")

print("All data downloaded successfully.")
