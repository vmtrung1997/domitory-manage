function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

export const imageFile = (image) => {
  if (image && image!==null) {
    var base64Flag = 'data:image/jpeg;base64,';
    if (image.data.data){
    }
    var imageStr= image.data.data?arrayBufferToBase64(image.data.data):image.data;
    return base64Flag + imageStr;
  }
  return '';
}

export const defaultImage = 'https://akns-images.eonline.com/eol_images/Entire_Site/20181026/rs_600x600-181126230834-e-asia-iu-things-to-know-thumbnail.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=90'