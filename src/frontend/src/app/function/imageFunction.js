function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

export const imageFile = (image) => {
  if (image) {
    var base64Flag = 'data:image/jpeg;base64,';
    if (image.data.data){
      console.log(image)
    }
    var imageStr= image.data.data?arrayBufferToBase64(image.data.data):image.data;
    return base64Flag + imageStr;
  }
  return '';
}