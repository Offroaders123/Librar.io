// JS MediaTags library to be able to parse song file metadata!
/* Temporary import fix located here to use JS MediaTags as an ES Module. */
if (!window.jsMediaTags){
  window.jsMediaTags = window.jsmediatags;
  delete window.jsmediatags;
}
const jsMediaTags = window.jsMediaTags;
export default jsMediaTags;