import {Stream} from 'core/classes/stream.class';
import {Connection} from 'core/classes/connection.class';
import { Server } from './server-logic';

const connectionsStream = new Stream();
chrome.runtime.onConnect.addListener(port => connectionsStream.next(new Connection(port)));

new Server(connectionsStream);
