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
        
        // TODO : Init chat db

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

// TODO : Store and retrive function
