// IDB-Keyval library to allow for simple interaction with IndexedDB.
import { get, set } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

export { get, set };

export default { get, set, [Symbol.toStringTag]: "IDB" };