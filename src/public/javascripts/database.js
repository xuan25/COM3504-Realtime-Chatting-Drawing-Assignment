let indexedDb;

const DB_NAME = "db_com3504";
const JOIN_STORE_NAME = "store_join";
const CHAT_HISTORY_STORE_NAME = "store_chat";
const DRAW_HISTORY_STORE_NAME = "store_draw";
const KG_HISTORY_STORE_NAME = "store_kg";
// const PICS_HISTORY_STORE_NAME = "store_pic";


// -------- init --------

async function initDatabase() {
  if (!indexedDb) {
    indexedDb = await idb.openDB(DB_NAME, 2, {
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
          drawHistoryDB.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: true,
          });
        }
        //kg
        if (!upgradeDb.objectStoreNames.contains(KG_HISTORY_STORE_NAME)) {
          let drawHistoryDB = upgradeDb.createObjectStore(
            KG_HISTORY_STORE_NAME,
            {
              keyPath: "id",
              autoIncrement: true,
            }
          );
          drawHistoryDB.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: true,
          });
        }
        //pic
        // if (!upgradeDb.objectStoreNames.contains(PICS_HISTORY_STORE_NAME)) {
        //   let picsHistoryDB = upgradeDb.createObjectStore(
        //     PICS_HISTORY_STORE_NAME,
        //     {
        //       keyPath: "id",
        //       autoIncrement: true,
        //     }
        //   );
        //   picsHistoryDB.createIndex("url", "url", {
        //     unique: false,
        //     multiEntry: true,
        //   });
        // }


      },
    });
    console.log("db created");
  }
}


// -------- join --------

async function storeUsername(username) {
  if (!indexedDb) {
    await initDatabase();
  }
  if (indexedDb) {
    try {
      await indexedDb.put(JOIN_STORE_NAME, username, "username");
    } catch (error) {
      console.log("IndexDB not available");
    }
  } else {
    console.log("IndexDB not available");
  }
}

async function getUsername() {
  if (!indexedDb) {
    await initDatabase();
  }

  if (indexedDb) {
    try {
      username = await indexedDb.get(JOIN_STORE_NAME, "username");
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
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(CHAT_HISTORY_STORE_NAME, "readwrite");
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
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(CHAT_HISTORY_STORE_NAME, "readonly");
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
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(CHAT_HISTORY_STORE_NAME, "readonly");
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
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(CHAT_HISTORY_STORE_NAME, "readwrite");
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


// -------- draw -------------

async function storeDraw(roomId, data) {
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(DRAW_HISTORY_STORE_NAME, 'readwrite');
      let store = await tx.objectStore(DRAW_HISTORY_STORE_NAME);
      data["roomId"] = roomId
      await store.put(data);
      await tx.complete;
    } catch (error) {
      console.log('IndexedDB not available');
    }
  } else {
    console.log('IndexedDB not available');
  }
}

async function getDrawHistories(roomId) { 
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(DRAW_HISTORY_STORE_NAME, 'readonly');
      let store = await tx.objectStore(DRAW_HISTORY_STORE_NAME);
      let index = await store.index("roomId");
      let draws = await index.getAll(IDBKeyRange.only(roomId));
      await tx.complete;
      return draws;
    } catch (error) {
      console.log(error);
      console.log('IndexedDB not available');
    }
  } else {
    console.log('IndexedDB not available');
  }
}

async function clearDrawHistories(roomId) {
  draws = await getDrawHistories(roomId)
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    for (let draw of draws) {
      try {
        let tx = await indexedDb.transaction(DRAW_HISTORY_STORE_NAME, "readwrite");
        let store = await tx.objectStore(DRAW_HISTORY_STORE_NAME);
        store.delete(IDBKeyRange.only(draw.id))
        await tx.complete;
      } catch (error) {
        console.log(error);
        console.log("IndexDB not available");
      }
    }
  } else {
    console.log("IndexDB not available");
  }
}


// -------- kg -------------

async function storeKg(roomId, data) {
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(KG_HISTORY_STORE_NAME, 'readwrite');
      let store = await tx.objectStore(KG_HISTORY_STORE_NAME);
      data["roomId"] = roomId
      await store.put(data);
      await tx.complete;
    } catch (error) {
      console.log('IndexedDB not available');
    }
  } else {
    console.log('IndexedDB not available');
  }
}

async function getKgHistories(roomId) { 
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    try {
      let tx = await indexedDb.transaction(KG_HISTORY_STORE_NAME, 'readonly');
      let store = await tx.objectStore(KG_HISTORY_STORE_NAME);
      let index = await store.index("roomId");
      let kgs = await index.getAll(IDBKeyRange.only(roomId));
      await tx.complete;
      return kgs;
    } catch (error) {
      console.log(error);
      console.log('IndexedDB not available');
    }
  } else {
    console.log('IndexedDB not available');
  }
}

async function clearKgHistories(roomId) {
  kgs = await getKgHistories(roomId)
  if (!indexedDb) await initDatabase();
  if (indexedDb) {
    for (let kg of kgs) {
      try {
        let tx = await indexedDb.transaction(KG_HISTORY_STORE_NAME, "readwrite");
        let store = await tx.objectStore(KG_HISTORY_STORE_NAME);
        store.delete(IDBKeyRange.only(kg.id))
        await tx.complete;
      } catch (error) {
        console.log(error);
        console.log("IndexDB not available");
      }
    }
  } else {
    console.log("IndexDB not available");
  }
}


// -------- pic --------

// async function storePics(url, roomId) {
//   if (!db) await initDatabase();
//   if (db) {
//     try {
//       let tx = await db.transaction(PICS_HISTORY_STORE_NAME, "readwrite");
//       let store = await tx.objectStore(PICS_HISTORY_STORE_NAME);
//       await store.put({
//         roomId: roomId,
//         url: url
//       });
//       await tx.complete;
//     } catch (error) {
//       console.log("IndexDB not available");
//     }
//   } else {
//     console.log("IndexDB not available");
//   }
// }

// async function getPics(url) {
//   if (!db) await initDatabase();
//   if (db) {
//     try {
//       console.log('fetching: ' + url);
//       let tx = await imgdb.transaction(PICS_STORE_NAME, 'readonly');
//       let store = await tx.objectStore(PICS_STORE_NAME);
//       let index = await store.index('url');
//       let pics = await index.getAll(IDBKeyRange.only(url));
//       await tx.complete;
//       return pics;
//     } catch (error) {
//       console.log(error);
//     }
//   } else {
//     console.log('IndexedDB not available');
//   }
// }


