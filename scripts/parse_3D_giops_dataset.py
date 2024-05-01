from netCDF4 import Dataset
import os

# Path to the folder containing NetCDF files
folder_path = "C:/Program Files/Apache Software Foundation/Tomcat 9.0/webapps/geoserver/data/giops_3D_data"

# Get a list of all filenames in the folder
file_names = os.listdir(folder_path)

# Iterate over each filename in the folder
for file_name in file_names:
    # Skip directories, if any
    if os.path.isdir(os.path.join(folder_path, file_name)):
        continue
    
    # Construct the full path to the NetCDF file
    file_path = os.path.join(folder_path, file_name)
    
    # Open the NetCDF file
    nc_file = Dataset(file_path, "r")

    # Create a new folder based on the original file name
    output_folder_name = file_name.split(".")[0]  # Remove the file extension
    output_folder_path = os.path.join(folder_path, output_folder_name)
    os.makedirs(output_folder_path, exist_ok=True)  # Create the folder if it doesn't exist

    # Extract the depth levels
    depths = nc_file.variables["depth"][:]

    # Iterate over each depth level
    for i, depth in enumerate(depths):
        # Extract data for this depth level
        data = nc_file.variables["votemper"][0, i, :, :]  # Assuming time dimension is 0
        # Note: Change [0, i, :, :] indexing if time dimension is different
        rounded_depth = [round(depth, 2) for depth in depths]
        # Save data to a new netCDF file in the created folder
        output_file_path = os.path.join(output_folder_path, f"{file_name}_{rounded_depth}_votemper.nc")
        with Dataset(output_file_path, "w") as output_nc_file:
            # Create dimensions
            output_nc_file.createDimension("latitude", data.shape[0])
            output_nc_file.createDimension("longitude", data.shape[1])
            
            # Create variables
            latitude_var = output_nc_file.createVariable("latitude", "f4", ("latitude",))
            longitude_var = output_nc_file.createVariable("longitude", "f4", ("longitude",))
            votemper_var = output_nc_file.createVariable("votemper", "f4", ("latitude", "longitude"))
            
            # Assign data and attributes
            latitude_var[:] = nc_file.variables["latitude"][:]
            longitude_var[:] = nc_file.variables["longitude"][:]
            votemper_var[:, :] = data[:, :]
            votemper_var.units = "Kelvin"
            # Add more attributes if needed
            
        print(f"File saved: {output_file_path}")

    # Close the NetCDF file
    nc_file.close()
