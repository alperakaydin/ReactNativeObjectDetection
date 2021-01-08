import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Imagecroppicker from './src/imagecroppicker';
import { utils } from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml';
const App  = () => {

  // async function processLandmarks(localPath) {
  //   const landmarks = await ml().cloudLandmarkRecognizerProcessImage(localPath);
  
  //   landmarks.forEach(landmark => {
  //     console.log('Landmark name: ', landmark.landmark);
  //     console.log('Landmark locations: ', block.locations);
  //     console.log('Confidence score: ', block.confidence);
  //   });
  // }
  return (
    
      <Imagecroppicker />
    
    

    
    
  );
};

const styles = StyleSheet.create({
container:{flex :1 },
});

export default App;
