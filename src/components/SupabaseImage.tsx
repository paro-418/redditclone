import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { downloadImage } from '../utils/imageStorage';
import { useClerkSupabase } from '../lib/supabase';

type SupabaseImageProps = {
  bucket: string;
  path: string;
} & ComponentProps<typeof Image>;

const SupabaseImage = ({ path, bucket, ...imageProps }: SupabaseImageProps) => {
  const supabaseNew = useClerkSupabase();
  const [postImage, setPostImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      if (path && bucket) {
        const img = await downloadImage(supabaseNew, bucket, path);
        setPostImage(img || '');
        setIsLoading(false);
      }
    };
    loadImage();
  }, [path, bucket]);
  // console.log('Post Image', postImage);

  if (isLoading) {
    return (
      <View
        style={[
          {
            backgroundColor: 'gainsboro',
            alignItems: 'center',
            justifyContent: 'center',
          },
          imageProps?.style,
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return <Image source={{ uri: postImage }} {...imageProps} />;
};

export default SupabaseImage;

const styles = StyleSheet.create({});
