let db;

const CHAT_DB_NAME= 'db_chat';
const CHAT_HISTORY_STORE_NAME= 'store_chat';

async function initDatabase(){
    if (!db) {
        db = await idb.openDB(CHAT_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(CHAT_HISTORY_STORE_NAME)) {

                    let chatHistoryDB = upgradeDb.createObjectStore(CHAT_HISTORY_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    chatHistoryDB.createIndex('roomId', 'roomId', {unique: false, multiEntry: true});

                }
            }
        });
        console.log('db created');
    }
}


async function storeChatHistory(roomId, username, msgId, message) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
            await store.put({"roomId": roomId, "username": username, "msgId": msgId, "message": message});
            await tx.complete;
        } catch(error) {
            console.log('IndexDB not available')
        };
    }
    else {
        console.log('IndexDB not available')
    }
}


async function getChatHistories(roomId) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(CHAT_HISTORY_STORE_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_HISTORY_STORE_NAME);
            let index = await store.index('roomId');
            let histories = await index.getAll(IDBKeyRange.only(roomId));
            await tx.complete;
            return histories;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('IndexDB not available')
    }
}
