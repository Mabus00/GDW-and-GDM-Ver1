from netCDF4 import Dataset
import xarray as xr
import os
import matplotlib.pyplot as plt

# Get the current working directory
cwd = os.getcwd()

# Path to the folder containing NetCDF files
folder_path = 'C:/Program Files/Apache Software Foundation/Tomcat 9.0/webapps/geoserver/data/giops_3D_data'

# Get a list of all filenames in the folder
file_names = os.listdir(folder_path)

# Iterate over each filename in the folder
for file_name in file_names:
    # Skip directories, if any
    if os.path.isdir(os.path.join(folder_path, file_name)):
        continue
    
    # Construct the full path to the NetCDF file
    file_path = os.path.join(folder_path, file_name)
    file_path = file_path.replace('\\', '/')

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

    # Create a new folder based on the original file name
    output_folder_name = file_name.split(".")[0]  # Remove the file extension
    output_folder_path = os.path.join(folder_path, output_folder_name)
    os.makedirs(output_folder_path, exist_ok=True)  # Create the folder if it doesn't exist
    
    # e.g., CMC_giops_votemper_depth_all_latlon0.2x0.2_24h-mean_2024042800_P024
    # giops_yyyymmddhh_HHH_3D_depth_votemper
    # Extract the date and time information from the filename
    date_str = file_name.split('_')[-2]
    time_str = file_name.split('_')[-1][1:-3]  # Extract the desired part

    # Get the depth dimension
    depth_dim = [dim for dim in ds.dims if 'depth' in dim][0]

    # Loop through each depth layer and save as a separate file
    for depth in ds[depth_dim].values:
        # Extract the data for the current depth layer
        layer_data = ds.sel({depth_dim: depth})

        # Format the depth value as a four-digit number with leading zeros
        depth_formatted = f"{depth:.2f}".replace('.', '').zfill(4)

        # Construct the output file name with the desired format
        output_filename = f"giops_{date_str}_{time_str}_3D_{depth_formatted}_votemper.nc"
        output_path = os.path.join(output_folder_path, output_filename)
        output_path = output_path.replace('\\', '/')
        
        # Save the depth layer as a separate netCDF file
        layer_data.to_netcdf(output_path)
        print(f'Saved depth layer {depth:.2f} to {output_path}')

        # Plot the depth layer
        # fig, ax = plt.subplots(figsize=(10, 6))
        # layer_data.votemper.plot(ax=ax)
        # ax.set_title(f'Depth Layer: {depth:.2f}')
        # plt.show()

        # e.g., CMC_giops_votemper_depth_all_latlon0.2x0.2_24h-mean_2024042800_P024
        # ``save depth levels as GT_yyyymmddhh_HHH_3D_zzzz_varname

    
    print(f"File saved:")

