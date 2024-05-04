from netCDF4 import Dataset
import xarray as xr
import os

# Get the current working directory
cwd = os.getcwd()

# Path to the folder containing NetCDF files
folder_path = os.path.join(cwd, 'giops_3D_data')

# Get a list of all filenames in the folder
file_names = os.listdir(folder_path)

# Iterate over each filename in the folder
for file_name in file_names:
    # Skip directories, if any
    if os.path.isdir(os.path.join(folder_path, file_name)):
        continue
    
    # Construct the full path to the NetCDF file
    file_path = os.path.join(folder_path, file_name)
    #file_path = file_path.replace('\\', '/')

    # Open the NetCDF file
    ds = xr.open_dataset(file_path)

    ''' 
    Dimensions:             (longitude: 1800, latitude: 850, depth: 50, time: 1)
    Coordinates:
        * longitude           (longitude) float32 0.0 0.2 0.4 ... 359.4 359.6 359.8
        * latitude            (latitude) float32 -80.0 -79.8 -79.6 ... 89.4 89.6 89.8
        * depth               (depth) float32 0.494 1.541 ... 5.275e+03 5.728e+03
        * time                (time) datetime64[ns] 2024-05-05T12:00:00
        Data variables:
            latitude_longitude  int32 0
            votemper            (time, depth, latitude, longitude) float32 nan ... nan
        Attributes:
            Conventions:      CF-1.6
            title:            Instantaneous ice and ocean forecast fields
            institution:      The Canadian Centre for Meteorological and Environmenta...
            source:           Global Ice Ocean Prediction System: version 8.1.0
            product_version:  GIOPS_8.1.0_F3
            creation_date:    2024-May-04 16:29:52 UTC
            contact:          production-info@ec.gc.ca

    '''

    print(ds.votemper)

    # Create a new folder based on the original file name
    # output_folder_name = file_name.split(".")[0]  # Remove the file extension
    # output_folder_path = os.path.join(folder_path, output_folder_name)
    # os.makedirs(output_folder_path, exist_ok=True)  # Create the folder if it doesn't exist

    # output_file_path = os.path.join(output_folder_path, f"{file_name}_{rounded_depth}_votemper.nc")
    
    print(f"File saved:")

