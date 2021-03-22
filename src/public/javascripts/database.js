let db;

const DB_NAME = "db_com3504";
const JOIN_STORE_NAME = "store_join";
const CHAT_HISTORY_STORE_NAME = "store_chat";


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

async function storeChatHistory(roomId, username, msgId, message) {
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
    }
  } else {
    console.log("IndexDB not available");
  }
}
