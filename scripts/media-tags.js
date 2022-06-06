// JS MediaTags library to be able to parse song file metadata!
/* This is my placeholder import setup to be able to use JS MediaTags as an ES Module, since once isn't provided by the developer as of yet. */
/* I tried importing the minified version of the library using `import`, but it cuased it to throw errors, likely because it wasn't designed to run in strict mode. */

const { jsmediatags: MediaTags } = window;
delete window.jsmediatags;

const { read, Reader, Config } = MediaTags;

export { read, Reader, Config };

export default { read, Reader, Config, [Symbol.toStringTag]: "MediaTags" };