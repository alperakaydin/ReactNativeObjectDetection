import os
import tempfile

from google.cloud import storage, vision
from wand.image import Image
from wand.drawing  import Drawing
from wand.color import Color 

storage_client = storage.Client()
client = vision.ImageAnnotatorClient()
def detect_multiple_objects(data, context):


    file_name = data['name']
    bucket_name = data['bucket']
    if file_name.startswith("output"):
        print(f"The image {file_name} is already detected.")
        return
    else:
        blob = storage_client.bucket(bucket_name).get_blob(file_name)
        blob_uri = f"gs://{bucket_name}/{file_name}"
        blob_source = vision.Image(source=vision.ImageSource(gcs_image_uri=blob_uri))

    
    
    # image = vision.types.Image(image=blob_source).
    # response = client.object_localization(image=image)

    # localized_object_annotations = response.localized_object_annotations


    objects = client.object_localization(image=blob_source).localized_object_annotations

    # localized_object_annotations = response.localized_object_annotations


    file_name = blob.name
    _, temp_local_filename = tempfile.mkstemp()

    # Download file from bucket.
    blob.download_to_filename(temp_local_filename)
    print(f"Image {file_name} was downloaded to {temp_local_filename}.")


    for obj in objects:
        with Image(filename=temp_local_filename) as image:
            with Drawing() as draw:
                x1 = int(image.width * obj.bounding_poly.normalized_vertices[0].x)
                y1 = int(image.height * obj.bounding_poly.normalized_vertices[0].y)
                x2 = int(image.width * obj.bounding_poly.normalized_vertices[2].x)
                y2 = int(image.height * obj.bounding_poly.normalized_vertices[2].y)

                print(f"The image {image.height}  :  {image.width}  \n  ---{x1}--{y1}---\n---{x2}--{y2}--- is rectangular detected.\n")
                
                draw.fill_color = Color('TRANSPARENT')
                draw.stroke_width = 4
                draw.stroke_color = Color('red')
                draw.rectangle( left=x1, top=y1, right=x2,   bottom=y2 )
                
                draw.font = 'wandtests/assets/League_Gothic.otf'
                draw.font_size = 40
                percentScore = int(obj.score*100)
                textDraw = f'{obj.name} %{percentScore}'
                draw.text(x1, y1, str(textDraw))
                
                
                #print(f"The image {image.height}  :  {image.width}  \n  ---{obj.bounding_poly.normalized_vertices[0].x}--{obj.bounding_poly.normalized_vertices[0].y}---\n---{obj.bounding_poly.normalized_vertices[2].x}--{obj.bounding_poly.normalized_vertices[2].y}--- is rectangular detected.\n")
                #draw.fill_color = Color('TRANSPARENT')
                #draw.stroke_width = 4
                #draw.stroke_color = Color('red')
                
                #draw.rectangle(left=(image.width * obj.bounding_poly.normalized_vertices[0].x),
                #    top=(image.height * obj.bounding_poly.normalized_vertices[0].y),
                #    right=(image.width * obj.bounding_poly.normalized_vertices[2].x),
                #    bottom=(image.height * obj.bounding_poly.normalized_vertices[2].y))
                    
                draw(image)
            image.save(filename=temp_local_filename)


    blur_bucket = storage_client.bucket("rnimagepicker-1ca25.appspot.com")
    new_blob = blur_bucket.blob("outputs/detected-"+file_name)
    new_blob.upload_from_filename(temp_local_filename)
    print(f" image uploaded to-: {file_name}")

