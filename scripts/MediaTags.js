if (!window.MediaTags){
  window.MediaTags = window.jsmediatags;
  delete window.jsmediatags;
}
const MediaTags = window.MediaTags;
export default MediaTags;