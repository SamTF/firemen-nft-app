from PIL import Image, ImageDraw    # Importing PIL to generate and manipulate images
from itertools import permutations, product  # to generate character combinations
from io import BytesIO
import hashlib
import json


### CONSTANTS
PARTS_DIR       =   'character_parts/'
PARTS           =   ['eyes', 'mouth', 'hair']
TEMPLATE        =   'body-01.png'
TEMPLATE_IMG    =   Image.open(f'{PARTS_DIR}{TEMPLATE}')
VARIATIONS      =   6
OUTPUT_DIR      =   'characters/'



def generate_character_combos():
    '''
    Makes characters :)
    '''
    # combos = permutations(range(0, VARIATIONS), len(PARTS)) # THIS IS WRONG because it doesn't repeat numbers
    # i.e. it would never do (1,1,1) or (2,4,2) etc
    # so what we actually need is the Cartesian Product: https://stackoverflow.com/questions/3099987/generating-permutations-with-repetitions
    combos = product(range(0, VARIATIONS), repeat=len(PARTS))

    # Looping over all possible character permutations
    for c in combos:
        # Copying the template image
        canvas = TEMPLATE_IMG.copy()

        print(c)
        
        # Looping over every value in the tuple
        for i, value in enumerate(c):
            name = PARTS[i]                                                     # getting the part name by tuple index
            file_name = f'{PARTS_DIR}{name}_{value}-01.png'                     # getting the image's file name
            print(file_name)
            part = Image.open(file_name)                                        # opening the image
            canvas.paste(part, (0, 0), mask=part)                               # pasting it onto the canvas, using itself as alpha mask

        # Saving the character - file named after the permutation values
        name = f'{c[0]}{c[1]}{c[2]}'
        output = f'{OUTPUT_DIR}{name}.png'
        canvas.save(output, format='PNG')

        # Getting the image hash
        img_hash = get_image_hash(canvas)
        print(img_hash)

        # Saving the metadata
        create_metadata(name, img_hash)

        print("-------------------")


def get_image_hash(image: Image) -> str:
    '''
    Applies SHA256 to the byte content of the image.
    '''
    img_bytes = BytesIO()
    image.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    img_hash = hashlib.sha256(img_bytes.read()).hexdigest()

    return img_hash


def r(hash: str):
    '''
    Uses last byte of the image's hash and converts it from 0-15 to 0-100
    '''
    return int(hash[-1], 16) * 6.67


def get_gender(hash: str) -> str:
    '''
    Fun lil thing to get a random gender using the image hash.
    '''
    i = r(hash)

    if i >= 99:     return  'tomboy'
    if i >= 90:     return  'femboy'
    if i >= 80:     return  'non-binary'
    if i >= 40:     return  'female'

    return 'male'


def create_metadata(name: str, hash: str):
    '''
    Creates some metadata specific to the image.
    '''
    meta = {
        'name'          : name,
        'image'         : f'ipfs://{hash}',
        'description'   : 'lm learning web3 stuff, give me a break',
        'attributes'    : [{
            'rarity'    : r(hash),
            'gender'    : get_gender(hash)
        }]
    }

    with open(f'{OUTPUT_DIR}{name}.json', 'w+') as file:
        json.dump(meta, file)



generate_character_combos()