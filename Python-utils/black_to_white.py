# ------------------------------------------------------------------------------#
#                                                                               #
#                                                                               #
#            Black to white image conversion for discord.py v0.16.8             #
#                                                                               #
#            Requires Pillow v4.2.1 for image conversion.                       #
#                                                                               #
#                                                                               #
# ------------------------------------------------------------------------------#

from PIL import Image
import urllib.request
import os
import shutil

# -----------------Race File Conversion----------------- #

if not os.path.exists('data/image/race/'):
    os.makedirs('data/image/race/')

fileurl = cfapimain_data[0]['icon']  # <-------Comes from API URL
file_name = "data/image/race/" + str(cfapimain_data[0]['name'] + "_black.png")  # <---Comes from API URL

# Download the file from `url` and save it locally under `file_name`:
with urllib.request.urlopen(fileurl) as response, open(file_name, 'wb') as out_file:
    shutil.copyfileobj(response, out_file)

img = Image.open(file_name).convert('RGBA')
r, g, b, a = img.split()


def invert(image):
    return image.point(lambda p: 255 - p)


r, g, b = map(invert, (r, g, b))

img2 = Image.merge(img.mode, (r, g, b, a))
new_file_name = img2.save("data/image/race/" + str(cfapimain_data[0]['name']) + "_white.png")

# ---------------End Race File Conversion -------------- #


# -----------------Class File Conversion----------------- #


if not os.path.exists("data/image/class/"):
    os.makedirs("data/image/class/")

fileurl = cfapimain_data[0]['icon']  # <-------Comes from API
file_name = "data/image/class/" + str(cfapimain_data[0]['name'] + "_black.png")  # <-------Comes from API

# Download the file from `url` and save it locally under `file_name`:
with urllib.request.urlopen(fileurl) as response, open(file_name, 'wb') as out_file:
    shutil.copyfileobj(response, out_file)
img = Image.open(file_name).convert('RGBA')
r, g, b, a = img.split()


def invert(image):
    return image.point(lambda p: 255 - p)


r, g, b = map(invert, (r, g, b))

img2 = Image.merge(img.mode, (r, g, b, a))
new_file_name = img2.save("data/image/class/" + str(cfapimain_data[0]['name']) + "_white.png")

# ---------------End Class File Conversion -------------- #