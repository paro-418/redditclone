import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

export const uploadImage = async (
  supabaseNew: SupabaseClient<Database>,
  uri: string
) => {
  const fileRes = await fetch(uri);
  const arrayBuffer = await fileRes.arrayBuffer();
  const fileExt = uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
  const path = `${Date.now()}.${fileExt}`;

  const { data, error } = await supabaseNew.storage
    .from('images')
    .upload(path, arrayBuffer);

  if (error) {
    console.log('error', error);
    return;
  }
  console.log('data', data);
  return data.path;
};

// export const downloadImage = async (
//   supabaseNew: SupabaseClient<Database>,
//   image: string
// ) => {
//   const { data } = await supabaseNew.storage
//     .from('images')
//     .createSignedUrl(image, 360000);
//   // console.log('image data', data);
//   return data?.signedUrl;
// };
export const downloadImage = async (
  supabaseNew: SupabaseClient<Database>,
  bucket: string,
  path: string
) => {
  const { data } = await supabaseNew.storage
    .from(bucket)
    .createSignedUrl(path, 360000);
  // console.log('image data', data);
  return data?.signedUrl;
};

// THIS FN WAS FROM TUTORIAL
// export const downloadImage = async (
//   supabaseNew: SupabaseClient<Database>,
//   image: string
// ) => {
//   const { data, error } = await supabaseNew.storage
//     .from('images')
//     .download(image);

//   if (error) {
//     console.log('error', error);
//     return;
//   }
//   // data will contain blob
//   const fr = new FileReader();
//   fr.readAsDataURL(data);
//   fr.onload = () => {
//     return fr.result as string;
//   };

//   console.log('image data', data);
//   return data;
// };
