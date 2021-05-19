let db;

const DB_NAME = "db_com3504";
const JOIN_STORE_NAME = "store_join";
const CHAT_HISTORY_STORE_NAME = "store_chat";
const DRAW_HISTORY_STORE_NAME = "store_draw";
const PICS_HISTORY_STORE_NAME = "store_pic";


async function initDatabase() {
  if (!db) {
    db = await idb.openDB(DB_NAME, 2, {
      upgrade(upgradeDb, oldVersion, newVersion) {

        // join
        if (!upgradeDb.objectStoreNames.contains(JOIN_STORE_NAME)) {
          let store = upgradeDb.createObjectStore(JOIN_STORE_NAME);
        }

        // chat
        if (!upgradeDb.objectStoreNames.contains(CHAT_HISTORY_STORE_NAME)) {
          let chatHistoryDB = upgradeDb.createObjectStore(
            CHAT_HISTORY_STORE_NAME,
            {
              keyPath: "id",
              autoIncrement: true,
            }
          );
          chatHistoryDB.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: true,
          });
          chatHistoryDB.createIndex("msgId", "msgId", {
            unique: false,
            multiEntry: true,
          });
        }
        //draw
        if (!upgradeDb.objectStoreNames.contains(DRAW_HISTORY_STORE_NAME)) {
          let drawHistoryDB = upgradeDb.createObjectStore(
            DRAW_HISTORY_STORE_NAME,
            {
              keyPath: "id",
              autoIncrement: true,
            }
          );
          drawHistoryDB.createIndex("roomURL", "roomURL", {
            unique: false,
            multiEntry: true,
          });
        }
        //pic
        if (!upgradeDb.objectStoreNames.contains(PICS_HISTORY_STORE_NAME)) {
          let picsHistoryDB = upgradeDb.createObjectStore(
            PICS_HISTORY_STORE_NAME,
            {
              keyPath: "id",
              autoIncrement: true,
            }
          );
          picsHistoryDB.createIndex("url", "url", {
            unique: false,
            multiEntry: true,
          });
        }


      },
    });
    console.log("db created");
  }
}

// -------- join --------

async function storeUsername(username) {
  if (!db) {
    await initDatabase();
  }
  if (db) {
    try {
      await db.put(JOIN_STORE_NAME, username, "username");
    } catch (error) {
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

async function getUsername() {
  if (!db) {
    await initDatabase();
  }

  if (db) {
    try {
      username = await db.get(JOIN_STORE_NAME, "username");
      return username;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("IndexDB not available");
  }
}

// -------- chat --------
async function storeChatHistory(roomId, username, msgId, message, isMe, isSend) {
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, "readwrite");
      let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
      await store.put({
        roomId: roomId,
        username: username,
        msgId: msgId,
        message: message,
        isMe: isMe,
        isSend: isSend
      });
      await tx.complete;
    } catch (error) {
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

async function getChatHistories(roomId) {
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, "readonly");
      let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
      let index = await store.index("roomId");
      let histories = await index.getAll(IDBKeyRange.only(roomId));
      await tx.complete;
      return histories;
    } catch (error) {
      console.log(error);
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

async function getChatHistoryByMsgId(msgId) {
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, "readonly");
      let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
      let index = await store.index("msgId");
      let hisytory = await index.get(IDBKeyRange.only(msgId));
      await tx.complete;
      return hisytory;
    } catch (error) {
      console.log(error);
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

async function deleteChatHistoryByMsgId(msgId) {
  msg = await getChatHistoryByMsgId(msgId)
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, "readwrite");
      let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
      store.delete(IDBKeyRange.only(msg.id))
      await tx.complete;
    } catch (error) {
      console.log(error);
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

// -------- pic --------
async function storePics(url, roomId) {
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(PICS_HISTORY_STORE_NAME, "readwrite");
      let store = await tx.objectStore(PICS_HISTORY_STORE_NAME);
      await store.put({
        roomId: roomId,
        url: url
      });
      await tx.complete;
    } catch (error) {
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}
async function getPics(url) {
  if (!db) await initDatabase();
  if (db) {
    try {
      console.log('fetching: ' + url);
      let tx = await imgdb.transaction(PICS_STORE_NAME, 'readonly');
      let store = await tx.objectStore(PICS_STORE_NAME);
      let index = await store.index('url');
      let pics = await index.getAll(IDBKeyRange.only(url));
      await tx.complete;
      return pics;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('IndexedDB not available');
  }
}
// -------- draw -------------

async function storeDraw(roomURL, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
  if (!db) await initDatabase();
  if (db) {
      try {
          let tx = await cvsdb.transaction(DRAW_STORE_NAME, 'readwrite');
          let store = await tx.objectStore(DRAW_STORE_NAME);
          await store.put({"roomURL": roomURL,"canvasWidth": canvasWidth,"canvasHeight": canvasHeight, "prevX": prevX, "prevY": prevY, "currX": currX, "currY": currY, "color":color,"thickness":thickness});
          await tx.complete;
      } catch (error) {
          console.log('IndexedDB not available');
      }
      ;
  } else {
      console.log('IndexedDB not available');
  }
}
async function getDraw(roomURL) {
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await cvsdb.transaction(DRAW_STORE_NAME, 'readonly');
      let store = await tx.objectStore(DRAW_STORE_NAME);
      let index = await store.index("roomURL");
      let draw = await index.getAll(IDBKeyRange.only(roomURL));
      await tx.complete;
      return draw;
    } catch (error) {
      console.log(error);
      console.log('IndexedDB not available');
    }
  } else {
    console.log('IndexedDB not available');
  }
}
async function getDrawHistoryByRoomUrl(roomURL) {
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, "readonly");
      let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
      let index = await store.index("roomURL");
      let hisytory = await index.get(IDBKeyRange.only(roomURL));
      await tx.complete;
      return hisytory;
    } catch (error) {
      console.log(error);
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

async function deleteDrawHistoryByRoomUrl(roomURL) {
  msg = await getDrawHistoryByRoomUrl(roomURL)
  if (!db) await initDatabase();
  if (db) {
    try {
      let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, "readwrite");
      let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
      store.delete(IDBKeyRange.only(msg.id))
      await tx.complete;
    } catch (error) {
      console.log(error);
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}
