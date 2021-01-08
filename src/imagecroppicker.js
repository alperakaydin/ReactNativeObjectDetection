import React, { useState, useEffect } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, FlatList } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml';


const imagecroppicker = () => {

  const [image, setImage] = useState(null)
  const [images, setImages] = useState(null)
  const [allImages, setAllImages] = React.useState([]);
  let imageUrl2 = 'https://1.bp.blogspot.com/-SRPHo0XPj70/XhbrrXbCb1I/AAAAAAAAAnM/H8cM_ukqsOA1X9tV9QX0bUWE_AfoSnFJgCPcBGAYYCw/s320/reactnative-logo.jpg';
  let imageUrl = 'https://cdn.iconscout.com/icon/free/png-512/react-native-555397.png';
  const localFile = `file:///storage/emulated/0/Android/data/com.rnimagepicker/files/Pictures/newResim.jpeg`;

  const pickSingleWithCamera = (cropping, mediaType = 'photo') => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        console.log('received image', image);
        setImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        })
        setImages(null)
      })
      .catch((e) => alert(e));
  }

  const pickSingle = (cropit, circular = false, mediaType) => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
        console.log('received image', image);
        setImage({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        })
        setImages(null);

      })
      .catch((e) => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

  const renderAsset = (image) => { return renderImage(image); }

  const renderImage = (image) => {
    return (
      <Image
        style={{ width: 650, height: 650, resizeMode: 'contain' }}
        source={image}
      />
    );
  }
  const renderImages = (item) => {
    return (
      <Image
        source={{ uri: item.item }}
        key={item.index}
        style={{
          width: 450,
          height: 650,
          resizeMode: 'contain',
          alignItems: 'center'

        }}
      />
    );
  };
  const getAllImages = () => {
    const ref = storage().ref('outputs/');
    ref.list().then((result) => {
      setAllImages([]);
      result.items.forEach((itemsRef) => {
        itemsRef.getDownloadURL().then((downloadURL) => {
          setAllImages((allImages) => [...allImages, downloadURL]);
        });
      });
    });
  };

  return (
    <ScrollView>
      <SafeAreaView >

        <View style={styles.container} >
          {image ? renderAsset(image) : null}
          {images
            ? images.map((i) => (
              <View key={i.uri}>{this.renderAsset(i)}</View>
            ))
            : null}
        </View>
        <View style={styles.container1}>
          <TouchableOpacity

            onPress={async () => {
              // const url = await storage()
              // .ref('detected-photo.jfif')
              // .getDownloadURL();
              let imageRef = await storage()
                .ref('detected-images');
              imageRef.getDownloadURL().then(url => {
                console.log(url);

              })
            }

            } style={styles.button}
          >
            <Text style={styles.text}>Download</Text>

          </TouchableOpacity>



          <TouchableOpacity
            onPress={async () => {
              console.log(image.uri)
              const reference = storage().ref('images');
              // path to existing file on filesystem
              const pathToFile = image.uri;
              // uploads file
              await reference.putFile(pathToFile);
            }
            } style={styles.button}
          >
            <Text style={styles.text}>Upload</Text>
          </TouchableOpacity>




          <TouchableOpacity
            onPress={() => pickSingleWithCamera(false)}
            style={styles.button}
          >
            <Text style={styles.text}>Camera</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container2}>
          <TouchableOpacity
            onPress={() => pickSingleWithCamera(true)}
            style={styles.button}
          >
            <Text style={styles.text}>
              Camera Cropping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity

            onPress={() => pickSingle(false)}
            style={styles.button}
          >
            <Text style={styles.text}>Select Single Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity transparent icon onPress={getAllImages} style={styles.button}>
            <Text style={styles.text}>Get Image Library</Text>
          </TouchableOpacity>
        </View>



        <View style={styles.flatContainer} >
          <FlatList
            style={styles.flat}
            data={allImages}
            horizontal={false}

            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImages}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //width:350
    justifyContent: 'center',
    alignItems: 'center',

  },
  flatContainer: {
    //flex: 1,
    //width:350
    //paddingRight:25,
    //justifyContent: 'center',
    //alignItems: 'center',

  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ccc",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 3,
    flexDirection: 'column'

  },
  text: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default imagecroppicker;
