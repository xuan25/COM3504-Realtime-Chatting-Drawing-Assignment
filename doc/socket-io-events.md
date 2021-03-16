# Events

| Path  | Event         | Direction | Description                        | Params                    |
| ----- | ------------- | --------- | ---------------------------------- | ------------------------- |
| /chat | join          | c-s       | Join a room                        | room, img_uri, username   |
| /chat | joined        | s-c       | Joined a room                      |                           |
| /chat | new-member    | s-c       | A new member has joined            | username                  |
| /chat | post-chat     | c-s       | Post a chat message to others      | msg_id, message           |
| /chat | posted-chat   | s-c       | confirm a post                     | msg_id                    |
| /chat | recieve-chat  | s-c       | recieve a chat message from others | username, msg_id, message |
| /chat | member-left   | s-c       | A member has left                  | username                  |
| ----- | ------------- | --------- | ---------------------------------- |                           |
| /draw | post-start    | c-s       | Start a new draw                   |                           |
| /draw | post-move     | c-s       | Moves during a draw                |                           |
| /draw | post-end      | c-s       | End a draw                         |                           |
| /draw | post-path     | c-s       | Complete a full drawing path       |                           |
| /draw | recieve-start | s-c       | Broadcast of post-start            |                           |
| /draw | recieve-move  | s-c       | Broadcast of post-move             |                           |
| /draw | recieve-end   | s-c       | Broadcast of post-end              |                           |
| /draw | recieve-path  | s-c       | Broadcast of post-path             |                           |
| /draw | cls           | both      | Clear screen                       |                           |

## Note

| Direction | Description           |
| --------- | --------------------- |
| c-s       | Form client to server |
| s-c       | Form server to client |
| both      | Bidirectional         |
