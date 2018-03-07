import {WebConnection} from "./core/classes/web-connection.class";
import {Stream} from 'core/classes/stream.class';
import {Server} from './server-logic';

console.log('Started Worker');

const connectionsStream = new Stream();
new Server(connectionsStream);
connectionsStream.next(new WebConnection());
